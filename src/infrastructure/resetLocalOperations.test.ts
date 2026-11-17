import { describe, expect, it, vi } from 'vitest'
import { APPLIED_RESET_KEY, OPERATIONS_BACKUP_KEY, applyApprovedLocalResetOnce, resetLocalOperations } from './resetLocalOperations'

function storageFor(entries: Record<string, string>) {
  const data = new Map(Object.entries(entries))
  const storage: Storage = {
    get length() { return data.size },
    key: index => [...data.keys()][index] ?? null,
    getItem: key => data.get(key) ?? null,
    setItem: vi.fn((key, value) => { data.set(key, value) }),
    removeItem: key => { data.delete(key) },
    clear: () => data.clear(),
  }
  return storage
}

describe('reinicio explícito de operaciones', () => {
  it('aplica una autorización local una sola vez y conserva las pruebas nuevas al volver a entrar', () => {
    const storage = storageFor({ alojamanta_guest_reservations: '[{"id":"anterior"}]' })
    expect(applyApprovedLocalResetOnce('', storage)).toBe(false)
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[{"id":"anterior"}]')
    expect(applyApprovedLocalResetOnce('prueba-autorizada', storage)).toBe(true)
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[]')
    storage.setItem('alojamanta_guest_reservations', '[{"id":"nueva"}]')
    expect(applyApprovedLocalResetOnce('prueba-autorizada', storage)).toBe(false)
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[{"id":"nueva"}]')
    expect(storage.getItem(APPLIED_RESET_KEY)).toBe('prueba-autorizada')
  })

  it('no deja aplicado un reinicio si falla el guardado del identificador de autorización', () => {
    const storage = storageFor({ alojamanta_guest_reservations: '[{"id":"anterior"}]' })
    const original = storage.setItem.bind(storage)
    storage.setItem = vi.fn((key, value) => { if (key === APPLIED_RESET_KEY) throw new Error('quota'); original(key, value) })
    expect(() => applyApprovedLocalResetOnce('prueba-autorizada', storage)).toThrow('quota')
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[{"id":"anterior"}]')
    expect(storage.getItem(APPLIED_RESET_KEY)).toBeNull()
  })

  it('respalda las operaciones y elimina también las fuentes antiguas, conservando catálogo, inventario y perfiles', () => {
    const storage = storageFor({ alojamanta_guest_reservations: '[{"id":"test"}]', hoteldirekt_guest_reservations: '[{"id":"legacy"}]',
      alojamanta_room_availability: '{"hotel::room":0}', 'hoteldirekt.hotel.reservations': '[{"id":"manual"}]',
      'hoteldirekt.hotel.payments': '[{"id":"payment"}]', 'hoteldirekt.hotel.room_offers': '[{"available":5}]',
      'hoteldirekt.hotels.manta_116': '[]', alojamanta_profile_test: '{"name":"Test"}', 'hoteldirekt.theme': '"dark"' })
    resetLocalOperations(storage)
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[]')
    expect(storage.getItem('hoteldirekt_guest_reservations')).toBeNull()
    expect(storage.getItem('hoteldirekt.hotel.reservations')).toBeNull()
    expect(storage.getItem('hoteldirekt.hotel.payments')).toBeNull()
    expect(storage.getItem('alojamanta_room_availability')).toBeNull()
    expect(storage.getItem('hoteldirekt.hotel.room_offers')).toBe('[{"available":5}]')
    expect(storage.getItem('alojamanta_profile_test')).toBe('{"name":"Test"}')
    expect(storage.getItem('hoteldirekt.theme')).toBe('"dark"')
    expect(JSON.parse(storage.getItem(OPERATIONS_BACKUP_KEY)!).values.alojamanta_guest_reservations).toBe('[{"id":"test"}]')
  })

  it('no borra nada si no se puede guardar el respaldo', () => {
    const storage = storageFor({ alojamanta_guest_reservations: '[{"id":"test"}]' })
    vi.mocked(storage.setItem).mockImplementationOnce(() => { throw new Error('quota') })
    expect(() => resetLocalOperations(storage)).toThrow('quota')
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[{"id":"test"}]')
  })

  it('restaura las operaciones si falla la escritura posterior al borrado', () => {
    const storage = storageFor({ alojamanta_guest_reservations: '[{"id":"test"}]', 'hoteldirekt.hotel.reservations': '[1]' })
    const setItem = storage.setItem.bind(storage)
    storage.setItem = vi.fn((key, value) => { if (key === 'alojamanta_guest_reservations' && value === '[]') throw new Error('quota'); setItem(key, value) })
    expect(() => resetLocalOperations(storage)).toThrow('quota')
    expect(storage.getItem('alojamanta_guest_reservations')).toBe('[{"id":"test"}]')
    expect(storage.getItem('hoteldirekt.hotel.reservations')).toBe('[1]')
  })
})

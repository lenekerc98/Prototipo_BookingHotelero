import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createLocalRoomAvailabilityRepository } from './localRoomAvailabilityRepository'

const availabilityKey = 'alojamanta_room_availability'
let data: Map<string, string>
let storage: Pick<Storage, 'getItem' | 'setItem'>

beforeEach(() => {
  data = new Map()
  storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => { data.set(key, value) },
  }
})

describe('adaptador local de disponibilidad', () => {
  it('mantiene el formato existente y los cupos de otras habitaciones y hoteles', () => {
    data.set(availabilityKey, '{"hotel-a::doble":2,"hotel-a::triple":4,"hotel-b::doble":6}')
    const repository = createLocalRoomAvailabilityRepository(() => storage)
    expect(repository.get('hotel-a', 'doble')).toBe(2)
    repository.set('hotel-a', 'doble', 0)
    expect(JSON.parse(data.get(availabilityKey)!)).toEqual({
      'hotel-a::doble': 0, 'hotel-a::triple': 4, 'hotel-b::doble': 6,
    })
  })

  it('descarta valores dañados sin descartar cupos válidos', () => {
    data.set(availabilityKey, '{"hotel-a::doble":0,"hotel-b::doble":-1,"hotel-c::doble":"2"}')
    const repository = createLocalRoomAvailabilityRepository(() => storage)
    expect(repository.get('hotel-a', 'doble')).toBe(0)
    expect(repository.get('hotel-b', 'doble')).toBeUndefined()
    expect(repository.get('hotel-c', 'doble')).toBeUndefined()
    repository.set('hotel-d', 'doble', 2)
    expect(JSON.parse(data.get(availabilityKey)!)).toEqual({ 'hotel-a::doble': 0, 'hotel-d::doble': 2 })
  })

  it('lee cambios de otra instancia sin caché y preserva las reservas', () => {
    data.set('alojamanta_guest_reservations', '[]')
    const first = createLocalRoomAvailabilityRepository(() => storage)
    const second = createLocalRoomAvailabilityRepository(() => storage)
    expect(first.get('hotel-a', 'doble')).toBeUndefined()
    second.set('hotel-a', 'doble', 2)
    expect(first.get('hotel-a', 'doble')).toBe(2)
    first.set('hotel-b', 'doble', 4)
    expect(second.get('hotel-a', 'doble')).toBe(2)
    expect(data.get('alojamanta_guest_reservations')).toBe('[]')
  })

  it('tolera almacenamiento inaccesible y no lo consulta durante la construcción', () => {
    const getStorage = vi.fn(() => { throw new Error('blocked') })
    const repository = createLocalRoomAvailabilityRepository(getStorage)
    expect(getStorage).not.toHaveBeenCalled()
    expect(repository.get('hotel-a', 'doble')).toBeUndefined()
    expect(() => repository.set('hotel-a', 'doble', 2)).not.toThrow()
  })

  it('conserva los datos cuando una escritura falla', () => {
    data.set(availabilityKey, '{"hotel-a::doble":2}')
    const repository = createLocalRoomAvailabilityRepository(() => ({
      getItem: storage.getItem,
      setItem: () => { throw new Error('quota exceeded') },
    }))
    repository.set('hotel-a', 'doble', 1)
    expect(repository.get('hotel-a', 'doble')).toBe(2)
  })
})

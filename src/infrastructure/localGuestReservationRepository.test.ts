import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type { MyReservation } from '../features/reservations/types'
import { GUEST_RESERVATIONS_KEY, readGuestReservationsRaw } from '../storage'
import { createLocalGuestReservationRepository } from './localGuestReservationRepository'
import { INITIAL_DEMO_RESERVATIONS, MANTA_HOTELS } from '../mantaHotels'

const legacyKey = 'hoteldirekt_guest_reservations'
const reservation: MyReservation = {
  id: 'RES-TEST-001', hotel: 'Hotel de prueba', hotelId: 'hotel-prueba',
  city: 'Manta', room: 'Doble', checkIn: '2026-12-01', checkOut: '2026-12-03',
  nights: 2, total: 100, status: 'upcoming', image: '',
  guestName: 'Huésped de prueba', guestEmail: 'huesped@example.test',
}
let data: Map<string, string>
let storage: Pick<Storage, 'getItem' | 'setItem'>

beforeEach(() => {
  data = new Map()
  storage = {
    getItem: key => data.get(key) ?? null,
    setItem: (key, value) => { data.set(key, value) },
  }
})
afterEach(() => vi.unstubAllGlobals())

describe('repositorio local de reservas del portal', () => {
  it('oculta ejemplos conocidos sin borrar el almacenamiento ni excluir nuevas pruebas del mismo huésped', () => {
    const custom = { ...INITIAL_DEMO_RESERVATIONS[0], id: 'RES-MANUAL-NEW' }
    const raw = JSON.stringify([...INITIAL_DEMO_RESERVATIONS, custom, reservation])
    data.set(GUEST_RESERVATIONS_KEY, raw)
    expect(createLocalGuestReservationRepository(() => storage).read()).toEqual([custom, reservation])
    expect(data.get(GUEST_RESERVATIONS_KEY)).toBe(raw)
  })

  it('incorpora reservas manuales del panel anterior, descarta sus ejemplos y no duplica copias del portal', () => {
    const hotel = MANTA_HOTELS[0]
    data.set(`hoteldirekt.${hotel.id}.reservations`, JSON.stringify([
      { id: 'RES-002', guestEmail: 'lfernandez@hotmail.com', checkIn: '2026-08-15', total: 55 },
      { ...reservation, roomType: hotel.rooms[0].type, source: 'Directo Web', status: 'checkin' },
      { ...reservation, id: 'RES-COPY', source: 'Portal AlojaManta' },
    ]))
    const repository = createLocalGuestReservationRepository(() => storage)
    expect(repository.read()).toHaveLength(1)
    expect(repository.read()![0]).toMatchObject({ id: reservation.id, hotelId: hotel.id, roomId: hotel.rooms[0].id, status: 'validated' })
    repository.save(repository.read()!)
    expect(repository.read()).toHaveLength(1)
  })

  it('distingue ausencia de datos de una lista guardada vacía', () => {
    const repository = createLocalGuestReservationRepository(() => storage)
    expect(repository.read()).toBeNull()
    expect(data.size).toBe(0)
    data.set(GUEST_RESERVATIONS_KEY, '[]')
    expect(repository.read()).toEqual([])
  })

  it('lee la clave heredada sin modificar ni migrar los datos al consultar', () => {
    const raw = JSON.stringify([reservation])
    data.set(legacyKey, raw)
    const repository = createLocalGuestReservationRepository(() => storage)
    expect(repository.read()).toEqual([reservation])
    expect(data.get(legacyKey)).toBe(raw)
    expect(data.has(GUEST_RESERVATIONS_KEY)).toBe(false)
  })

  it('prioriza la clave actual incluso cuando la lista está vacía', () => {
    data.set(legacyKey, JSON.stringify([reservation]))
    data.set(GUEST_RESERVATIONS_KEY, '[]')
    expect(createLocalGuestReservationRepository(() => storage).read()).toEqual([])
  })

  it.each(['{', '', 'null', '{}', 'true', '42', '"reservas"'])(
    'devuelve ausencia recuperable para una lista inválida sin escribir: %s', raw => {
      data.set(GUEST_RESERVATIONS_KEY, raw)
      data.set(legacyKey, JSON.stringify([reservation]))
      expect(createLocalGuestReservationRepository(() => storage).read()).toBeNull()
      expect(data.get(GUEST_RESERVATIONS_KEY)).toBe(raw)
    },
  )

  it('guarda en la clave actual sin borrar la heredada ni datos de otros módulos', () => {
    const raw = JSON.stringify([reservation])
    data.set(legacyKey, raw)
    data.set('alojamanta_room_availability', '{"hotel-prueba::doble":2}')
    const repository = createLocalGuestReservationRepository(() => storage)
    const updated = [{ ...reservation, status: 'cancelled' as const }]
    expect(repository.save(updated)).toBe(true)
    expect(repository.read()).toEqual(updated)
    expect(data.get(legacyKey)).toBe(raw)
    expect(data.get('alojamanta_room_availability')).toBe('{"hotel-prueba::doble":2}')
  })

  it('comparte cambios entre instancias y no conserva una copia obsoleta', () => {
    const portal = createLocalGuestReservationRepository(() => storage)
    const panel = createLocalGuestReservationRepository(() => storage)
    portal.save([reservation])
    expect(panel.read()).toEqual([reservation])
    panel.save([{ ...reservation, status: 'completed' }])
    expect(portal.read()?.[0].status).toBe('completed')
  })

  it('no altera los datos persistidos al modificar el resultado de una lectura', () => {
    const repository = createLocalGuestReservationRepository(() => storage)
    repository.save([reservation])
    const loaded = repository.read()!
    loaded[0].status = 'cancelled'
    loaded.push({ ...reservation, id: 'RES-TEST-002' })
    expect(repository.read()).toEqual([reservation])
  })

  it('conserva campos adicionales de registros existentes al leer y guardar', () => {
    const existing = { ...reservation, guestPhone: '0000000000', notes: 'Dato demo heredado' }
    data.set(legacyKey, JSON.stringify([existing]))
    const repository = createLocalGuestReservationRepository(() => storage)
    repository.save(repository.read()!)
    expect(JSON.parse(data.get(GUEST_RESERVATIONS_KEY)!)).toEqual([existing])
  })

  it('no accede al almacenamiento al construir el repositorio', () => {
    const getStorage = vi.fn(() => { throw new Error('blocked') })
    const repository = createLocalGuestReservationRepository(getStorage)
    expect(getStorage).not.toHaveBeenCalled()
    expect(repository.read()).toBeNull()
    expect(repository.save([reservation])).toBe(false)
  })

  it('informa el fallo de escritura sin perder los datos anteriores', () => {
    data.set(GUEST_RESERVATIONS_KEY, JSON.stringify([reservation]))
    const repository = createLocalGuestReservationRepository(() => ({
      getItem: storage.getItem,
      setItem: () => { throw new Error('quota exceeded') },
    }))
    expect(repository.save([])).toBe(false)
    expect(repository.read()).toEqual([reservation])
  })

  it('mantiene el acceso anterior desde storage.ts y el proveedor por defecto', () => {
    vi.stubGlobal('localStorage', storage)
    data.set(legacyKey, JSON.stringify([reservation]))
    expect(readGuestReservationsRaw()).toBe(JSON.stringify([reservation]))
    const repository = createLocalGuestReservationRepository()
    expect(repository.read()).toEqual([reservation])
    expect(repository.save([])).toBe(true)
    expect(readGuestReservationsRaw()).toBe('[]')
  })
})

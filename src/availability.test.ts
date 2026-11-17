import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { consumeRoomAvailability, getRoomAvailability, releaseRoomAvailability } from './availability'
import type { RoomOffer } from './mantaHotels'

const room: RoomOffer = {
  id: 'doble', type: 'Doble', beds: '2', capacity: 2, size: 20,
  pricePerNight: 50, image: '', amenities: [], available: 3,
}
let data: Map<string, string>

beforeEach(() => {
  data = new Map()
  vi.stubGlobal('localStorage', {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
  })
})
afterEach(() => vi.unstubAllGlobals())

describe('disponibilidad local del prototipo', () => {
  it('consume y libera cupos sin mezclar hoteles con el mismo tipo de habitación', () => {
    expect(consumeRoomAvailability('hotel-a', room, 2)).toBe(1)
    expect(getRoomAvailability('hotel-a', room)).toBe(1)
    expect(getRoomAvailability('hotel-b', room)).toBe(3)
    expect(releaseRoomAvailability('hotel-a', room)).toBe(2)
  })

  it('no devuelve disponibilidad negativa al agotar cupos', () => {
    expect(consumeRoomAvailability('hotel-a', room, 5)).toBe(0)
    expect(consumeRoomAvailability('hotel-a', room)).toBe(0)
  })

  it.each(['{', 'null', '[]', '{"hotel-a::doble":-2}', '{"hotel-a::doble":"99"}', '{"hotel-a::doble":1.5}'])(
    'recupera el catálogo ante datos dañados: %s', raw => {
      data.set('alojamanta_room_availability', raw)
      expect(getRoomAvailability('hotel-a', room)).toBe(3)
      expect(consumeRoomAvailability('hotel-a', room)).toBe(2)
    },
  )

  it.each([-1, 0, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'rechaza cantidades inválidas sin alterar cupos: %s', qty => {
      expect(() => consumeRoomAvailability('hotel-a', room, qty)).toThrow(RangeError)
      expect(() => releaseRoomAvailability('hotel-a', room, qty)).toThrow(RangeError)
      expect(getRoomAvailability('hotel-a', room)).toBe(3)
    },
  )

  it('permite explorar el catálogo aunque el navegador bloquee almacenamiento', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => { throw new Error('blocked') },
      setItem: () => { throw new Error('blocked') },
    })
    expect(getRoomAvailability('hotel-a', room)).toBe(3)
    expect(consumeRoomAvailability('hotel-a', room)).toBe(2)
  })
})

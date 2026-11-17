import { describe, expect, it, vi } from 'vitest'
import { createRoomAvailabilityService } from './availability'
import type { RoomAvailabilityRepository } from './repositories'

const room = { id: 'doble', available: 3 }

function setup(available?: number) {
  const repository = {
    get: vi.fn(() => available),
    set: vi.fn(),
  } satisfies RoomAvailabilityRepository
  return { repository, service: createRoomAvailabilityService(repository) }
}

describe('servicio de disponibilidad independiente del navegador', () => {
  it('consulta el repositorio por hotel y habitación y usa el catálogo como respaldo', () => {
    const { repository, service } = setup()
    expect(service.getRoomAvailability('hotel-a', room)).toBe(3)
    expect(repository.get).toHaveBeenCalledWith('hotel-a', 'doble')
    expect(repository.set).not.toHaveBeenCalled()
  })

  it('respeta un cupo persistido en cero', () => {
    const { service } = setup(0)
    expect(service.getRoomAvailability('hotel-a', room)).toBe(0)
  })

  it('consume una unidad por defecto sin modificar el catálogo', () => {
    const { repository, service } = setup()
    expect(service.consumeRoomAvailability('hotel-a', room)).toBe(2)
    expect(repository.set).toHaveBeenCalledWith('hotel-a', 'doble', 2)
    expect(room.available).toBe(3)
  })

  it('conserva la saturación a cero de la demo', () => {
    const { repository, service } = setup(1)
    expect(service.consumeRoomAvailability('hotel-a', room, 2)).toBe(0)
    expect(repository.set).toHaveBeenCalledWith('hotel-a', 'doble', 0)
  })

  it('libera la cantidad solicitada sobre el valor persistido', () => {
    const { repository, service } = setup(0)
    expect(service.releaseRoomAvailability('hotel-a', room, 2)).toBe(2)
    expect(repository.set).toHaveBeenCalledWith('hotel-a', 'doble', 2)
  })

  it('conserva la liberación sin tope de capacidad de la demo', () => {
    const { repository, service } = setup(3)
    expect(service.releaseRoomAvailability('hotel-a', room)).toBe(4)
    expect(repository.set).toHaveBeenCalledWith('hotel-a', 'doble', 4)
  })

  it.each([-1, 0, 0.5, NaN, Infinity, Number.MAX_SAFE_INTEGER + 1])(
    'rechaza cantidades inválidas antes de acceder al repositorio: %s', qty => {
      const { repository, service } = setup()
      expect(() => service.consumeRoomAvailability('hotel-a', room, qty)).toThrow(RangeError)
      expect(() => service.releaseRoomAvailability('hotel-a', room, qty)).toThrow(RangeError)
      expect(repository.get).not.toHaveBeenCalled()
      expect(repository.set).not.toHaveBeenCalled()
    },
  )
})

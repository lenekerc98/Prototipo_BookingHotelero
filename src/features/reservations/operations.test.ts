import { describe, expect, it } from 'vitest'
import { guestDirectory, hotelMetrics } from './operations'
import type { MyReservation } from './types'

const booking: MyReservation = {
  id: 'RES-TEST', hotelId: 'a', hotel: 'Hotel de prueba', city: 'Manta', room: 'Doble',
  checkIn: '2026-11-15', checkOut: '2026-11-17', nights: 2, total: 100, status: 'pending',
  image: '', guestName: 'Persona de prueba', guestEmail: 'guest@example.test',
}

describe('indicadores de operaciones locales', () => {
  it('comienza vacío y no trata confirmaciones, validaciones o métodos heredados como cobros', () => {
    expect(hotelMetrics([], 'a', '2026-11-15')).toMatchObject({ reservations: 0, totalCollected: 0, heldToday: 0 })
    const rows: MyReservation[] = [booking, { ...booking, id: '2', status: 'confirmed', payMethod: 'Tarjeta' },
      { ...booking, id: '3', status: 'validated', paymentStatus: 'paid' },
      { ...booking, id: '4', status: 'cancelled' }, { ...booking, id: '5', hotelId: 'b' }]
    expect(hotelMetrics(rows, 'a', '2026-11-15')).toEqual({ reservations: 4, pending: 1, heldToday: 3, arrivals: 1, totalCollected: 0, monthCollected: 0, outstanding: 200 })
    expect(hotelMetrics(rows, 'a', '2026-11-17').heldToday).toBe(0)
  })

  it('agrupa fichas por correo y hotel; cuenta únicamente cobros registrados y estancias completadas', () => {
    const payment = { amount: 100, method: 'Efectivo' as const, reference: '', recordedAt: '2026-11-15T15:00:00Z', recordedBy: 'Operador' }
    const rows: MyReservation[] = [booking, { ...booking, id: '2', guestEmail: 'GUEST@example.test', status: 'completed', paymentStatus: 'paid', payment },
      { ...booking, id: '3', hotelId: 'b', paymentStatus: 'paid', payment }]
    const [guest] = guestDirectory(rows, 'a')
    expect(guest.history).toHaveLength(2)
    expect(guest.completed).toBe(1)
    expect(guest.totalPaid).toBe(100)
    expect(hotelMetrics(rows, 'a', '2026-11-15')).toMatchObject({ totalCollected: 100, monthCollected: 100 })
    expect(hotelMetrics(rows, 'a', '2026-12-15').monthCollected).toBe(0)
  })
})

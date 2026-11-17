import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { ATTENTION_TARGET_MS, portalRequestEligibility, RESPONSE_WINDOW_MS, responseDeadline } from './deadlines'
import { canCancelReservation, getReservationStatus } from './status'
import { countHeldRooms, createReservationWorkflow } from './workflow'
import { hotelMetrics } from './operations'
import type { MyReservation, ReservationRequest } from './types'

const createdAt = '2026-11-16T19:00:00.000Z'
const created = Date.parse(createdAt)
const room = { id: 'doble', available: 1 }
const request: ReservationRequest = {
  id: 'RES-PLAZO', hotelId: 'hotel-a', hotel: 'Hotel de prueba', city: 'Manta', room: 'Doble',
  checkIn: '2026-11-17', checkOut: '2026-11-19', total: 100,
  image: '', guestName: 'Prueba de plazos', guestEmail: 'plazos@example.test',
}
const pending: MyReservation = {
  ...request, status: 'pending', paymentStatus: 'pending', roomId: room.id,
  inventoryMode: 'nightly', nights: 2, createdAt,
}

beforeEach(() => vi.setSystemTime(created))
afterEach(() => vi.useRealTimers())

function setup(initial: MyReservation[] = [pending], arrivalTime: string | null = '14:00') {
  let stored = structuredClone(initial)
  const repository = {
    read: () => structuredClone(stored),
    save: vi.fn((rows: MyReservation[]) => { stored = structuredClone(rows); return true }),
  }
  const options = { repository, getBaseAvailability: () => 1, getArrivalTime: () => arrivalTime }
  const workflow = createReservationWorkflow(options)
  return { repository, workflow, reload: () => createReservationWorkflow(options) }
}

describe('vencimiento de solicitudes a las 24 horas', () => {
  it('el objetivo de 2 horas no vence y el límite de 24 horas es inclusivo', () => {
    const { workflow, repository } = setup()
    for (const elapsed of [ATTENTION_TARGET_MS, ATTENTION_TARGET_MS + 1, RESPONSE_WINDOW_MS - 1]) {
      vi.setSystemTime(created + elapsed)
      workflow.expirePending()
      expect(workflow.list()[0].status).toBe('pending')
      expect(workflow.getAvailability(request.hotelId, room, request)).toBe(0)
    }
    expect(repository.save).not.toHaveBeenCalled()
    vi.setSystemTime(created + RESPONSE_WINDOW_MS)
    expect(getReservationStatus(pending)).toBe('expired')
    expect(canCancelReservation(pending)).toBe(false)
    expect(countHeldRooms([pending], request.hotelId, room.id, request)).toBe(0)
    workflow.expirePending()
    expect(repository.read()[0]).toMatchObject({ status: 'expired', expiredAt: '2026-11-17T19:00:00.000Z' })
    expect(workflow.getAvailability(request.hotelId, room, request)).toBe(1)
    workflow.expirePending()
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(hotelMetrics(workflow.list(), request.hotelId, request.checkIn)).toMatchObject({ pending: 0, heldToday: 0, totalCollected: 0, outstanding: 0 })
  })

  it.each(['accept', 'reject', 'validate', 'cancel'] as const)('impide %s después del límite incluso sin refrescar antes', action => {
    const { workflow, repository } = setup()
    expect(workflow.list()[0].status).toBe('pending')
    vi.setSystemTime(created + RESPONSE_WINDOW_MS)
    expect(() => action === 'cancel' ? workflow.cancel(request.id) : workflow[action](request.hotelId, request.id)).toThrow('venció')
    expect(repository.read()[0].status).toBe('expired')
  })

  it('acepta un milisegundo antes del vencimiento y conserva su apartado después', () => {
    const { workflow } = setup()
    vi.setSystemTime(created + RESPONSE_WINDOW_MS - 1)
    workflow.accept(request.hotelId, request.id)
    vi.setSystemTime(created + RESPONSE_WINDOW_MS + 1)
    workflow.expirePending()
    expect(workflow.list()[0].status).toBe('confirmed')
    expect(workflow.getAvailability(request.hotelId, room, request)).toBe(0)
  })

  it.each(['confirmed', 'validated', 'completed', 'cancelled', 'rejected', 'upcoming', 'expired'] as const)('conserva el estado %s', status => {
    const { workflow, repository } = setup([{ ...pending, status }])
    vi.setSystemTime(created + RESPONSE_WINDOW_MS * 2)
    workflow.expirePending()
    expect(workflow.list()[0].status).toBe(status)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it.each([undefined, '', 'sin-fecha', '2026-11-16', '2026-11-16T14:00:00', '2026-02-30T00:00:00Z'])('conserva la solicitud antigua sin inventar fecha: %s', invalid => {
    const old = { ...pending, createdAt: invalid }
    const { workflow, repository } = setup([old])
    vi.setSystemTime(created + RESPONSE_WINDOW_MS * 2)
    workflow.expirePending()
    expect(responseDeadline(old)).toBeNull()
    expect(workflow.list()[0]).toEqual(old)
    expect(workflow.getAvailability(request.hotelId, room, request)).toBe(0)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('no vence pendientes con un pago anterior', () => {
    const paid = { ...pending, paymentStatus: 'paid' as const }
    const recorded = { ...pending, id: 'RES-PAGO', payment: { amount: 100, method: 'Efectivo' as const, reference: '', recordedBy: 'Operador', recordedAt: createdAt } }
    const { workflow, repository } = setup([paid, recorded])
    vi.setSystemTime(created + RESPONSE_WINDOW_MS * 2)
    workflow.expirePending()
    expect(workflow.list()).toEqual([paid, recorded])
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('reconcilia al reabrir y no repite la liberación', () => {
    const { reload, repository } = setup()
    vi.setSystemTime(created + RESPONSE_WINDOW_MS * 2)
    const reopened = reload()
    expect(reopened.list()[0].status).toBe('expired')
    reopened.expirePending()
    reload().expirePending()
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(reopened.getAvailability(request.hotelId, room, request)).toBe(1)
    reopened.submit({ ...request, id: 'RES-NUEVA' }, room)
    expect(reopened.getAvailability(request.hotelId, room, request)).toBe(0)
  })

  it('si falla el guardado conserva los datos y bloquea la aceptación tardía', () => {
    const { workflow, repository } = setup()
    repository.save.mockReturnValue(false)
    vi.setSystemTime(created + RESPONSE_WINDOW_MS)
    expect(() => workflow.expirePending()).toThrow('guardar')
    expect(repository.read()[0].status).toBe('pending')
    expect(workflow.list()[0].status).toBe('expired')
    expect(() => workflow.accept(request.hotelId, request.id)).toThrow('guardar')
    expect(repository.read()[0].status).toBe('pending')
  })

  it('acepta fechas de creación con desplazamiento horario explícito', () => {
    expect(responseDeadline({ ...pending, createdAt: '2026-11-16T14:00:00-05:00' })).toBe(created + RESPONSE_WINDOW_MS)
  })
})

describe('anticipación según hora de llegada del establecimiento', () => {
  it('permite exactamente 24 horas, bloquea un milisegundo después y distingue hoteles', () => {
    expect(portalRequestEligibility(request.checkIn, '14:00', created).allowed).toBe(true)
    expect(portalRequestEligibility(request.checkIn, '14:00', created + 1).allowed).toBe(false)
    expect(portalRequestEligibility(request.checkIn, '13:59', created).allowed).toBe(false)
    expect(portalRequestEligibility(request.checkIn, '14:01', created).allowed).toBe(true)
  })

  it.each([null, '', '24:00', '12:60', 'texto'])('no inventa hora cuando la configuración es %s', value => {
    expect(portalRequestEligibility('2026-12-20', value).allowed).toBe(false)
    const { workflow, repository } = setup([], value)
    expect(() => workflow.submitPortal(request, room)).toThrow('configurado')
    expect(repository.save).not.toHaveBeenCalled()
  })

  it('guarda la hora aplicada y conserva el plazo aunque después entre en la ventana próxima', () => {
    const { workflow } = setup([])
    const result = workflow.submitPortal(request, room)
    expect(result.arrivalAt).toBe('2026-11-17T14:00:00-05:00')
    vi.setSystemTime(created + ATTENTION_TARGET_MS)
    expect(workflow.list()[0].status).toBe('pending')
    expect(workflow.accept(request.hotelId, request.id).status).toBe('confirmed')
  })

  it('el envío vuelve a comprobar la anticipación y recepción conserva el registro asistido', () => {
    const { workflow, repository } = setup([])
    expect(portalRequestEligibility(request.checkIn, '14:00').allowed).toBe(true)
    vi.setSystemTime(created + 1)
    expect(() => workflow.submitPortal(request, room)).toThrow('menos de 24 horas')
    expect(repository.save).not.toHaveBeenCalled()
    expect(workflow.submit(request, room).status).toBe('pending')
    expect(() => workflow.submit({ ...request, id: 'OTRA' }, room)).toThrow('No quedan cupos')
  })
})

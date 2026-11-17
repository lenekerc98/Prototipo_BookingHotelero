import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { countHeldRooms, createReservationWorkflow, stayNights } from './workflow'
import { getPaymentLabel, getReservationStatus } from './status'
import type { MyReservation, ReservationRequest } from './types'

const room = { id: 'doble', available: 1 }
const request: ReservationRequest = {
  id: 'RES-TEST-001', hotelId: 'hotel-a', hotel: 'Hotel de prueba', city: 'Manta',
  room: 'Doble', checkIn: '2026-12-01', checkOut: '2026-12-03', total: 100,
  image: '', guestName: 'Persona de prueba', guestEmail: 'huesped@example.test',
}
const now = () => '2026-11-14T12:00:00.000Z'
beforeEach(() => vi.setSystemTime(new Date(now())))
afterEach(() => vi.useRealTimers())

function setup(initial: MyReservation[] = [], capacity = 1) {
  let data = structuredClone(initial)
  const repository = {
    read: vi.fn(() => structuredClone(data)),
    save: vi.fn((reservations: MyReservation[]) => {
      data = structuredClone(reservations)
      return true
    }),
  }
  const onChange = vi.fn()
  const onLegacyCancel = vi.fn()
  const getBaseAvailability = () => capacity
  const workflow = createReservationWorkflow({ repository, getBaseAvailability, onChange, onLegacyCancel, now })
  return { workflow, repository, onChange, onLegacyCancel, getBaseAvailability }
}

describe('solicitud y aceptación manual', () => {
  it('crea una solicitud sin cobrar y aparta cupo solo en las noches solicitadas', () => {
    const { workflow, onChange } = setup()
    const created = workflow.submit(request, room)
    expect(created).toMatchObject({ status: 'pending', paymentStatus: 'pending', nights: 2, roomId: 'doble', inventoryMode: 'nightly', createdAt: now() })
    expect(created.payMethod).toBeUndefined()
    expect(created.acceptedAt).toBeUndefined()
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
    expect(workflow.getAvailability('hotel-b', room, request)).toBe(1)
    expect(workflow.getAvailability('hotel-a', { ...room, id: 'triple' }, request)).toBe(1)
    expect(workflow.getAvailability('hotel-a', room, { checkIn: '2026-12-03', checkOut: '2026-12-05' })).toBe(1)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('un envío repetido no duplica la reserva ni el cupo retenido', () => {
    const { workflow, repository, onChange } = setup()
    const first = workflow.submit(request, room)
    expect(workflow.submit(request, room)).toEqual(first)
    expect(workflow.list()).toHaveLength(1)
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(() => workflow.submit({ ...request, checkOut: '2026-12-04' }, room)).toThrow('código')
  })

  it('rechaza una segunda solicitud si falta cupo en alguna noche', () => {
    const { workflow } = setup()
    workflow.submit(request, room)
    expect(() => workflow.submit({ ...request, id: 'RES-TEST-002', checkIn: '2026-12-02', checkOut: '2026-12-04' }, room)).toThrow('No quedan cupos')
    expect(workflow.list()).toHaveLength(1)
  })

  it('aceptar y validar no cobran, no completan la estancia y no consumen otro cupo', () => {
    const { workflow, repository } = setup()
    workflow.submit(request, room)
    expect(() => workflow.validate('hotel-a', request.id)).toThrow('estado actual')
    expect(workflow.accept('hotel-a', request.id)).toMatchObject({ status: 'confirmed', paymentStatus: 'pending', acceptedAt: now() })
    workflow.accept('hotel-a', request.id)
    expect(workflow.validate('hotel-a', request.id)).toMatchObject({ status: 'validated', paymentStatus: 'pending', validatedAt: now() })
    workflow.validate('hotel-a', request.id)
    expect(repository.save).toHaveBeenCalledTimes(3)
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
  })

  it.each(['accept', 'reject', 'validate'] as const)('impide operar desde otro hotel: %s', action => {
    const { workflow, repository } = setup()
    workflow.submit(request, room)
    expect(() => workflow[action]('hotel-b', request.id)).toThrow('establecimiento')
    expect(repository.save).toHaveBeenCalledTimes(1)
    expect(workflow.list()[0].status).toBe('pending')
  })

  it.each(['reject', 'cancel'] as const)('libera el cupo una sola vez al terminar la solicitud: %s', action => {
    const { workflow, onLegacyCancel, repository } = setup()
    workflow.submit(request, room)
    const run = () => action === 'reject' ? workflow.reject('hotel-a', request.id) : workflow.cancel(request.id)
    run()
    run()
    expect(repository.save).toHaveBeenCalledTimes(2)
    expect(onLegacyCancel).not.toHaveBeenCalled()
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(1)
    expect(() => workflow.accept('hotel-a', request.id)).toThrow('estado actual')
    expect(() => workflow.validate('hotel-a', request.id)).toThrow('estado actual')
    expect(workflow.list()[0].paymentStatus).toBe('pending')
  })

  it('no inventa una política para cancelar o rechazar una reserva ya aceptada', () => {
    const { workflow } = setup()
    workflow.submit(request, room)
    workflow.accept('hotel-a', request.id)
    expect(() => workflow.cancel(request.id)).toThrow('estado actual')
    expect(() => workflow.reject('hotel-a', request.id)).toThrow('estado actual')
    expect(workflow.list()[0].status).toBe('confirmed')
  })

  it('no aparta cupo ni anuncia éxito si el almacenamiento rechaza la solicitud', () => {
    const { workflow, repository, onChange } = setup()
    repository.save.mockReturnValue(false)
    expect(() => workflow.submit(request, room)).toThrow('No se pudo guardar')
    expect(workflow.list()).toEqual([])
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(1)
    expect(onChange).not.toHaveBeenCalled()
  })

  it('mantiene el estado y el cupo anteriores si falla la aceptación o el rechazo', () => {
    const { workflow, repository, onChange } = setup()
    workflow.submit(request, room)
    repository.save.mockReturnValue(false)
    expect(() => workflow.accept('hotel-a', request.id)).toThrow('No se pudo guardar')
    expect(() => workflow.reject('hotel-a', request.id)).toThrow('No se pudo guardar')
    expect(workflow.list()[0].status).toBe('pending')
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
    expect(onChange).toHaveBeenCalledTimes(1)
  })

  it('consulta el registro más reciente antes de cada operación', () => {
    const { workflow, repository, getBaseAvailability } = setup()
    const anotherView = createReservationWorkflow({ repository, getBaseAvailability, now })
    workflow.submit(request, room)
    anotherView.reject('hotel-a', request.id)
    expect(() => workflow.accept('hotel-a', request.id)).toThrow('estado actual')
    expect(workflow.list()[0].status).toBe('rejected')
    anotherView.submit({ ...request, id: 'RES-TEST-002' }, room)
    expect(() => workflow.submit({ ...request, id: 'RES-TEST-003' }, room)).toThrow('No quedan cupos')
  })

  it('conserva reservas heredadas sin interpretar estancia completada o método como pago', () => {
    const legacy: MyReservation = { ...request, nights: 2, status: 'upcoming', payMethod: 'Tarjeta demo' }
    const { workflow, onLegacyCancel } = setup([legacy])
    expect(getReservationStatus(legacy)).toBe('confirmed')
    expect(getPaymentLabel(legacy)).toBe('Pago no verificado')
    expect(getPaymentLabel({ ...legacy, status: 'completed' } as MyReservation)).toBe('Pago no verificado')
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(1)
    workflow.cancel(legacy.id)
    workflow.cancel(legacy.id)
    expect(onLegacyCancel).toHaveBeenCalledTimes(1)
    expect(workflow.list()[0]).toMatchObject({ payMethod: legacy.payMethod, status: 'cancelled' })
  })

  it.each([
    { checkIn: '2026-02-30', checkOut: '2026-03-02' },
    { checkIn: 'fecha', checkOut: '2026-12-03' },
    { checkIn: '2026-12-03', checkOut: '2026-12-01' },
    { checkIn: '2026-12-01', checkOut: '2026-12-01' },
  ])('rechaza fechas inválidas sin escribir: %j', stay => {
    const { workflow, repository } = setup()
    expect(() => workflow.submit({ ...request, ...stay }, room)).toThrow()
    expect(workflow.getAvailability('hotel-a', room, stay)).toBe(0)
    expect(repository.save).not.toHaveBeenCalled()
  })

  it.each([{ guestName: ' ' }, { guestEmail: 'sin-correo' }, { total: NaN }, { total: -1 }])(
    'rechaza datos incompletos o importes inválidos: %j', fields => {
      const { workflow, repository } = setup()
      expect(() => workflow.submit({ ...request, ...fields }, room)).toThrow('Completa')
      expect(repository.save).not.toHaveBeenCalled()
    },
  )
})

describe('inventario local por noche', () => {
  it('calcula noches sin depender del cambio de hora', () => {
    expect(stayNights({ checkIn: '2026-03-28', checkOut: '2026-03-30' })).toBe(2)
    expect(stayNights({ checkIn: '2028-02-28', checkOut: '2028-03-01' })).toBe(2)
  })

  it('usa el pico de ocupación, no la suma de estancias consecutivas', () => {
    const { workflow } = setup([], 2)
    workflow.submit({ ...request, checkOut: '2026-12-02' }, room)
    workflow.submit({ ...request, id: 'RES-TEST-002', checkIn: '2026-12-02' }, room)
    expect(countHeldRooms(workflow.list(), 'hotel-a', 'doble', request)).toBe(1)
    workflow.submit({ ...request, id: 'RES-TEST-003' }, room)
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
  })

  it.each(['cancelled', 'rejected', 'completed'] as const)('no retiene nuevas noches para un estado terminal: %s', status => {
    const { workflow } = setup([{ ...request, nights: 2, roomId: 'doble', inventoryMode: 'nightly', status }])
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(1)
  })
})

describe('registro manual de cobros de prueba', () => {
  const payment = { method: 'Efectivo' as const, reference: '', recordedBy: 'Operador de prueba' }

  it('exige validación en recepción, aísla el hotel y evita el doble cobro', () => {
    const { workflow } = setup()
    workflow.submit(request, room)
    expect(() => workflow.recordPayment('hotel-a', request.id, payment)).toThrow('Valida')
    workflow.accept('hotel-a', request.id)
    expect(() => workflow.recordPayment('hotel-a', request.id, payment)).toThrow('Valida')
    workflow.validate('hotel-a', request.id)
    expect(() => workflow.recordPayment('otro-hotel', request.id, payment)).toThrow('Valida')
    const updated = workflow.recordPayment('hotel-a', request.id, payment)
    expect(updated).toMatchObject({ status: 'validated', paymentStatus: 'paid', payment: { amount: 100, method: 'Efectivo', recordedBy: payment.recordedBy, recordedAt: now() } })
    expect(() => workflow.recordPayment('hotel-a', request.id, payment)).toThrow('ya tiene')
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
  })

  it('requiere referencia externa y no anuncia ni guarda pagos ante fallo de almacenamiento', () => {
    const { workflow, repository, onChange } = setup()
    workflow.submit(request, room)
    workflow.accept('hotel-a', request.id)
    workflow.validate('hotel-a', request.id)
    expect(() => workflow.recordPayment('hotel-a', request.id, { ...payment, method: 'Tarjeta externa' })).toThrow('referencia')
    repository.save.mockReturnValueOnce(false)
    onChange.mockClear()
    expect(() => workflow.recordPayment('hotel-a', request.id, payment)).toThrow('No se pudo guardar')
    expect(workflow.list()[0].payment).toBeUndefined()
    expect(workflow.list()[0].paymentStatus).toBe('pending')
    expect(onChange).not.toHaveBeenCalled()
  })
})

describe('comprobante del hotel vinculado al cobro', () => {
  const details = { kind: 'receipt' as const, number: ' REC-PRUEBA-001 ', issuedOn: '2026-11-14', recordedBy: 'Recepción de prueba' }
  function paidSetup() {
    const context = setup()
    context.workflow.submit(request, room)
    context.workflow.accept('hotel-a', request.id)
    context.workflow.validate('hotel-a', request.id)
    context.workflow.recordPayment('hotel-a', request.id, { method: 'Efectivo', reference: '', recordedBy: 'Operador de prueba' })
    return context
  }

  it('exige detalle del cobro completo y limita los métodos nuevos a efectivo/tarjeta', () => {
    const { workflow } = setup()
    workflow.submit(request, room)
    expect(() => workflow.registerHotelReceipt('hotel-a', request.id, details, 0)).toThrow('cobro completo')
    workflow.accept('hotel-a', request.id)
    workflow.validate('hotel-a', request.id)
    expect(() => workflow.recordPayment('hotel-a', request.id, { method: 'Transferencia externa', reference: 'REF-1', recordedBy: 'Operador' })).toThrow('Revisa')
    expect(workflow.list()[0].payment).toBeUndefined()
    const legacy = setup([{ ...request, nights: 2, status: 'validated', paymentStatus: 'paid' }]).workflow
    expect(() => legacy.registerHotelReceipt('hotel-a', request.id, details, 0)).toThrow('cobro completo')
  })

  it('guarda el número y su historial sin cambiar el importe, pago, estado ni cupo', () => {
    const { workflow, repository } = paidSetup()
    const before = workflow.list()[0]
    const saved = workflow.registerHotelReceipt('hotel-a', request.id, details, 0)
    expect(saved).toEqual({ ...before, receiptHistory: [{ ...details, number: 'REC-PRUEBA-001', recordedAt: now(), revision: 1 }] })
    expect(workflow.getAvailability('hotel-a', room, request)).toBe(0)
    repository.save.mockClear()
    expect(workflow.registerHotelReceipt('hotel-a', request.id, details, 0)).toEqual(saved)
    expect(repository.save).not.toHaveBeenCalled()
    const corrected = workflow.registerHotelReceipt('hotel-a', request.id, { ...details, kind: 'invoice', number: 'FAC-PRUEBA-002', recordedBy: 'Otro operador' }, 1)
    expect(corrected.receiptHistory).toHaveLength(2)
    expect(corrected.receiptHistory![0]).toEqual(saved.receiptHistory![0])
    expect(corrected.receiptHistory![1]).toMatchObject({ kind: 'invoice', number: 'FAC-PRUEBA-002', revision: 2, recordedBy: 'Otro operador' })
    expect(corrected.payment).toEqual(before.payment)
    expect(corrected.status).toBe('validated')
    expect(() => workflow.recordPayment('hotel-a', request.id, { method: 'Efectivo', reference: '', recordedBy: 'Operador' })).toThrow('ya tiene')
  })

  it('evita que una edición desactualizada o de otro hotel modifique el comprobante', () => {
    const { workflow } = paidSetup()
    expect(() => workflow.registerHotelReceipt('hotel-b', request.id, details, 0)).toThrow('establecimiento')
    workflow.registerHotelReceipt('hotel-a', request.id, details, 0)
    workflow.registerHotelReceipt('hotel-a', request.id, { ...details, number: 'REC-002' }, 1)
    expect(() => workflow.registerHotelReceipt('hotel-a', request.id, { ...details, number: 'REC-OBSOLETO' }, 1)).toThrow('otra vista')
    expect(workflow.list()[0].receiptHistory!.map(entry => entry.number)).toEqual(['REC-PRUEBA-001', 'REC-002'])
  })

  it.each([{ number: ' ' }, { number: 'x'.repeat(81) }, { issuedOn: '2026-02-30' }, { issuedOn: 'no-fecha' }, { recordedBy: ' ' }])('rechaza datos incompletos o inválidos: %j', invalid => {
    const { workflow, repository } = paidSetup()
    repository.save.mockClear()
    expect(() => workflow.registerHotelReceipt('hotel-a', request.id, { ...details, ...invalid }, 0)).toThrow('Revisa')
    expect(repository.save).not.toHaveBeenCalled()
    expect(workflow.list()[0].receiptHistory).toBeUndefined()
  })

  it('un error al guardar conserva tanto el pago como el historial anterior', () => {
    const { workflow, repository, onChange } = paidSetup()
    workflow.registerHotelReceipt('hotel-a', request.id, details, 0)
    const before = workflow.list()[0]
    repository.save.mockReturnValueOnce(false)
    onChange.mockClear()
    expect(() => workflow.registerHotelReceipt('hotel-a', request.id, { ...details, number: 'REC-NUEVO' }, 1)).toThrow('No se pudo guardar')
    expect(workflow.list()[0]).toEqual(before)
    expect(onChange).not.toHaveBeenCalled()
  })
})

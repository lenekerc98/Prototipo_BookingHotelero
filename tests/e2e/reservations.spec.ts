import { expect, test, type Page } from '@playwright/test'
import type { MyReservation } from '../../src/features/reservations/types'
import { MANTA_HOTELS } from '../../src/mantaHotels'

const currentKey = 'alojamanta_guest_reservations'
const legacyKey = 'hoteldirekt_guest_reservations'
const availabilityKey = 'alojamanta_room_availability'
const hotel = MANTA_HOTELS[0]
const room = hotel.rooms[0]
const reservation: MyReservation = {
  id: 'RES-E2E-001',
  hotel: hotel.name,
  hotelId: hotel.id,
  city: hotel.city,
  room: room.type,
  checkIn: '2026-12-01',
  checkOut: '2026-12-03',
  nights: 2,
  total: 100,
  status: 'upcoming',
  image: '',
  guestName: 'Persona de prueba E2E',
  guestEmail: 'reservas@example.test',
}

async function seedReservations(page: Page, key = currentKey, reservations = [reservation]) {
  await page.addInitScript(({ storageKey, bookings, quotaKey, quota, arrivalKey }) => {
    if (sessionStorage.getItem('reservations-e2e-seeded')) return
    localStorage.setItem('alojamanta_lang', 'es')
    localStorage.setItem(storageKey, JSON.stringify(bookings))
    localStorage.setItem(quotaKey, JSON.stringify(quota))
    localStorage.setItem(arrivalKey, '14:00')
    sessionStorage.setItem('reservations-e2e-seeded', 'true')
  }, {
    storageKey: key,
    bookings: reservations,
    quotaKey: availabilityKey,
    quota: { [`${hotel.id}::${room.id}`]: 1 },
    arrivalKey: `hoteldirekt.${hotel.id}.arrival_time`,
  })
  await page.goto('/')
}

async function openReservationConsultation(page: Page) {
  await page.getByRole('button', { name: 'Consultar mi reserva', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Consultar Reservas de Hotel' })).toBeVisible()
}

async function loginToPanel(page: Page, accountName = 'Juan Recepción') {
  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
  await page.getByRole('button', { name: 'Personal de Hotel / PMS' }).click()
  await page.getByRole('button', { name: 'Abrir pantalla completa de acceso hotelero' }).click()
  await page.getByRole('button', { name: new RegExp(accountName) }).click()
  await page.getByRole('button', { name: 'Entrar al panel', exact: true }).click()
  await page.getByRole('button', { name: 'Bandeja de reservas', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bandeja de Reservas' })).toBeVisible()
}

async function openHotel(page: Page) {
  await page.locator('input[type="date"]').nth(0).fill(reservation.checkIn)
  await page.locator('input[type="date"]').nth(1).fill(reservation.checkOut)
  await page.getByRole('button', { name: 'Buscar Hoteles', exact: false }).click()
  await page.getByRole('heading', { name: hotel.name, exact: true }).click()
}

async function prepareRequest(page: Page) {
  await openHotel(page)
  await page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true }).click()
  await page.getByRole('button', { name: 'Continuar como invitado', exact: true }).click()
  await page.getByPlaceholder('Ej: Carlos Mendoza').fill(reservation.guestName)
  await page.getByPlaceholder('cliente@correo.ec').fill(reservation.guestEmail)
  await page.getByRole('button', { name: 'Revisar solicitud →', exact: true }).click()
}

async function storedReservations(page: Page): Promise<MyReservation[]> {
  return page.evaluate(storageKey => JSON.parse(localStorage.getItem(storageKey) ?? '[]'), currentKey)
}

const pendingReservation: MyReservation = {
  ...reservation, status: 'pending', paymentStatus: 'pending', roomId: room.id, inventoryMode: 'nightly',
}

test.beforeEach(async ({ context }) => {
  await context.route('**/*', route => {
    if (new URL(route.request().url()).origin === 'http://127.0.0.1:4173') {
      return route.continue()
    }
    return route.abort()
  })
})

async function freezeClock(page: Page, timestamp: string) {
  await page.clock.install({ time: new Date(Date.parse(timestamp) - 1000) })
  await page.clock.pauseAt(new Date(timestamp))
}

test('el plazo de 24 horas vence en portal y panel, persiste y libera el cupo una sola vez', async ({ page, context }) => {
  await freezeClock(page, '2026-11-16T19:00:00Z')
  await seedReservations(page, currentKey, [{ ...pendingReservation, createdAt: '2026-11-16T19:00:00Z' }])
  await openReservationConsultation(page)
  await expect(page.getByText(/Límite de respuesta/)).toBeVisible()
  const panel = await context.newPage()
  await panel.goto('/')
  await loginToPanel(panel)
  const row = panel.getByRole('row').filter({ hasText: reservation.id })
  await page.clock.fastForward('02:00:00')
  await expect(row.getByText('Pendiente de aceptación', { exact: true })).toBeVisible()
  await expect(row.getByText(/Objetivo de 2 horas superado/)).toBeVisible()
  await page.clock.fastForward('22:00:00')
  await expect(page.getByText('Vencida', { exact: true })).toBeVisible()
  await expect(row.getByText('Vencida', { exact: true })).toBeVisible()
  await expect(row.getByRole('button', { name: 'Aceptar solicitud', exact: true })).toHaveCount(0)
  await expect.poll(async () => (await storedReservations(page))[0].status).toBe('expired')
  expect((await storedReservations(page))[0].expiredAt).toBe('2026-11-17T19:00:00.000Z')
  await page.reload()
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeEnabled()
  expect(await page.evaluate(key => JSON.parse(localStorage.getItem(key) ?? '{}'), availabilityKey)).toEqual({ [`${hotel.id}::${room.id}`]: 1 })
  await panel.close()
})

test('reabrir reconcilia vencidas y conserva solicitudes antiguas sin fecha utilizable', async ({ page }) => {
  await freezeClock(page, '2026-11-18T19:00:00Z')
  await seedReservations(page, currentKey, [
    { ...pendingReservation, createdAt: '2026-11-16T19:00:00Z' },
    { ...pendingReservation, id: 'RES-ANTIGUA', createdAt: 'sin-fecha' },
  ])
  await loginToPanel(page)
  await expect(page.getByRole('row').filter({ hasText: reservation.id }).getByText('Vencida', { exact: true })).toBeVisible()
  const oldRow = page.getByRole('row').filter({ hasText: 'RES-ANTIGUA' })
  await expect(oldRow.getByText(/sin fecha de creación válida/)).toBeVisible()
  await expect(oldRow.getByRole('button', { name: 'Aceptar solicitud', exact: true })).toBeEnabled()
  await expect.poll(async () => (await storedReservations(page))[0].status).toBe('expired')
  expect((await storedReservations(page))[1]).toMatchObject({ status: 'pending', createdAt: 'sin-fecha' })
})

test('el hotel configura su hora y el portal la recibe sin asignarla a otros hoteles', async ({ page, context }) => {
  await freezeClock(page, '2026-11-16T19:00:00Z')
  await seedReservations(page, currentKey, [])
  await page.evaluate(key => localStorage.removeItem(key), `hoteldirekt.${hotel.id}.arrival_time`)
  await openHotel(page)
  const requestButton = page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })
  await expect(requestButton).toBeDisabled()
  await expect(page.getByText(/aún no ha configurado su hora de llegada/).first()).toBeVisible()
  const panel = await context.newPage()
  await panel.goto('/')
  await loginToPanel(panel, 'Ana Administradora')
  await panel.locator('summary').filter({ hasText: 'Hora de llegada del hotel' }).click()
  await panel.getByLabel('Hora de llegada', { exact: true }).fill('16:30')
  await panel.getByRole('button', { name: 'Guardar horario', exact: true }).click()
  await expect(panel.getByText('Hora de llegada guardada para este hotel.')).toBeVisible()
  await expect(requestButton).toBeEnabled()
  await expect(page.getByText('Hora de llegada del hotel: 16:30 · hora de Manta').first()).toBeVisible()
  expect(await page.evaluate(key => localStorage.getItem(key), 'hoteldirekt.mantahost-hotel.arrival_time')).toBeNull()
  await page.reload()
  await openHotel(page)
  await expect(requestButton).toBeEnabled()
  await panel.close()
})

test('el portal bloquea al cruzar las 24 horas y permite el registro asistido en recepción', async ({ page }) => {
  await freezeClock(page, '2026-11-30T19:00:00Z')
  await seedReservations(page, currentKey, [])
  await prepareRequest(page)
  await expect(page.getByRole('button', { name: 'Enviar solicitud al hotel', exact: true })).toBeEnabled()
  await page.clock.runFor(1)
  await expect(page.getByRole('dialog', { name: 'Atención directa del hotel', exact: true })).toBeVisible()
  expect(await storedReservations(page)).toEqual([])
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeDisabled()
  await loginToPanel(page)
  await page.getByRole('button', { name: '+ Nueva Reserva', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Nueva reserva', exact: true })
  await dialog.getByLabel('Nombre del huésped', { exact: true }).fill('Llegada asistida')
  await dialog.getByLabel('Email', { exact: true }).fill('asistida@example.test')
  await dialog.getByLabel('Fecha de Entrada', { exact: true }).fill(reservation.checkIn)
  await dialog.getByLabel('Fecha de Salida', { exact: true }).fill(reservation.checkOut)
  await dialog.getByRole('button', { name: 'Guardar reserva', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  const [created] = await storedReservations(page)
  expect(created.status).toBe('pending')
  await page.getByRole('row').filter({ hasText: created.id }).getByRole('button', { name: 'Aceptar solicitud', exact: true }).click()
  expect((await storedReservations(page))[0]).toMatchObject({ status: 'confirmed', paymentStatus: 'pending' })
})

test('el portal permite enviar exactamente a las 24 horas y conserva la solicitud al acercarse la llegada', async ({ page }) => {
  await freezeClock(page, '2026-11-30T19:00:00Z')
  await seedReservations(page, currentKey, [])
  await prepareRequest(page)
  await page.getByRole('button', { name: 'Enviar solicitud al hotel', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Solicitud guardada', exact: true })).toBeVisible()
  await page.clock.fastForward('02:00:00')
  await expect(page.getByText('Pendiente de aceptación', { exact: true })).toBeVisible()
  await expect(page.getByText(/Objetivo de 2 horas superado/)).toBeVisible()
  expect((await storedReservations(page))[0]).toMatchObject({ status: 'pending', createdAt: '2026-11-30T19:00:00.000Z', arrivalAt: '2026-12-01T14:00:00-05:00' })
})

test('un fallo al persistir el vencimiento informa y reintenta al recuperar almacenamiento', async ({ page }) => {
  await freezeClock(page, '2026-11-16T19:00:00Z')
  await seedReservations(page, currentKey, [{ ...pendingReservation, createdAt: '2026-11-16T19:00:00Z' }])
  await loginToPanel(page)
  await page.evaluate(storageKey => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key === storageKey && sessionStorage.getItem('fail-expiry') === 'yes') throw new Error('Storage full')
      original.call(this, key, value)
    }
    sessionStorage.setItem('fail-expiry', 'yes')
  }, currentKey)
  await page.clock.fastForward('24:00:00')
  await expect(page.getByRole('alert')).toContainText('No se pudo guardar el vencimiento')
  await expect(page.getByRole('row').filter({ hasText: reservation.id }).getByText('Vencida', { exact: true })).toBeVisible()
  expect((await storedReservations(page))[0].status).toBe('pending')
  await page.evaluate(() => {
    sessionStorage.removeItem('fail-expiry')
    window.dispatchEvent(new Event('focus'))
  })
  await expect(page.getByRole('alert')).toHaveCount(0)
  expect((await storedReservations(page))[0].status).toBe('expired')
})

for (const key of [currentKey, legacyKey]) {
  test(`el portal conserva reservas existentes desde ${key}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    await seedReservations(page, key)
    await openReservationConsultation(page)
    await expect(page.getByText(reservation.id, { exact: true })).toBeVisible()
    await expect(page.getByText(reservation.guestName, { exact: true })).toBeVisible()
    await expect.poll(() => page.evaluate(storageKey =>
      JSON.parse(localStorage.getItem(storageKey) ?? 'null'), key,
    )).toEqual([reservation])

    await page.reload()
    await openReservationConsultation(page)
    await expect(page.getByText(reservation.id, { exact: true })).toBeVisible()
    expect(await page.evaluate(storageKey =>
      JSON.parse(localStorage.getItem(storageKey) ?? 'null'), key,
    )).toEqual([reservation])
    expect(errors).toEqual([])
  })
}

test('una lista vacía no se sustituye por reservas de demostración', async ({ page }) => {
  await seedReservations(page, currentKey, [])
  await openReservationConsultation(page)
  await expect(page.getByText('No encontramos reservas con ese término')).toBeVisible()
  expect(await page.evaluate(storageKey => localStorage.getItem(storageKey), currentKey)).toBe('[]')
})

test('cancelar conserva el estado y libera una sola unidad tras recargar', async ({ page }) => {
  await seedReservations(page)
  await openReservationConsultation(page)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByText('Cancelada', { exact: true })).toBeVisible()
  await expect.poll(() => page.evaluate(storageKey =>
    JSON.parse(localStorage.getItem(storageKey) ?? 'null'), currentKey,
  )).toEqual([{ ...reservation, status: 'cancelled' }])
  expect(await page.evaluate(storageKey =>
    JSON.parse(localStorage.getItem(storageKey) ?? '{}'), availabilityKey,
  )).toEqual({ [`${hotel.id}::${room.id}`]: 2 })

  await page.reload()
  await openReservationConsultation(page)
  await expect(page.getByText('Cancelada', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Cancelar', exact: true })).toHaveCount(0)
  expect(await page.evaluate(storageKey =>
    JSON.parse(localStorage.getItem(storageKey) ?? '{}'), availabilityKey,
  )).toEqual({ [`${hotel.id}::${room.id}`]: 2 })
})

test('el panel valida una reserva heredada sin inferir pago ni completar la estancia', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await seedReservations(page)
  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
  await page.getByRole('button', { name: 'Personal de Hotel / PMS' }).click()
  await page.getByRole('button', { name: 'Abrir pantalla completa de acceso hotelero' }).click()
  await page.getByRole('button', { name: /Juan Recepción/ }).click()
  await page.getByRole('button', { name: 'Entrar al panel', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bandeja de Reservas' })).toBeVisible()
  await expect(page.getByText(reservation.id, { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Tipos de habitación', exact: true }).click()
  await expect(page.getByText(reservation.guestName, { exact: true })).toBeVisible()
  await page.getByRole('row').filter({ hasText: reservation.id }).getByRole('button', { name: 'Validar', exact: true }).click()
  await expect.poll(() => page.evaluate(storageKey =>
    JSON.parse(localStorage.getItem(storageKey) ?? 'null'), currentKey,
  )).toEqual([{ ...reservation, status: 'validated', validatedAt: expect.any(String) }])

  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await openReservationConsultation(page)
  await expect(page.getByText(reservation.id, { exact: true })).toBeVisible()
  await expect(page.getByText('Validada en recepción', { exact: true })).toBeVisible()
  await expect(page.getByText('Pago no verificado', { exact: true })).toBeVisible()
  expect(errors).toEqual([])
})

test('solicitar, aceptar y validar comparte estados entre pestañas sin cobrar', async ({ page, context }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await seedReservations(page, currentKey, [])
  await prepareRequest(page)
  await expect(page.getByPlaceholder('4242 4242 4242 4242')).toHaveCount(0)
  await expect(page.getByText('CVV', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Enviar solicitud al hotel', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Solicitud guardada', exact: true })).toBeVisible()
  await expect(page.getByText('Pendiente de aceptación', { exact: true })).toBeVisible()
  await expect(page.getByText('Pago pendiente', { exact: true })).toBeVisible()
  const [created] = await storedReservations(page)
  expect(created).toMatchObject({ hotelId: hotel.id, roomId: room.id, status: 'pending', paymentStatus: 'pending', nights: 2 })
  expect(created.payMethod).toBeUndefined()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeDisabled()

  const observer = await context.newPage()
  await observer.goto('/')
  await openReservationConsultation(observer)
  await expect(observer.getByText('Pendiente de aceptación', { exact: true })).toBeVisible()
  await page.evaluate(booking => {
    localStorage.setItem(`hoteldirekt.${booking.hotelId}.reservations`, JSON.stringify([{
      id: booking.id, guestName: booking.guestName, guestEmail: booking.guestEmail,
      roomNumber: 'Cupo Web', roomType: booking.room, checkIn: booking.checkIn,
      checkOut: booking.checkOut, nights: booking.nights, status: 'confirmed',
      total: booking.total, adults: 2, children: 0, source: 'Portal AlojaManta',
    }]))
  }, created)
  await loginToPanel(page)
  const row = page.getByRole('row').filter({ hasText: created.id })
  await expect(row).toHaveCount(1)
  await expect(row.getByText('Pendiente de aceptación', { exact: true })).toBeVisible()
  await expect(row.getByText('Pago pendiente', { exact: true })).toBeVisible()
  await page.getByPlaceholder('Ej: RES-003...').fill(created.id)
  await page.getByRole('button', { name: 'Validar', exact: true }).first().click()
  await expect(page.getByText('Solo se puede validar una reserva aceptada por el hotel.')).toBeVisible()
  expect((await storedReservations(page))[0].status).toBe('pending')
  await row.getByRole('button', { name: 'Aceptar solicitud', exact: true }).click()
  await expect(observer.getByText('Confirmada', { exact: true })).toBeVisible()
  await expect(observer.getByText('Pago pendiente', { exact: true })).toBeVisible()
  await row.getByRole('button', { name: 'Validar', exact: true }).click()
  await expect(observer.getByText('Validada en recepción', { exact: true })).toBeVisible()
  expect((await storedReservations(page))[0]).toMatchObject({ status: 'validated', paymentStatus: 'pending' })
  await row.getByRole('button', { name: 'Voucher', exact: true }).click()
  const summary = page.getByRole('dialog', { name: 'Resumen de reserva' })
  await expect(summary.getByText('Pago pendiente', { exact: true })).toBeVisible()
  await expect(summary.getByText('Pago registrado', { exact: true })).toHaveCount(0)
  await observer.reload()
  await openReservationConsultation(observer)
  await expect(observer.getByText('Validada en recepción', { exact: true })).toBeVisible()
  await observer.close()
  expect(errors).toEqual([])
})

test('rechazar una solicitud libera el cupo y no permite validarla', async ({ page }) => {
  await seedReservations(page, currentKey, [pendingReservation])
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeDisabled()
  await loginToPanel(page)
  const row = page.getByRole('row').filter({ hasText: reservation.id })
  await row.getByRole('button', { name: 'Rechazar solicitud', exact: true }).click()
  await expect(row.getByText('Rechazada', { exact: true })).toBeVisible()
  await page.getByPlaceholder('Ej: RES-003...').fill(reservation.id)
  await page.getByRole('button', { name: 'Validar', exact: true }).first().click()
  await expect(page.getByText('Solo se puede validar una reserva aceptada por el hotel.')).toBeVisible()
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeEnabled()
  expect((await storedReservations(page))[0]).toMatchObject({ status: 'rejected', paymentStatus: 'pending' })
})

test('cancelar una solicitud pendiente libera el cupo sin incrementar el inventario base', async ({ page }) => {
  await seedReservations(page, currentKey, [pendingReservation])
  await openReservationConsultation(page)
  page.once('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  await expect(page.getByText('Cancelada', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeEnabled()
  expect(await page.evaluate(storageKey => JSON.parse(localStorage.getItem(storageKey) ?? '{}'), availabilityKey))
    .toEqual({ [`${hotel.id}::${room.id}`]: 1 })
})

test('un fallo de almacenamiento no presenta éxito ni retiene cupo', async ({ page }) => {
  await seedReservations(page, currentKey, [])
  await prepareRequest(page)
  await page.evaluate(storageKey => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (key, value) {
      if (key === storageKey) throw new DOMException('Test quota exceeded', 'QuotaExceededError')
      original.call(this, key, value)
    }
  }, currentKey)
  await page.getByRole('button', { name: 'Enviar solicitud al hotel', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('No se pudo guardar el cambio')
  await expect(page.getByRole('heading', { name: 'Solicitud guardada', exact: true })).toHaveCount(0)
  expect(await storedReservations(page)).toEqual([])
})

test('la bandeja y habitaciones no muestran reservas de otro hotel como respaldo', async ({ page }) => {
  await seedReservations(page, currentKey, [{ ...pendingReservation, hotelId: 'mantahost-hotel', hotel: 'MantaHost Hotel' }])
  await loginToPanel(page)
  await expect(page.getByText(reservation.id, { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Tipos de habitación', exact: true }).click()
  await expect(page.getByText(reservation.id, { exact: true })).toHaveCount(0)
  await expect(page.getByText(reservation.guestName, { exact: true })).toHaveCount(0)
})

test('el resumen de solicitud funciona en móvil, inglés y tema oscuro', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem('hoteldirekt.theme', JSON.stringify('dark')))
  await seedReservations(page, currentKey, [{ ...pendingReservation, id: 'RES-00000000-0000-4000-8000-000000000001' }])
  await page.getByRole('button', { name: 'Cambiar idioma', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Hotel staff sign-in', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Check my booking', exact: true }).click()
  await expect(page.getByText('Awaiting hotel acceptance', { exact: true })).toBeVisible()
  await expect(page.getByText('Payment pending', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: /voucher/i }).click()
  const summary = page.getByRole('dialog', { name: 'Booking summary' })
  await expect(summary.getByText('Payment pending', { exact: true })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

test('volver del portal al panel conserva la sesión, el hotel y la reserva de Maria Jose', async ({ page }) => {
  const mariaJose = {
    ...pendingReservation, id: 'RES-PRUEBA-MARIA-JOSE', hotelId: 'maria-jose',
    hotel: 'Maria Jose', roomId: 'maria-jose-cama-matrimonial',
  }
  await seedReservations(page, currentKey, [mariaJose])
  await loginToPanel(page, 'Carlos Admin')
  await page.getByRole('combobox', { name: 'Hotel supervisado' }).selectOption('maria-jose')
  await expect(page.getByText('Establecimiento de esta bandeja: Maria Jose', { exact: true })).toBeVisible()
  await expect(page.getByText(mariaJose.id, { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
  await page.getByRole('button', { name: 'Ingresar como Carlos Méndez' }).click()
  await expect(page.getByTitle('Menú de perfil y cuenta')).toBeVisible()
  await page.getByTitle('Menú de perfil y cuenta').click()
  await expect(page.getByRole('button', { name: 'Volver al panel hotelero', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Volver al panel hotelero', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bandeja de Reservas', exact: true })).toBeVisible()
  await expect(page.getByRole('combobox', { name: 'Hotel supervisado' })).toHaveValue('maria-jose')
  await expect(page.getByText(mariaJose.id, { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Entrar al panel', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await expect(page.getByTitle('Menú de perfil y cuenta')).toBeVisible()
  expect(await storedReservations(page)).toEqual([mariaJose])
})

test('Juan Recepción no puede ver ni seleccionar el hostal Maria Jose', async ({ page }) => {
  const mariaJose = {
    ...pendingReservation, id: 'RES-PRUEBA-MARIA-JOSE', hotelId: 'maria-jose',
    hotel: 'Maria Jose', roomId: 'maria-jose-cama-matrimonial',
  }
  await seedReservations(page, currentKey, [mariaJose])
  await loginToPanel(page)
  await expect(page.locator('aside select option[value="maria-jose"]')).toHaveCount(0)
  await expect(page.getByText(mariaJose.id, { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Tipos de habitación', exact: true }).click()
  await expect(page.getByText(mariaJose.id, { exact: true })).toHaveCount(0)
  expect(await storedReservations(page)).toEqual([mariaJose])
})

test('el huésped puede acceder al hotel y el cierre explícito no conserva el retorno al panel', async ({ page }) => {
  await seedReservations(page, currentKey, [])
  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
  await page.getByRole('button', { name: 'Ingresar como Carlos Méndez' }).click()
  await expect(page.getByTitle('Menú de perfil y cuenta')).toBeVisible()
  await page.getByTitle('Menú de perfil y cuenta').click()
  await page.getByRole('button', { name: 'Personal de Hotel / PMS', exact: true }).click()
  await page.getByRole('button', { name: /Juan Recepción/ }).click()
  await page.getByRole('button', { name: 'Entrar al panel', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Bandeja de Reservas', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await expect(page.getByTitle('Menú de perfil y cuenta')).toBeVisible()
  await page.getByTitle('Menú de perfil y cuenta').click()
  await expect(page.getByRole('button', { name: 'Volver al panel hotelero', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Volver al panel hotelero', exact: true }).click()
  await page.getByRole('button', { name: '← Cerrar sesión', exact: true }).click()
  await page.getByRole('button', { name: 'Portal de Huéspedes', exact: true }).click()
  await expect(page.getByTitle('Menú de perfil y cuenta')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Volver al panel hotelero', exact: true })).toHaveCount(0)
  await page.getByTitle('Menú de perfil y cuenta').click()
  await page.getByRole('button', { name: 'Personal de Hotel / PMS', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Entrar al panel', exact: true })).toBeVisible()
  expect(await storedReservations(page)).toEqual([])
})

test('un navegador nuevo muestra bandejas vacías y métricas en cero', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('button', { name: 'Acceso hotelero', exact: true })).toHaveCount(0)
  await loginToPanel(page, 'Carlos Admin')
  await expect(page.getByText('Las solicitudes que ingreses aparecerán aquí.', { exact: false })).toBeVisible()
  await expect(page.locator('tbody tr')).toHaveCount(0)
  await page.getByRole('button', { name: 'Directorio de huéspedes', exact: true }).click()
  await expect(page.getByText('No hay huéspedes registrados en este hotel.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Comprobantes y vouchers', exact: true }).click()
  await expect(page.getByText('No hay vouchers.', { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Pasarela y cobros', exact: true }).click()
  await expect(page.getByTestId('Total registrado')).toHaveText('US$0.00')
  await expect(page.getByText('No hay cobros registrados.', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Métricas e ingresos', exact: true }).click()
  await expect(page.getByTestId('Reservas registradas')).toHaveText('0')
  await expect(page.getByTestId('Cobros registrados')).toHaveText('US$0.00')
  await page.getByRole('button', { name: 'Panel general', exact: true }).click()
  await expect(page.getByTestId('Cupos apartados hoy')).toHaveText('0')
  expect(await storedReservations(page)).toEqual([])
})

test('la reserva ingresada desde el panel comparte bandeja, consulta y cupo con el portal', async ({ page }) => {
  await seedReservations(page, currentKey, [])
  await loginToPanel(page)
  await page.getByRole('button', { name: '+ Nueva Reserva', exact: true }).click()
  const dialog = page.getByRole('dialog', { name: 'Nueva reserva', exact: true })
  await dialog.getByRole('textbox', { name: 'Nombre del huésped', exact: true }).fill('Prueba manual del panel')
  await dialog.getByRole('textbox', { name: 'Email', exact: true }).fill('panel@example.test')
  await dialog.getByLabel('Fecha de Entrada', { exact: true }).fill(reservation.checkIn)
  await dialog.getByLabel('Fecha de Salida', { exact: true }).fill(reservation.checkOut)
  await dialog.getByRole('button', { name: 'Guardar reserva', exact: true }).click()
  await expect(dialog).toHaveCount(0)
  const rows = await storedReservations(page)
  expect(rows).toHaveLength(1)
  expect(rows[0]).toMatchObject({ hotelId: hotel.id, roomId: room.id, guestEmail: 'panel@example.test', nights: 2, status: 'pending', paymentStatus: 'pending' })
  await expect(page.getByRole('row').filter({ hasText: rows[0].id })).toHaveCount(1)
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await openReservationConsultation(page)
  await expect(page.getByText('Prueba manual del panel', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeDisabled()
})

test('una solicitud alimenta ficha, voucher, cobros y métricas sin fabricar ingresos', async ({ page }) => {
  await seedReservations(page, currentKey, [])
  await prepareRequest(page)
  await page.getByRole('button', { name: 'Enviar solicitud al hotel', exact: true }).click()
  const [created] = await storedReservations(page)
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await loginToPanel(page, 'Carlos Admin')
  const row = page.getByRole('row').filter({ hasText: created.id })
  await row.getByRole('button', { name: 'Aceptar solicitud', exact: true }).click()
  await row.getByRole('button', { name: 'Validar', exact: true }).click()
  await page.getByRole('button', { name: 'Directorio de huéspedes', exact: true }).click()
  await expect(page.getByRole('heading', { name: reservation.guestName, exact: true })).toBeVisible()
  await expect(page.getByText('1 reservas · US$0.00 con cobro registrado', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Ver ficha', exact: true }).click()
  await expect(page.getByText('Documento: No registrado', { exact: true })).toBeVisible()
  await expect(page.getByText(created.id, { exact: false })).toBeVisible()
  await page.getByRole('button', { name: 'Métricas e ingresos', exact: true }).click()
  await expect(page.getByTestId('Cobros registrados')).toHaveText('US$0.00')
  await page.getByRole('button', { name: 'Pasarela y cobros', exact: true }).click()
  await page.getByRole('button', { name: 'Registrar cobro de prueba', exact: true }).click()
  await page.getByRole('combobox', { name: 'Método de cobro' }).selectOption('Tarjeta externa')
  await page.getByRole('textbox', { name: 'Referencia del cobro' }).fill('REF-PRUEBA-001')
  await page.getByRole('button', { name: 'Confirmar registro de prueba', exact: true }).click()
  await expect(page.getByTestId('Total registrado')).toHaveText(`US$${created.total.toFixed(2)}`)
  await expect(page.getByRole('button', { name: 'Registrar cobro de prueba', exact: true })).toHaveCount(0)
  expect((await storedReservations(page))[0]).toMatchObject({ status: 'validated', paymentStatus: 'paid', payment: { amount: created.total, reference: 'REF-PRUEBA-001', recordedBy: 'Carlos Admin' } })
  await page.getByRole('button', { name: 'Comprobantes y vouchers', exact: true }).click()
  await page.getByRole('button', { name: 'Ver voucher', exact: true }).click()
  await expect(page.getByRole('dialog').getByText('Pago registrado', { exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.getByRole('button', { name: 'Métricas e ingresos', exact: true }).click()
  await expect(page.getByTestId('Cobros registrados')).toHaveText(`US$${created.total.toFixed(2)}`)
  await page.getByRole('combobox', { name: 'Hotel supervisado' }).selectOption('maria-jose')
  await expect(page.getByTestId('Cobros registrados')).toHaveText('US$0.00')
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await openReservationConsultation(page)
  await expect(page.getByText('Pago registrado', { exact: true })).toBeVisible()
  await page.reload()
  await openReservationConsultation(page)
  await expect(page.getByText('Pago registrado', { exact: true })).toBeVisible()
})

test('el inventario configurado llega al portal y no permite reducir cupo por debajo de reservas activas', async ({ page }) => {
  await seedReservations(page, currentKey, [pendingReservation])
  await loginToPanel(page)
  await page.getByRole('button', { name: 'Tipos de habitación', exact: true }).click()
  await page.getByRole('button', { name: 'Inventario en venta web', exact: true }).click()
  await page.getByRole('button', { name: 'Editar inventario', exact: true }).first().click()
  await page.getByRole('spinbutton', { name: 'Cupo total', exact: true }).fill('0')
  await page.getByRole('button', { name: 'Guardar inventario', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('no puede ser menor')
  await page.getByRole('spinbutton', { name: 'Cupo total', exact: true }).fill('2')
  await page.getByRole('spinbutton', { name: 'Precio por noche', exact: true }).fill('77')
  await page.getByRole('button', { name: 'Guardar inventario', exact: true }).click()
  await page.getByRole('button', { name: 'Ver portal de huéspedes', exact: true }).click()
  await openHotel(page)
  await expect(page.getByRole('button', { name: `Solicitar habitación: ${room.type}`, exact: true })).toBeEnabled()
  await expect(page.getByText(/\$\s?77[,.]00/, { exact: true }).first()).toBeVisible()
})

test('reiniciar requiere confirmación, respalda las reservas y no las regenera tras recargar', async ({ page }) => {
  await seedReservations(page, currentKey, [pendingReservation])
  await page.evaluate(() => localStorage.setItem('alojamanta_profile_test', '{"name":"Perfil conservado"}'))
  await loginToPanel(page, 'Carlos Admin')
  await page.getByRole('button', { name: 'Panel general', exact: true }).click()
  await page.getByRole('button', { name: 'Reiniciar operaciones de prueba', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Confirmar reinicio', exact: true })).toBeDisabled()
  await page.getByRole('button', { name: 'Cancelar', exact: true }).click()
  expect(await storedReservations(page)).toHaveLength(1)
  await page.getByRole('button', { name: 'Reiniciar operaciones de prueba', exact: true }).click()
  await page.getByRole('textbox', { name: 'Escribe BORRAR', exact: false }).fill('BORRAR')
  await page.getByRole('button', { name: 'Confirmar reinicio', exact: true }).click()
  await expect(page.getByTestId('Reservas registradas')).toHaveText('0')
  expect(await storedReservations(page)).toEqual([])
  const preserved = await page.evaluate(() => ({ profile: localStorage.getItem('alojamanta_profile_test'), backup: JSON.parse(localStorage.getItem('alojamanta_operations_backup')!) }))
  expect(preserved.profile).toBe('{"name":"Perfil conservado"}')
  expect(JSON.parse(preserved.backup.values.alojamanta_guest_reservations)).toEqual([pendingReservation])
  await page.reload()
  await loginToPanel(page)
  await expect(page.locator('tbody tr')).toHaveCount(0)
})

test('Carlos y Laura tienen accesos rápidos sin reservas ni fichas precargadas', async ({ page }) => {
  await page.goto('/')
  for (const name of ['Carlos Méndez', 'Laura Fernández']) {
    await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
    await page.getByRole('button', { name: `Ingresar como ${name}`, exact: true }).click()
    await page.getByTitle('Menú de perfil y cuenta').click()
    await page.getByRole('button', { name: 'Centro de mi cuenta', exact: false }).click()
    await expect(page.getByRole('heading', { name, exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Mis Reservas (0)', exact: true }).click()
    await expect(page.getByText('RES-4821', { exact: true })).toHaveCount(0)
    await page.getByRole('button', { name: 'Medios de pago', exact: true }).click()
    await expect(page.getByText('No hay cobros registrados.', { exact: true })).toBeVisible()
    await page.getByRole('button', { name: 'Cerrar sesión', exact: true }).click()
  }
  expect(await storedReservations(page)).toEqual([])
})

for (const theme of ['light', 'dark']) {
  test(`el pie del portal tiene contraste legible en tema ${theme}`, async ({ page }) => {
    await page.addInitScript(value => localStorage.setItem('hoteldirekt.theme', JSON.stringify(value)), theme)
    await page.goto('/')
    const footer = page.locator('footer')
    await footer.scrollIntoViewIfNeeded()
    const contrasts = await footer.evaluate(element => {
      const luminance = (color: string) => {
        const [r, g, b] = color.match(/[\d.]+/g)!.slice(0, 3).map(Number).map(value => {
          const channel = value / 255
          return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4
        })
        return 0.2126 * r + 0.7152 * g + 0.0722 * b
      }
      const background = luminance(getComputedStyle(element).backgroundColor)
      return [...element.querySelectorAll('p, a, button')].map(child => {
        const foreground = luminance(getComputedStyle(child).color)
        return (Math.max(foreground, background) + 0.05) / (Math.min(foreground, background) + 0.05)
      })
    })
    expect(Math.min(...contrasts)).toBeGreaterThanOrEqual(4.5)
    await footer.screenshot({ path: test.info().outputPath(`footer-${theme}.png`) })
  })
}

const paidReservation: MyReservation = {
  ...pendingReservation, status: 'validated', paymentStatus: 'paid',
  payment: { amount: 100, method: 'Efectivo', reference: '', recordedAt: '2026-11-15T12:00:00Z', recordedBy: 'Operador anterior' },
}

test('cobrar desde la reserva vincula el comprobante y actualiza el voucher abierto del huésped', async ({ page, context }) => {
  await seedReservations(page, currentKey, [pendingReservation])
  const guest = await context.newPage()
  await guest.goto('/')
  await openReservationConsultation(guest)
  await guest.getByRole('button', { name: /voucher/i }).click()
  const summary = guest.getByRole('dialog', { name: 'Resumen de reserva', exact: true })
  await expect(summary.getByText('Pago pendiente', { exact: true })).toBeVisible()
  await loginToPanel(page)
  const row = page.getByRole('row').filter({ hasText: reservation.id })
  await expect(row.getByRole('button', { name: 'Cobrar', exact: true })).toHaveCount(0)
  await row.getByRole('button', { name: 'Aceptar solicitud', exact: true }).click()
  await row.getByRole('button', { name: 'Validar', exact: true }).click()
  await row.getByRole('button', { name: 'Cobrar', exact: true }).click()
  const reception = page.getByRole('dialog', { name: 'Gestión en recepción', exact: true })
  await expect(reception.getByLabel('Número de recibo o factura del hotel', { exact: true })).toHaveCount(0)
  await reception.getByRole('button', { name: 'Confirmar registro de prueba', exact: true }).click()
  await expect(reception.getByRole('tabpanel', { name: 'Cobro y comprobante', exact: true }).getByText('Saldo pendiente: US$0.00', { exact: true })).toBeVisible()
  await expect(summary.getByText('Pago registrado', { exact: true })).toBeVisible()
  await reception.getByRole('combobox', { name: 'Tipo de comprobante', exact: true }).selectOption('invoice')
  await reception.getByLabel('Número de recibo o factura del hotel', { exact: true }).fill('FAC-E2E-001')
  await reception.getByLabel('Fecha de emisión', { exact: true }).fill('2026-11-15')
  await reception.getByRole('button', { name: 'Guardar comprobante', exact: true }).click()
  await expect(reception.getByRole('status').filter({ hasText: 'Comprobante vinculado' })).toBeVisible()
  await expect(summary.getByText('Factura del hotel: FAC-E2E-001', { exact: true })).toBeVisible()
  expect((await storedReservations(page))[0]).toMatchObject({
    status: 'validated', paymentStatus: 'paid',
    payment: { amount: 100, recordedBy: 'Juan Recepción' },
    receiptHistory: [{ kind: 'invoice', number: 'FAC-E2E-001', issuedOn: '2026-11-15', recordedBy: 'Juan Recepción', revision: 1 }],
  })
  await page.evaluate(() => { window.print = () => { document.body.dataset.printRequested = 'yes' } })
  await reception.getByRole('button', { name: 'Imprimir / guardar PDF', exact: true }).click()
  await expect(page.locator('body')).toHaveAttribute('data-print-requested', 'yes')
  await page.emulateMedia({ media: 'print' })
  await expect(page.locator('#root')).toBeHidden()
  await expect(reception.locator('.reservation-print-content')).toBeVisible()
  await expect(reception.locator('.reservation-print-content').getByText('Factura del hotel: FAC-E2E-001', { exact: true })).toBeVisible()
  await expect(reception.getByRole('tab', { name: 'Cobro y comprobante', exact: true })).toBeHidden()
  await page.emulateMedia({ media: 'screen' })
  await reception.getByRole('button', { name: 'Cerrar', exact: true }).click()
  await expect(row.getByRole('button', { name: 'Cobrar', exact: true })).toHaveCount(0)
  await expect(row.getByRole('button', { name: 'Cobro y comprobante', exact: true })).toBeVisible()
  await page.reload()
  await loginToPanel(page)
  await page.getByRole('button', { name: 'Comprobantes y vouchers', exact: true }).click()
  await expect(page.getByText('Comprobante del hotel: FAC-E2E-001', { exact: true })).toBeVisible()
  await guest.close()
})

test('corregir un comprobante conserva el historial y protege una edición abierta en otra pestaña', async ({ page, context }) => {
  await seedReservations(page, currentKey, [paidReservation])
  await loginToPanel(page)
  await page.getByRole('button', { name: 'Cobro y comprobante', exact: true }).click()
  const first = page.getByRole('dialog', { name: 'Gestión en recepción', exact: true })
  await first.getByLabel('Número de recibo o factura del hotel', { exact: true }).fill('REC-001')
  await first.getByRole('button', { name: 'Guardar comprobante', exact: true }).click()
  await first.getByRole('button', { name: 'Corregir comprobante', exact: true }).click()
  await first.getByLabel('Número de recibo o factura del hotel', { exact: true }).fill('BORRADOR-ANTERIOR')

  const other = await context.newPage()
  await other.goto('/')
  await loginToPanel(other, 'Ana Administradora')
  await other.getByRole('button', { name: 'Cobro y comprobante', exact: true }).click()
  const second = other.getByRole('dialog', { name: 'Gestión en recepción', exact: true })
  await second.getByRole('button', { name: 'Corregir comprobante', exact: true }).click()
  await second.getByLabel('Número de recibo o factura del hotel', { exact: true }).fill('REC-002')
  await second.getByRole('button', { name: 'Guardar comprobante', exact: true }).click()
  await expect(first.getByRole('region', { name: 'Comprobante vigente', exact: true }).getByText('Recibo del hotel: REC-002', { exact: true })).toBeVisible()
  await first.getByRole('button', { name: 'Guardar comprobante', exact: true }).click()
  await expect(first.getByRole('alert')).toContainText('otra vista')
  const saved = (await storedReservations(page))[0]
  expect(saved.receiptHistory!.map(item => [item.number, item.recordedBy])).toEqual([['REC-001', 'Juan Recepción'], ['REC-002', 'Ana Administradora']])
  expect(saved.payment).toEqual(paidReservation.payment)
  await first.getByRole('button', { name: 'Cancelar edición', exact: true }).click()
  await first.getByRole('button', { name: 'Corregir comprobante', exact: true }).click()
  await expect(first.getByLabel('Número de recibo o factura del hotel', { exact: true })).toHaveValue('REC-002')
  await other.close()
})

test('un fallo al guardar el comprobante conserva el pago y no anuncia éxito', async ({ page }) => {
  await seedReservations(page, currentKey, [paidReservation])
  await loginToPanel(page)
  await page.getByRole('button', { name: 'Cobro y comprobante', exact: true }).click()
  const reception = page.getByRole('dialog', { name: 'Gestión en recepción', exact: true })
  await reception.getByLabel('Número de recibo o factura del hotel', { exact: true }).fill('REC-NO-GUARDADO')
  await page.evaluate(key => {
    const original = Storage.prototype.setItem
    Storage.prototype.setItem = function (storageKey, value) {
      if (storageKey === key) throw new DOMException('Prueba de almacenamiento lleno', 'QuotaExceededError')
      original.call(this, storageKey, value)
    }
  }, currentKey)
  await reception.getByRole('button', { name: 'Guardar comprobante', exact: true }).click()
  await expect(reception.getByRole('alert')).toContainText('No se pudo guardar')
  await expect(reception.getByText('Comprobante vinculado a la reserva.', { exact: true })).toHaveCount(0)
  expect(await storedReservations(page)).toEqual([paidReservation])
})

test('Revenue Manager consulta vouchers pero no obtiene acciones de cobro desde la bandeja', async ({ page }) => {
  await seedReservations(page, currentKey, [paidReservation])
  await loginToPanel(page, 'María Revenue')
  await expect(page.getByRole('button', { name: 'Cobrar', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Cobro y comprobante', exact: true })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Pasarela y cobros', exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Voucher', exact: true }).click()
  await expect(page.getByRole('dialog').getByText('Pago registrado', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await page.getByRole('button', { name: 'Tipos de habitación', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Cobro y comprobante', exact: true })).toHaveCount(0)
  expect(await storedReservations(page)).toEqual([paidReservation])
})

test('recepción funciona en móvil, inglés y tema oscuro con tarjeta externa de prueba', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.addInitScript(() => localStorage.setItem('hoteldirekt.theme', JSON.stringify('dark')))
  await seedReservations(page, currentKey, [{ ...pendingReservation, status: 'validated' }])
  // Login using the full-width controls, then operate the reservation on a phone viewport.
  await page.setViewportSize({ width: 1280, height: 800 })
  await loginToPanel(page)
  await page.getByRole('button', { name: 'Cobrar', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Cerrar', exact: true }).click()
  await page.getByRole('button', { name: 'Cambiar idioma', exact: true }).click()
  await page.getByRole('button', { name: 'Collect payment', exact: true }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  const reception = page.getByRole('dialog', { name: 'Reception management', exact: true })
  await reception.getByRole('combobox', { name: 'Payment method', exact: true }).selectOption('Tarjeta externa')
  await expect(reception.getByRole('button', { name: 'Payment link unavailable', exact: true })).toBeDisabled()
  await reception.getByLabel('Payment reference', { exact: true }).fill('CARD-TEST-001')
  await reception.getByRole('button', { name: 'Confirm test record', exact: true }).click()
  await expect(reception.getByRole('heading', { name: 'Payment recorded', exact: true })).toBeVisible()
  expect(await reception.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true)
  expect((await storedReservations(page))[0].payment).toMatchObject({ method: 'Tarjeta externa', reference: 'CARD-TEST-001', amount: 100 })
})

import { expect, test } from '@playwright/test'

test('el portal compilado permite abrir el acceso sin errores de JavaScript', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.locator('#root')).not.toBeEmpty()
  await page.getByRole('button', { name: 'Iniciar sesión' }).first().click()
  await expect(page.locator('input[type="password"]').first()).toBeVisible()
  expect(errors).toEqual([])
})

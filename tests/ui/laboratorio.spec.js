import { test, expect } from '@playwright/test';
test.beforeEach(async ({ page }) => {
  await page.goto('/');
});
test('pantalla, navegación, captura y ancho responsive', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.reload();
  await expect(page.getByRole('heading', { name: 'El frío, bajo tu control.' })).toBeVisible();
  await expect(page.locator('#display')).not.toBeEmpty();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  await page.screenshot({ path: `docs/evidencias/${info.project.name}.png`, fullPage: true });
  for (const label of ['Parámetros', 'Entrenamiento', 'Diagnóstico', 'Laboratorio'])
    await page.getByRole('tab', { name: label, exact: true }).click();
  expect(errors).toEqual([]);
});
test('parámetros: validación, persistencia y cierre por Escape', async ({ page }) => {
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).click();
  await expect(page.locator('#param-count')).toHaveText('72 / 72');
  await page.getByRole('button', { name: 'Editar SP', exact: true }).click();
  await page.getByLabel('Valor programado').fill('9999');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await expect(page.locator('#param-error')).not.toBeEmpty();
  await page.getByLabel('Valor programado').fill('6');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.reload();
  await expect(page.locator('#metric-sp')).toHaveText('6,0');
  await page.getByRole('button', { name: 'SET', exact: true }).click();
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
});
test('reto consigna, maniobra real y progreso guardado', async ({ page }) => {
  await page.getByRole('tab', { name: 'Entrenamiento', exact: true }).click();
  await page.locator('[data-lesson="consigna"]').click();
  await page.getByRole('button', { name: 'Comprobar ejercicio' }).click();
  await expect(page.getByText('Aún faltan objetivos.', { exact: false })).toBeVisible();
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).click();
  for (const [code, value] of [
    ['SP', '15'],
    ['rd', '4'],
  ]) {
    await page.getByRole('button', { name: `Editar ${code}`, exact: true }).click();
    await page.getByLabel('Valor programado').fill(value);
    await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  }
  await page.getByRole('tab', { name: 'Laboratorio', exact: true }).click();
  await page.getByLabel('Temperatura Pr1', { exact: true }).fill('19');
  await page.getByLabel('Temperatura Pr1', { exact: true }).press('Tab');
  await expect(page.locator('#metric-state')).toHaveText('Enfriando');
  await page.getByLabel('Temperatura Pr1', { exact: true }).fill('15');
  await page.getByLabel('Temperatura Pr1', { exact: true }).press('Tab');
  await expect(page.locator('#metric-state')).toHaveText('En reposo');
  await page.getByRole('tab', { name: 'Entrenamiento', exact: true }).click();
  await page.getByRole('button', { name: 'Comprobar ejercicio' }).click();
  await expect(page.getByText('✓ Reto superado. Maniobra verificada.')).toBeVisible();
  await page.reload();
  await page.getByRole('tab', { name: 'Entrenamiento', exact: true }).click();
  await expect(page.getByText('1 de 14 completadas.', { exact: false })).toBeVisible();
});
test('archivo inválido no cambia configuración, falla de sonda y puerta', async ({ page }) => {
  await page.locator('#import-file').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from('{"params":{"SP":99}}'),
  });
  await expect(page.locator('#notice')).toContainText('versión 3');
  await expect(page.locator('#metric-sp')).toHaveText('4,0');
  await page.getByLabel('Avería Pr1', { exact: true }).selectOption('short');
  await expect(page.locator('#display')).toHaveText('-E1');
  await page.getByLabel('Avería Pr1', { exact: true }).selectOption('none');
  await page.getByRole('button', { name: 'Abrir puerta', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Cerrar puerta', exact: true })).toBeVisible();
  await page.getByRole('button', { name: '+1 min', exact: true }).click();
  await expect(page.locator('#session-clock')).toHaveText('00:01:00');
});

test('teclado tEd, contraseña y reloj reproducible', async ({ page }) => {
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).click();
  for (const [code, value] of [
    ['tEd', '6'],
    ['tPP', '123'],
  ]) {
    await page.getByRole('button', { name: `Editar ${code}`, exact: true }).click();
    if (code === 'tPP') await page.getByLabel('Desactivado (oF)').uncheck();
    await page.getByLabel('Valor programado').fill(value);
    await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  }
  await page.getByRole('tab', { name: 'Laboratorio', exact: true }).click();
  await page.getByRole('button', { name: 'SET', exact: true }).click();
  await page.getByRole('button', { name: 'SPE', exact: true }).click();
  await expect(page.getByRole('heading', { name: 'SPE', exact: true })).toBeVisible();
  await page.getByLabel('Valor programado').fill('9');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await expect(page.locator('#param-error')).toHaveText('Contraseña incorrecta.');
  await page.getByLabel('Contraseña tPP').fill('123');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.locator('#play').click();
  await expect(page.locator('#session-clock')).not.toHaveText('00:00:00');
  await page.locator('#play').click();
  const paused = await page.locator('#session-clock').textContent();
  await page.waitForTimeout(600);
  await expect(page.locator('#session-clock')).toHaveText(paused);
});

test('exportación e importación válidas conservan configuración', async ({ page }) => {
  const downloaded = page.waitForEvent('download');
  await page.locator('[data-action="export"]').click();
  const path = await (await downloaded).path();
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).click();
  await page.getByRole('button', { name: 'Editar SP', exact: true }).click();
  await page.getByLabel('Valor programado').fill('6');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await page.locator('#import-file').setInputFiles(path);
  await expect(page.locator('#notice')).toContainText('Configuración importada');
  await page.getByRole('tab', { name: 'Laboratorio', exact: true }).click();
  await expect(page.locator('#metric-sp')).toHaveText('4,0');
});

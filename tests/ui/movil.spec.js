import { test, expect } from '@playwright/test';

test('PWA: manifiesto, iconos, recarga offline y edición persistente', async ({ page, context }) => {
  await page.goto('/');
  await expect(page.locator('#offline-status')).toHaveText('Disponible sin conexión');
  const manifest = await page.evaluate(async () =>
    (await fetch(document.querySelector('link[rel="manifest"]').href)).json(),
  );
  expect(manifest.display).toBe('standalone');
  expect(manifest.icons.map((icon) => icon.sizes)).toEqual(['192x192', '512x512']);
  for (const icon of manifest.icons) {
    const response = await page.request.get('/' + icon.src);
    expect(response.ok()).toBe(true);
    expect(response.headers()['content-type']).toContain('image/png');
  }
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller)
      await new Promise((resolve) =>
        navigator.serviceWorker.addEventListener('controllerchange', resolve, { once: true }),
      );
  });
  await context.setOffline(true);
  await page.goto('/?offline=1');
  await expect(page.locator('#offline-status')).toContainText('Sin conexión');
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).click();
  await page.getByRole('button', { name: 'Editar SP', exact: true }).click();
  await page.getByLabel('Valor programado').fill('6');
  await page.getByRole('button', { name: 'Guardar parámetro' }).click();
  await page.reload();
  await expect(page.locator('#metric-sp')).toHaveText('6,0');
  await page.getByRole('button', { name: '+1 min', exact: true }).click();
  await expect(page.locator('#session-clock')).toHaveText('00:01:00');
  await context.setOffline(false);
});

test('instalación ofrece instrucciones y cierre sin teclado', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Instalar app', exact: true }).click();
  await expect(page.getByRole('dialog')).toBeVisible();
  await expect(page.getByText('iPhone / iPad:', { exact: false })).toBeVisible();
  await page.getByRole('button', { name: 'Entendido' }).click();
  await expect(page.getByRole('dialog')).not.toBeVisible();
});

test('móvil táctil: signo, desactivación, avería y navegación siempre accesibles', async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, 'Recorrido exclusivo con pantalla táctil');
  await page.goto('/');
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).tap();
  await page.getByRole('button', { name: 'Editar PP1', exact: true }).tap();
  await page.getByLabel('Desactivado (oF)').tap();
  await page.getByLabel('Valor programado').fill('5');
  await page.getByRole('button', { name: '± Cambiar signo' }).tap();
  await expect(page.getByLabel('Valor programado')).toHaveValue('-5');
  await page.getByRole('button', { name: 'Guardar parámetro' }).tap();
  await expect(page.getByRole('button', { name: 'Editar PP1', exact: true })).toContainText('-5');
  await page.getByRole('button', { name: 'Editar PP1', exact: true }).tap();
  await page.getByLabel('Desactivado (oF)').tap();
  await page.getByRole('button', { name: 'Guardar parámetro' }).tap();
  await expect(page.getByRole('button', { name: 'Editar PP1', exact: true })).toContainText('oF');
  await page.getByRole('tab', { name: 'Laboratorio', exact: true }).tap();
  await page.getByLabel('Evolución física').tap();
  await page.getByLabel('Temperatura Pr1', { exact: true }).fill('5');
  await page.getByRole('button', { name: 'Cambiar signo Pr1', exact: true }).tap();
  await expect(page.getByLabel('Temperatura Pr1', { exact: true })).toHaveValue('-5.0');
  await page.getByLabel('Avería Pr1', { exact: true }).selectOption('open');
  await expect(page.locator('#display')).toHaveText('E1');
  await page.getByRole('tab', { name: 'Diagnóstico', exact: true }).tap();
  await page.getByRole('button', { name: '+1 min', exact: true }).tap();
  await expect(page.locator('#session-clock')).toHaveText('00:01:00');
});

test('móvil: 320–430 px, controles de 44 px y diálogo en horizontal', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'Dimensiones de pantalla táctil');
  await page.goto('/');
  for (const width of [320, 360, 390, 430]) {
    await page.setViewportSize({ width, height: 800 });
    for (const tab of ['Laboratorio', 'Parámetros', 'Entrenamiento', 'Diagnóstico']) {
      await page.getByRole('tab', { name: tab, exact: true }).tap();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
      const small = await page
        .locator('button:visible, select:visible, input:visible:not([type="checkbox"])')
        .evaluateAll((nodes) =>
          nodes
            .filter((node) => {
              const { width, height } = node.getBoundingClientRect();
              return width < 43.5 || height < 43.5;
            })
            .map((node) => node.getAttribute('aria-label') || node.id || node.textContent),
        );
      expect(small).toEqual([]);
    }
  }
  await page.setViewportSize({ width: 667, height: 375 });
  await page.getByRole('tab', { name: 'Parámetros', exact: true }).tap();
  await page.getByRole('button', { name: 'Editar SP', exact: true }).tap();
  await page.getByLabel('Valor programado').fill('6');
  await page.getByRole('button', { name: 'Guardar parámetro' }).tap();
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.setViewportSize({ width: 390, height: 844 });
  await page.getByRole('tab', { name: 'Laboratorio', exact: true }).tap();
  await page.screenshot({ path: 'docs/evidencias/mobile-pwa.png', fullPage: true });
  await page.screenshot({ path: 'docs/evidencias/mobile-home.png' });
});

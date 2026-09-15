import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const api = 'http://localhost:15154/api';

test.beforeEach(() => {
  execFileSync('docker', ['compose', '-p', 'hopper-e2e', '-f', 'compose.yml', 'exec', '-T', 'db',
    '/opt/mssql-tools18/bin/sqlcmd', '-b', '-C', '-S', 'localhost', '-U', 'sa',
    '-P', 'HopperE2e-Only!2026', '-d', 'HopperE2e'], { input: readFileSync('seed.sql') });
});

test('draft consumes all tickets with mixed 4- and 2-ticket browser picks', async ({ page, request }, testInfo) => {
  await page.goto('/games');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox').click();
  await page.getByRole('option', { name: /E2E Admin/ }).click();
  await dialog.getByLabel('PIN', { exact: true }).fill('1234');
  await dialog.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(dialog).toBeHidden();
  await page.goto('/admin');
  await page.getByRole('tab', { name: 'Draft', exact: true }).click();
  const started = page.waitForResponse(r => r.url().endsWith('/Draft/start/1') && r.request().method() === 'POST');
  await page.getByRole('button', { name: /Start Draft/ }).click();
  expect((await started).ok()).toBeTruthy();
  await page.goto('/games');
  await page.getByRole('button', { name: 'Filter', exact: true }).click();
  await page.getByRole('switch', { name: 'Only Available Games' }).click();
  await expect(page.getByRole('switch', { name: 'Only Available Games' })).toBeChecked();
  await page.getByRole('button', { name: 'Close', exact: true }).click();

  const picks: any[] = [];
  let total = 24;
  for (let turn = 0; total > 0 && turn < 12; turn++) {
    const status = await (await request.get(`${api}/Draft/1/status`)).json();
    const games = await (await request.get(`${api}/games/season/1`)).json();
    const next = status.upcoming[0];
    expect(next, `Queue empty with ${total} tickets remaining`).toBeTruthy();
    const user = status.users.find((u: any) => u.firebaseUserId === next.firebaseUserId);
    expect(user.remaining, `Exhausted participant queued: ${user.displayName}`).toBeGreaterThanOrEqual(2);
    const available = games.filter((g: any) => g.remainingTickets > 0);
    await expect(page.locator('app-game-card')).toHaveCount(available.length);
    const game = available.find((g: any) => g.remainingTickets === 2) || available[0];
    const quantity = turn % 2 === 0 && user.remaining >= 4 && game.remainingTickets >= 4 ? 4 : 2;
    const card = page.locator(`[data-game-id="${game.gameId}"]`);
    const saved = page.waitForResponse(r => r.url().endsWith('/Selections/1') && r.request().method() === 'POST');
    if (quantity === 4) {
      await card.getByRole('button', { name: /Pick 4/ }).click();
      await page.getByRole('menuitem', { name: 'Pick 4', exact: true }).click();
    } else {
      await card.getByRole('button', { name: 'Pick 2', exact: true }).click();
    }
    const response = await saved;
    expect(response.ok(), await response.text()).toBeTruthy();
    total -= quantity;
    picks.push({ turn, user: user.displayName, game: game.gameId, quantity, remaining: total });
    await expect.poll(async () => {
      const current = await (await request.get(`${api}/games/season/1`)).json();
      return current.reduce((sum: number, g: any) => sum + g.remainingTickets, 0);
    }).toBe(total);
    const current = await (await request.get(`${api}/games/season/1`)).json();
    for (const g of current) {
      expect(g.remainingTickets).toBeGreaterThanOrEqual(0);
      expect(g.selections.reduce((sum: number, s: any) => sum + s.quantity, 0) + g.remainingTickets).toBe(4);
    }
    await expect(page.locator('app-game-card')).toHaveCount(current.filter((g: any) => g.remainingTickets > 0).length);
  }
  await testInfo.attach('picks', { body: JSON.stringify(picks, null, 2), contentType: 'application/json' });
  expect(total).toBe(0);
  expect(picks.some(p => p.quantity === 4)).toBeTruthy();
  expect(picks.some(p => p.quantity === 2)).toBeTruthy();
  const final = await (await request.get(`${api}/Draft/1/status`)).json();
  expect(final.users.every((u: any) => u.remaining === 0 && u.picked === u.allotment)).toBeTruthy();
  expect(final.upcoming).toHaveLength(0);
  await expect(page.locator('app-game-card')).toHaveCount(0);
});

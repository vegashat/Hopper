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

test('participant wait statistics count completed turns, including splits and skipped orders', async ({ page, request }) => {
  await page.goto('/participants');
  const row = (name: string) => page.getByRole('row').filter({ hasText: name });
  const check = async (name: string, last: number, longest: number) => {
    await expect(row(name).locator('.mat-column-lastPick')).toHaveText(`${last} Picks ago`);
    await expect(row(name).locator('.mat-column-longestWait')).toHaveText(`${longest} Picks`);
  };
  await check('E2E Alice', 0, 0);
  await check('E2E Carol', 0, 0);
  // Five completed turns: A, B, B, B, A+C (split). Deliberate gaps
  // represent deleted pending turns; they are not completed picks.
  execFileSync('docker', ['compose', '-p', 'hopper-e2e', '-f', 'compose.yml', 'exec', '-T', 'db',
    '/opt/mssql-tools18/bin/sqlcmd', '-b', '-C', '-S', 'localhost', '-U', 'sa',
    '-P', 'HopperE2e-Only!2026', '-d', 'HopperE2e'], { input: `
    IF DB_NAME() <> 'HopperE2e' THROW 50000, 'Test database required', 1;
    INSERT INTO Draft (SeasonId, IsActive) VALUES (1, 1);
    DECLARE @draft int = SCOPE_IDENTITY();
    DECLARE @games TABLE (n int, id int);
    INSERT INTO @games SELECT ROW_NUMBER() OVER (ORDER BY GameId), GameId FROM Game;
    INSERT INTO DraftPick (DraftId, FirebaseUserId, PickOrder, GameId, ClaimedUtc)
    SELECT @draft, uid, ord, g.id, SYSUTCDATETIME()
    FROM (VALUES (1, 'e2e-a', 2), (2, 'e2e-b', 5), (3, 'e2e-b', 9),
                 (4, 'e2e-b', 10), (5, 'e2e-a', 15)) p(n, uid, ord)
    INNER JOIN @games g ON g.n = p.n;
    INSERT INTO Selection (DraftPickId, FirebaseUserId, GameId, Quantity, PickedUtc)
    SELECT DraftPickId, FirebaseUserId, GameId, 2, SYSUTCDATETIME() FROM DraftPick WHERE DraftId = @draft;
    INSERT INTO Selection (DraftPickId, FirebaseUserId, GameId, Quantity, PickedUtc)
    SELECT DraftPickId, 'e2e-c', GameId, 2, SYSUTCDATETIME() FROM DraftPick WHERE DraftId = @draft AND PickOrder = 15;
    UPDATE g SET RemainingTickets = 4 - COALESCE((SELECT SUM(Quantity) FROM Selection WHERE GameId = g.GameId), 0) FROM Game g;
    INSERT INTO DraftPick (DraftId, FirebaseUserId, PickOrder) VALUES (@draft, 'e2e-c', 20);
  ` });
  await page.reload();
  await check('E2E Alice', 0, 3);
  await check('E2E Bob', 1, 1);
  await check('E2E Carol', 0, 4);
  await check('E2E Admin', 5, 5); // No picks yet: the entire draft is the wait.

  // Make a real pick and verify the open Participants page updates via SignalR.
  const status = await (await request.get(`${api}/Draft/1/status`)).json();
  const games = await (await request.get(`${api}/games/season/1`)).json();
  const response = await request.post(`${api}/Selections/1`, { data: [{
    draftPickId: status.upcoming[0].draftPickId, firebaseUserId: 'e2e-c',
    gameId: games.find((g: any) => g.remainingTickets === 4).gameId, quantity: 2
  }] });
  expect(response.ok(), await response.text()).toBeTruthy();
  await check('E2E Alice', 1, 3);
  await check('E2E Bob', 2, 2);
  await check('E2E Carol', 0, 4);
  await check('E2E Admin', 6, 6);
});

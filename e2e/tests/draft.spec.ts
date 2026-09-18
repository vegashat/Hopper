import { test, expect } from '@playwright/test';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const api = 'http://localhost:15154/api';

test.beforeEach(() => {
  execFileSync('docker', ['compose', '-p', 'hopper-e2e', '-f', 'compose.yml', 'exec', '-T', 'db',
    '/opt/mssql-tools18/bin/sqlcmd', '-b', '-C', '-S', 'localhost', '-U', 'sa',
    '-P', 'HopperE2e-Only!2026', '-d', 'HopperE2e'], { input: readFileSync('seed.sql') });
});

async function loginAs(page: any, name: RegExp) {
  await page.goto('/games');
  const logout = page.getByRole('button', { name: 'Logout', exact: true });
  if (await logout.isVisible()) await logout.click();
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  const dialog = page.getByRole('dialog');
  await dialog.getByRole('combobox').click();
  await page.getByRole('option', { name }).click();
  await dialog.getByLabel('PIN', { exact: true }).fill('1234');
  await dialog.getByRole('button', { name: 'Login', exact: true }).click();
  await expect(page.getByRole('dialog', { name: 'Login' })).toBeHidden();
}

async function saveRankings(page: any) {
  const saved = page.waitForResponse((response: any) =>
    response.url().includes('/game-rankings') && response.request().method() === 'PUT');
  await page.getByRole('button', { name: 'Save rankings' }).click();
  expect((await saved).status()).toBe(204);
}

test('admin can skip the current draft pick without spending tickets', async ({ page, request }) => {
  await loginAs(page, /E2E Admin/);
  await page.goto('/admin');
  await page.getByRole('tab', { name: 'Draft', exact: true }).click();

  const started = page.waitForResponse(r => r.url().endsWith('/Draft/start/1') && r.request().method() === 'POST');
  await page.getByRole('button', { name: /Start Draft/ }).click();
  expect((await started).ok()).toBeTruthy();

  const before = await (await request.get(`${api}/Draft/1/status`)).json();
  const turn = before.upcoming[0];
  expect(turn).toBeTruthy();
  const skipped = page.waitForResponse(r => r.url().endsWith('/Draft/skip/1') && r.request().method() === 'POST');
  await page.getByRole('button', { name: 'Skip current pick' }).click();
  expect((await skipped).status()).toBe(200);

  await expect.poll(async () => (await (await request.get(`${api}/Draft/1/status`)).json()).history
    .some((pick: any) => pick.pickOrder === turn.pickOrder && pick.isSkipped)).toBeTruthy();
  const after = await (await request.get(`${api}/Draft/1/status`)).json();
  expect(after.totalTicketsRemaining).toBe(before.totalTicketsRemaining);
  expect(after.upcoming[0].draftPickId).not.toBe(turn.draftPickId);
});

test('rankings suggest selections, allow rejection, and split ticket purchases between users', async ({ page, browser, request }) => {
  const bobPage = await browser.newPage();
  const adminPage = await browser.newPage();
  const games = await (await request.get(`${api}/games/season/1`)).json();
  const rankAlice: { gameId: number; quantity: number }[] = [];
  let rankBob: { gameId: number; quantity: number };

  await loginAs(page, /E2E Alice/);
  await page.goto('/rankings');
  for (const index of [0, 1]) {
    const row = page.locator('.available-row').nth(index);
    const gameName = await row.locator('strong').innerText();
    const rankedGame = games.find((game: any) => game.opponent.name === gameName);
    expect(rankedGame).toBeTruthy();
    rankAlice.push({ gameId: rankedGame.gameId, quantity: 2 });
    const add = row.getByRole('button', { name: /Add/ });
    await add.click();
    await page.getByRole('dialog').getByRole('button', { name: '2 tickets', exact: true }).click();
    await expect(page.locator('.ranking-row').nth(index).locator('strong')).toHaveText(gameName);
    await saveRankings(page);
  }
  const aliceRankingResponse = await request.get(`${api}/seasons/1/game-rankings?firebaseUserId=e2e-a`);
  expect((await aliceRankingResponse.json()).map((item: any) => ({
    gameId: item.gameId, quantity: item.quantity, rankOrder: item.rankOrder
  }))).toEqual(rankAlice.map((item, rankOrder) => ({ ...item, rankOrder: rankOrder + 1 })));

  await loginAs(bobPage, /E2E Bob/);
  await bobPage.goto('/rankings');
  const row = bobPage.locator('.available-row').nth(2);
  const bobGameName = await row.locator('strong').innerText();
  const bobGame = games.find((game: any) => game.opponent.name === bobGameName);
  expect(bobGame).toBeTruthy();
  rankBob = { gameId: bobGame.gameId, quantity: 2 };
  await row.getByRole('button', { name: /Add/ }).click();
  await bobPage.getByRole('dialog').getByRole('button', { name: '2 tickets', exact: true }).click();
  await saveRankings(bobPage);
  await expect(bobPage.locator('.ranking-row').locator('strong')).toHaveText([bobGameName]);
  const bobRankingResponse = await request.get(`${api}/seasons/1/game-rankings?firebaseUserId=e2e-b`);
  expect((await bobRankingResponse.json()).map((item: any) => ({
    gameId: item.gameId, quantity: item.quantity, rankOrder: item.rankOrder
  }))).toEqual([{ ...rankBob, rankOrder: 1 }]);

  await loginAs(adminPage, /E2E Admin/);
  await adminPage.goto('/admin');
  await adminPage.getByRole('tab', { name: 'Draft', exact: true }).click();
  const started = adminPage.waitForResponse(r => r.url().endsWith('/Draft/start/1') && r.request().method() === 'POST');
  await adminPage.getByRole('button', { name: /Start Draft/ }).click();
  expect((await started).ok()).toBeTruthy();

  const makeRankedChoice = async (userId: string, accept: boolean) => {
    const state = await (await request.get(`${api}/Draft/1/status`)).json();
    const turn = state.upcoming[0];
    expect(turn.firebaseUserId).toBe(userId);
    const pickerPage = userId === 'e2e-a' ? page : bobPage;
    await pickerPage.goto('/games');
    const suggestion = pickerPage.getByRole('dialog', { name: 'Ranked game available' });
    await expect(suggestion.getByRole('heading', { name: 'Ranked game available' })).toBeVisible();
    const userRankings = await (await request.get(`${api}/seasons/1/game-rankings?firebaseUserId=${userId}`)).json();
    const selectedRanking = userRankings
      .filter((ranking: any) => !ranking.isFulfilled)
      .sort((a: any, b: any) => a.rankOrder - b.rankOrder)[0];
    const selectedGame = games.find((game: any) => game.gameId === selectedRanking.gameId);
    expect(selectedGame).toBeTruthy();
    if (accept) {
      const saved = pickerPage.waitForResponse(r => r.url().endsWith('/Selections/1') && r.request().method() === 'POST');
      await suggestion.getByRole('button', { name: /Select 2 tickets/ }).click();
      expect((await saved).ok()).toBeTruthy();
      await expect.poll(async () => {
        const current = await (await request.get(`${api}/games/season/1`)).json();
        return current.find((g: any) => g.gameId === selectedGame.gameId).remainingTickets;
      }).toBe(2);
    } else {
      await suggestion.getByRole('button', { name: 'Cancel', exact: true }).click();
      await expect(suggestion).toBeHidden();
      const saved = pickerPage.waitForResponse(r => r.url().endsWith('/Selections/1') && r.request().method() === 'POST');
      await pickerPage.locator(`[data-game-id="${selectedGame.gameId}"]`).getByRole('button', { name: 'Pick 2', exact: true }).click();
      expect((await saved).ok()).toBeTruthy();
    }
  };

  let status = await (await request.get(`${api}/Draft/1/status`)).json();
  const rankedUsersSeen = new Set<string>();
  for (let turn = 0; turn < 8 && rankedUsersSeen.size < 2; turn++) {
    status = await (await request.get(`${api}/Draft/1/status`)).json();
    const pickerId = status.upcoming[0].firebaseUserId;
    if (pickerId !== 'e2e-a' && pickerId !== 'e2e-b') continue;
    await makeRankedChoice(pickerId, pickerId === 'e2e-a');
    rankedUsersSeen.add(pickerId);
  }
  expect([...rankedUsersSeen].sort()).toEqual(['e2e-a', 'e2e-b']);

  // Make a separate two-person purchase through the split-pick dialog.
  const afterSuggestion = await (await request.get(`${api}/Draft/1/status`)).json();
  const next = afterSuggestion.upcoming[0];
  await adminPage.goto('/games');
  const available = (await (await request.get(`${api}/games/season/1`)).json()).find((g: any) => g.remainingTickets === 4);
  expect(available).toBeTruthy();
  const splitCard = adminPage.locator(`[data-game-id="${available.gameId}"]`);
  await splitCard.getByRole('button', { name: /Pick 4/ }).click();
  await adminPage.getByRole('menuitem', { name: 'Split 4', exact: true }).click();
  const splitDialog = adminPage.getByRole('dialog');
  await splitDialog.getByRole('combobox').click();
  const splitUser = afterSuggestion.users.find((user: any) =>
    user.firebaseUserId !== next.firebaseUserId && user.remaining >= 2);
  expect(splitUser).toBeTruthy();
  await adminPage.getByRole('option', { name: new RegExp(splitUser.displayName) }).click();
  const purchased = adminPage.waitForResponse(r => r.url().endsWith('/Selections/1') && r.request().method() === 'POST');
  await splitDialog.getByRole('button', { name: 'Confirm', exact: true }).click();
  expect((await purchased).ok()).toBeTruthy();
  const finalGames = await (await request.get(`${api}/games/season/1`)).json();
  const splitGame = finalGames.find((g: any) => g.gameId === available.gameId);
  expect(splitGame.remainingTickets).toBe(0);
  expect(splitGame.selections).toHaveLength(2);
  expect(splitGame.selections.map((selection: any) => selection.quantity)).toEqual([2, 2]);
  expect(new Set(splitGame.selections.map((selection: any) => selection.firebaseUserId)).size).toBe(2);
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

test('participant wait statistics count completed turns, including splits and skipped orders', async ({ page, browser, request }) => {
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
  const gamesPage = await browser.newPage();
  await gamesPage.goto('/games');
  const availableGame = (await (await request.get(`${api}/games/season/1`)).json())
    .find((game: any) => game.remainingTickets === 4);
  expect(availableGame).toBeTruthy();
  const liveGameCard = gamesPage.locator(`[data-game-id="${availableGame.gameId}"]`);
  await expect(liveGameCard).toContainText('Remaining tickets: 4');

  const status = await (await request.get(`${api}/Draft/1/status`)).json();
  const response = await request.post(`${api}/Selections/1`, { data: [{
    draftPickId: status.upcoming[0].draftPickId, firebaseUserId: 'e2e-c',
    gameId: availableGame.gameId, quantity: 2
  }] });
  expect(response.ok(), await response.text()).toBeTruthy();
  await expect(liveGameCard).toContainText('Remaining tickets: 2');
  await check('E2E Alice', 1, 3);
  await check('E2E Bob', 2, 2);
  await check('E2E Carol', 0, 4);
  await check('E2E Admin', 6, 6);
});

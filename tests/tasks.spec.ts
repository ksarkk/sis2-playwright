import { test, expect, type Page } from '@playwright/test';

async function add(page: Page, name: string) {
  await page.getByRole('textbox', { name: 'Task' }).fill(name);
  await page.getByRole('button', { name: 'Add' }).click();
}
test.beforeEach(async ({ page }) => { await page.goto('/'); });

test.only('starts empty', async ({ page }) => {
  await expect(page.getByRole('status')).toHaveText('Remaining: 0');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});
test('adds a task using Enter', async ({ page }) => {
  const input = page.getByRole('textbox');
  await input.fill('Read');
  await input.press('Enter');
  await expect(page.getByRole('checkbox', { name: 'Read' })).not.toBeChecked();
  await expect(input).toHaveValue('');
});
test('ignores whitespace-only names', async ({ page }) => {
  await add(page, '   ');
  await expect(page.getByRole('listitem')).toHaveCount(0);
});
test('trims names', async ({ page }) => {
  await add(page, '  Review  ');
  expect(await page.locator('li label').textContent()).toBe('Review');
});
test('counts unfinished tasks', async ({ page }) => {
  await add(page, 'Read');
  await add(page, 'Write');
  await page.getByRole('checkbox', { name: 'Read' }).check();
  await expect(page.getByRole('status')).toHaveText('Remaining: 1');
});
test('reopens a completed task', async ({ page }) => {
  await add(page, 'Read');
  const check = page.getByRole('checkbox');
  await check.check();
  await check.uncheck();
  await expect(page.getByRole('status')).toHaveText('Remaining: 1');
});
test('deletes only the selected task', async ({ page }) => {
  await add(page, 'First');
  await add(page, 'Second');
  await page.getByRole('listitem').filter({ hasText: 'First' }).getByRole('button').click();
  await expect(page.getByRole('listitem')).toHaveCount(1);
  await expect(page.getByRole('checkbox', { name: 'Second' })).toBeVisible();
});
test('restores completion after reload', async ({ page }) => {
  await add(page, 'Read');
  await page.getByRole('checkbox').check();
  await page.reload();
  await expect(page.getByRole('checkbox', { name: 'Read' })).toBeChecked();
  await expect(page.getByRole('status')).toHaveText('Remaining: 0');
});

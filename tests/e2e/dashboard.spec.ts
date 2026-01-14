import { test, expect, Page } from '@playwright/test';

async function login(page: Page) {
    await page.goto('/frontend/login.html');
    await page.fill('input[type="email"]', 'ryry@golo.com');
    await page.fill('input[type="password"]', 'ryrycochet');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/index\.html/);
    await page.goto('/frontend/report.html');
}

test.describe('Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        await login(page);
    });

    test('affiche les jauges de santé', async ({ page }) => {
        await expect(page.getByText(/sucre/i)).toBeVisible();
        await expect(page.getByText(/caféine/i)).toBeVisible();
    });

    test('affiche les données de santé du dashboard', async ({ page }) => {
        await expect(page.locator('canvas')).toHaveCount(3);
    });


});
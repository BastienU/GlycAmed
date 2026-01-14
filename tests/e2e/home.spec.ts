import { test, expect } from '@playwright/test';

test('la page d\'accueil affiche le titre', async ({ page }) => {
  await page.goto('/frontend/index.html');
  
  // Adaptez selon votre implémentation
  await expect(page.locator('h1')).toContainText(/glycamed/i);
});
import { test, expect } from '@playwright/test';

test.describe('Authentification', () => {
  
  test('connexion avec identifiants valides', async ({ page }) => {
    await page.goto('/frontend/login.html');
    
    await page.fill('input[type="email"]', 'ryry@golo.com');
    await page.fill('input[type="password"]', 'ryrycochet');
    
    // Soumettre
    await page.click('button[type="submit"]');
    
    // Vérifier la redirection vers le dashboard
    await expect(page).toHaveURL(/index.html/);
  });
  
  test('affiche une erreur avec mauvais mot de passe', async ({ page }) => {
    await page.goto('/frontend/login.html');
    
    await page.fill('input[type="email"]', 'ryry@cochet.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    // Vérifier qu'un message d'erreur apparaît
    // ADAPTER selon comment vous affichez les erreurs
    await expect(page.locator('.alert')).toBeVisible();
  });
  
});
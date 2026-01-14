import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  
  use: {
    baseURL: 'http://localhost:5500',
    screenshot: 'only-on-failure',
  },
  
  // Lance votre serveur avant les tests
  webServer: {
    command: 'npm run dev', // Adapter à votre commande
    url: 'http://localhost:5500',
    reuseExistingServer: !process.env.CI,
  },
});
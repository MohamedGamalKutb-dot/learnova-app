import { test, expect } from '@playwright/test';

test('Test parent add and remove child', async ({ page }) => {
  test.setTimeout(60000);
  
  // Navigate and login as parent
  await page.goto('http://localhost:5173/parent-dashboard');
  
  // Login
  await page.getByLabel(/البريد الإلكتروني|Email/i).fill('nourhan@parent.com');
  await page.getByLabel(/كلمة المرور|Password/i).fill('123456');
  await page.getByRole('button', { name: /تسجيل الدخول|Login/i }).last().click();

  // Wait for dashboard to load
  await expect(page.getByText(/تعديل البيانات|Edit Profile/i)).toBeVisible({ timeout: 15000 });

  // Add child
  console.log('Adding child...');
  await page.getByRole('button', { name: '+' }).click();
  await page.getByPlaceholder('LN-XXXXXX').fill('LN-NOUR'); // Dummy ID
  await page.getByRole('button', { name: /ربط|Link/i }).last().click();

  // Wait a bit to observe
  await page.waitForTimeout(3000);
  
  // Remove child
  console.log('Removing child...');
  const childItem = page.locator('.flex.items-center.gap-3').filter({ hasText: 'LN-NOUR' }).first();
  await expect(childItem).toBeVisible();
  
  // Click trash
  await childItem.locator('button').last().click();
  
  // Wait to observe deletion
  await page.waitForTimeout(3000);
});

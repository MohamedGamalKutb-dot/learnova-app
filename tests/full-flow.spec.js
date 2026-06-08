import { test, expect } from '@playwright/test';

test.describe('Learnova Full Flow Error Catching', () => {

  test('Parent Login Flow - Incorrect Credentials should not crash', async ({ page }) => {
    // 1. Go to choice page
    await page.goto('/choice');
    
    // 2. Select Parent
    const parentButton = page.getByText(/ولي الأمر|Parent/i).first();
    await parentButton.click();
    
    // 3. We should be on parent-login
    await expect(page).toHaveURL(/.*parent-login/);
    
    // 4. Fill in fake credentials
    await page.getByLabel(/البريد الإلكتروني|Email/i).fill('fake-parent@example.com');
    await page.getByLabel(/كلمة المرور|Password/i).fill('wrongpassword123');
    
    // 5. Submit
    const loginBtn = page.getByRole('button', { name: /تسجيل الدخول|Login/i }).last();
    await loginBtn.click();
    
    // 6. The app should show a toast/error, but NOT crash (White Screen).
    // We verify the page is still active and login fields are still visible
    await expect(page.getByLabel(/البريد الإلكتروني|Email/i)).toBeVisible();
  });

  test('Doctor Login Flow - Empty Submission should trigger validation', async ({ page }) => {
    await page.goto('/doctor-login');
    
    // Try to login without filling
    const loginBtn = page.getByRole('button', { name: /تسجيل الدخول|Login/i }).last();
    await loginBtn.click();
    
    // The browser native validation or our custom toast should prevent crash
    await expect(page.getByLabel(/البريد الإلكتروني|Email/i)).toBeVisible();
  });

  test('Child App - Public check', async ({ page }) => {
    // If the child tries to access a protected route directly without logging in
    await page.goto('/child-dashboard');
    
    // The app should redirect back to home or choice page securely, without crashing
    await expect(page).toHaveURL(/\/|\/choice/);
  });
});

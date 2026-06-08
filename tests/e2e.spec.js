import { test, expect } from '@playwright/test';

test.describe('Learnova App E2E Flow', () => {

  test('should load landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Expect the title to contain "Learnova" or the main brand
    await expect(page).toHaveTitle(/Learnova|LearnNeur/i);
    
    // Ensure the main CTA button is visible
    const getStartedBtn = page.getByRole('button', { name: /ابدأ الآن|Get Started/i });
    await expect(getStartedBtn.first()).toBeVisible();
  });

  test('should navigate to choice page and show user types', async ({ page }) => {
    await page.goto('/choice');
    
    // Expect all three cards to be visible
    await expect(page.getByText(/ولي الأمر|Parent/i).first()).toBeVisible();
    await expect(page.getByText(/الطبيب|Doctor/i).first()).toBeVisible();
    await expect(page.getByText(/الطفل|Child/i).first()).toBeVisible();
  });

  test('should open parent login and show correct fields', async ({ page }) => {
    await page.goto('/parent-login');
    
    // Check if the form is there
    await expect(page.getByLabel(/البريد الإلكتروني|Email/i)).toBeVisible();
    await expect(page.getByLabel(/كلمة المرور|Password/i)).toBeVisible();
    
    // Check if login button exists
    const loginBtn = page.getByRole('button');
    await expect(loginBtn.last()).toBeVisible();
  });

  test('should open doctor login and show correct fields', async ({ page }) => {
    await page.goto('/doctor-login');
    
    // Check if the form is there
    await expect(page.getByLabel(/البريد الإلكتروني|Email/i)).toBeVisible();
    await expect(page.getByLabel(/كلمة المرور|Password/i)).toBeVisible();
  });

});

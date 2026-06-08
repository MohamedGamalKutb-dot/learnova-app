# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: child-flow.spec.js >> Test parent add and remove child
- Location: tests\child-flow.spec.js:3:1

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.click: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: /تسجيل الدخول|Login/i }).last()

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e5]:
    - heading "Welcome Back" [level=2] [ref=e10]
    - paragraph [ref=e11]: سجل حساباً جديداً لمتابعة تقدم أطفالك وإدارة أنشطتهم اليومية بسهولة
    - generic [ref=e12]:
      - img [ref=e14]
      - img [ref=e17]
      - img [ref=e20]
      - img [ref=e23]
  - generic [ref=e26]:
    - button "← Back" [ref=e27] [cursor=pointer]
    - generic [ref=e28]:
      - generic [ref=e30]: Parent Dashboard
      - heading "Sign In" [level=1] [ref=e32]
      - paragraph [ref=e33]: املأ البيانات لإنشاء حساب ولي أمر جديد
    - generic [ref=e34]:
      - generic [ref=e36]:
        - generic [ref=e37]: Email Address **
        - textbox "Email Address **" [ref=e39]:
          - /placeholder: example@email.com
          - text: nourhan@parent.com
      - generic [ref=e41]:
        - generic [ref=e42]: Password **
        - generic [ref=e43]:
          - textbox "Password **" [active] [ref=e44]:
            - /placeholder: ••••••••
            - text: "123456"
          - button "👁️" [ref=e45] [cursor=pointer]
      - button "Sign In" [ref=e46] [cursor=pointer]
    - generic [ref=e47]:
      - separator [ref=e48]
      - generic [ref=e49]: OR
      - separator [ref=e50]
    - button "Sign in with Google" [ref=e51] [cursor=pointer]:
      - img [ref=e52]
      - text: Sign in with Google
    - paragraph [ref=e58]:
      - text: Don't have an account?
      - button "Sign Up" [ref=e59] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Test parent add and remove child', async ({ page }) => {
  4  |   test.setTimeout(60000);
  5  |   
  6  |   // Navigate and login as parent
  7  |   await page.goto('http://localhost:5173/parent-dashboard');
  8  |   
  9  |   // Login
  10 |   await page.getByLabel(/البريد الإلكتروني|Email/i).fill('nourhan@parent.com');
  11 |   await page.getByLabel(/كلمة المرور|Password/i).fill('123456');
> 12 |   await page.getByRole('button', { name: /تسجيل الدخول|Login/i }).last().click();
     |                                                                          ^ Error: locator.click: Test timeout of 60000ms exceeded.
  13 | 
  14 |   // Wait for dashboard to load
  15 |   await expect(page.getByText(/تعديل البيانات|Edit Profile/i)).toBeVisible({ timeout: 15000 });
  16 | 
  17 |   // Add child
  18 |   console.log('Adding child...');
  19 |   await page.getByRole('button', { name: '+' }).click();
  20 |   await page.getByPlaceholder('LN-XXXXXX').fill('LN-NOUR'); // Dummy ID
  21 |   await page.getByRole('button', { name: /ربط|Link/i }).last().click();
  22 | 
  23 |   // Wait a bit to observe
  24 |   await page.waitForTimeout(3000);
  25 |   
  26 |   // Remove child
  27 |   console.log('Removing child...');
  28 |   const childItem = page.locator('.flex.items-center.gap-3').filter({ hasText: 'LN-NOUR' }).first();
  29 |   await expect(childItem).toBeVisible();
  30 |   
  31 |   // Click trash
  32 |   await childItem.locator('button').last().click();
  33 |   
  34 |   // Wait to observe deletion
  35 |   await page.waitForTimeout(3000);
  36 | });
  37 | 
```
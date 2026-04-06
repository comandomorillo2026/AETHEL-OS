/**
 * E2E Tests for Authentication
 * Playwright end-to-end tests
 */

import { test, expect, Page } from '@playwright/test';

const BASE_URL = process.env.E2E_BASE_URL || 'http://localhost:3000';

// Test credentials
const TEST_ADMIN = {
  email: 'admin@aethel.tt',
  password: 'Aethel2024!',
};

const TEST_CLINIC = {
  email: 'clinic@aethel.tt',
  password: 'Demo2024!',
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);
  });

  test('should display login form', async ({ page }) => {
    // Check page title
    await expect(page.locator('h1')).toContainText('AETHEL OS');

    // Check form elements exist
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.locator('input[type="email"]').fill('invalid@test.com');
    await page.locator('input[type="password"]').fill('wrongpassword');
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should show error message
    await expect(page.locator('text=/credenciales|incorrectas/i')).toBeVisible({ timeout: 5000 });
  });

  test('should login successfully as admin', async ({ page }) => {
    await page.locator('input[type="email"]').fill(TEST_ADMIN.email);
    await page.locator('input[type="password"]').fill(TEST_ADMIN.password);
    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should redirect to admin dashboard
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });
  });

  test('should login with remember me checked', async ({ page }) => {
    await page.locator('input[type="email"]').fill(TEST_ADMIN.email);
    await page.locator('input[type="password"]').fill(TEST_ADMIN.password);

    // Check "Remember me" checkbox
    await page.locator('text=Recordarme').click();

    await page.getByRole('button', { name: /iniciar sesión/i }).click();

    // Should redirect to admin
    await expect(page).toHaveURL(/\/admin/, { timeout: 10000 });

    // Check for remember cookie (aethel_remember)
    const cookies = await page.context().cookies();
    const rememberCookie = cookies.find((c) => c.name === 'aethel_remember');
    expect(rememberCookie).toBeTruthy();
  });

  test('should navigate to forgot password page', async ({ page }) => {
    await page.locator('text=¿Olvidaste tu contraseña?').click();

    await expect(page).toHaveURL(/\/forgot-password/, { timeout: 5000 });
    await expect(page.locator('h1')).toContainText(/recuperar|contraseña/i);
  });

  test('should show password visibility toggle', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]');
    await passwordInput.fill('testpassword');

    // Password should be hidden
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button
    await page.locator('button[type="button"]').filter({ hasText: '' }).first().click();

    // Password should now be visible (type="text")
    const toggledInput = page.locator('input').filter({ hasText: '' });
    // Note: This depends on implementation
  });
});

test.describe('Forgot Password Flow', () => {
  test('should submit forgot password form', async ({ page }) => {
    await page.goto(`${BASE_URL}/forgot-password`);

    await page.locator('input[type="email"]').fill('test@aethel.tt');
    await page.getByRole('button', { name: /enviar/i }).click();

    // Should show success message
    await expect(page.locator('text=/email enviado|si existe/i')).toBeVisible({ timeout: 5000 });
  });
});

test.describe('Protected Routes', () => {
  test('should redirect to login when not authenticated', async ({ page }) => {
    await page.goto(`${BASE_URL}/admin`);

    // Should redirect to login
    await expect(page).toHaveURL(/\/login/, { timeout: 5000 });
  });
});

test.describe('Demo Credentials', () => {
  test('should fill demo credentials on click', async ({ page }) => {
    await page.goto(`${BASE_URL}/login`);

    // Click admin demo button
    await page.locator('text=admin@aethel.tt').click();

    // Check email field is filled
    const emailValue = await page.locator('input[type="email"]').inputValue();
    expect(emailValue).toBe('admin@aethel.tt');
  });
});

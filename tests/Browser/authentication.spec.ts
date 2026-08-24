import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

async function logIn(page: Page) {
    await page.goto('/login');
    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();
    await expect(page).toHaveURL(/\/dashboard$/);
}

test('guest registration, login, dashboard, and logout work', async ({ page }) => {
    await page.goto('/login');

    await expect(
        page.getByRole('heading', { name: 'Log in to your account' }),
    ).toBeVisible();
    await page.getByRole('link', { name: 'Sign up' }).click();

    const registrationEmail = `browser-user-${Date.now()}@example.com`;

    await page.getByLabel('Name').fill('Browser User');
    await page.getByLabel('Email address').fill(registrationEmail);
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByLabel('Confirm password').fill('password');
    await page.getByRole('button', { name: 'Create account' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await expect(page.getByText('Dashboard', { exact: true }).first()).toBeVisible();

    await page.locator('[data-test="sidebar-menu-button"]').click();
    await page.getByRole('menuitem', { name: 'Log out' }).click();
    await expect(page).toHaveURL('/');
    await page.getByRole('link', { name: 'Log in' }).click();

    await page.getByLabel('Email address').fill('test@example.com');
    await page.getByLabel('Password', { exact: true }).fill('password');
    await page.getByRole('button', { name: 'Log in' }).click();

    await expect(page).toHaveURL(/\/dashboard$/);
});

test('authenticated layout remains usable on a mobile viewport', async ({
    page,
}) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await logIn(page);

    const sidebarTrigger = page.locator('[data-sidebar="trigger"]');
    await expect(sidebarTrigger).toBeVisible();
    await sidebarTrigger.click();
    await expect(page.getByText('Test User', { exact: true })).toBeVisible();
});

test('unknown routes return the framework not-found state', async ({ page }) => {
    const response = await page.goto('/this-route-does-not-exist');

    expect(response?.status()).toBe(404);
    await expect(page.getByText('Not Found', { exact: true })).toBeVisible();
});

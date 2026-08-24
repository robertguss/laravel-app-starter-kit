import { defineConfig, devices } from '@playwright/test';

const host = '127.0.0.1';
const port = 8000;
const baseURL = `http://${host}:${port}`;

export default defineConfig({
    testDir: './tests/Browser',
    fullyParallel: false,
    forbidOnly: Boolean(process.env.CI),
    retries: process.env.CI ? 1 : 0,
    workers: 1,
    reporter: process.env.CI ? 'line' : 'list',
    use: {
        ...devices['Desktop Chrome'],
        baseURL,
        screenshot: 'only-on-failure',
        trace: 'retain-on-failure',
    },
    webServer: {
        command:
            'php artisan migrate:fresh --force --seed && php artisan serve --host=127.0.0.1 --port=8000',
        env: {
            ...process.env,
            APP_DEBUG: 'false',
            APP_ENV: 'testing',
            APP_URL: baseURL,
            CACHE_STORE: 'array',
            DB_CONNECTION: 'pgsql',
            DB_DATABASE:
                process.env.PLAYWRIGHT_DB_DATABASE ??
                'laravel_app_starter_kit_browser',
            DB_HOST: process.env.DB_HOST ?? host,
            DB_PASSWORD: process.env.DB_PASSWORD ?? 'laravel',
            DB_PORT: process.env.DB_PORT ?? '5432',
            DB_USERNAME: process.env.DB_USERNAME ?? 'laravel',
            MAIL_MAILER: 'array',
            QUEUE_CONNECTION: 'sync',
            SESSION_DRIVER: 'database',
        },
        reuseExistingServer: false,
        timeout: 120_000,
        url: `${baseURL}/up`,
    },
});

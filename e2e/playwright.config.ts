import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 1,
  timeout: 120_000,
  expect: { timeout: 10_000 },
  use: {
    baseURL: 'http://localhost:4278',
    actionTimeout: 10_000,
    channel: 'chrome',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    viewport: { width: 1440, height: 1000 }
  },
  webServer: [
    {
      command: 'dotnet run --no-launch-profile --project ../Hopper.Api/Hopper.Api.csproj',
      url: 'http://localhost:15154/api/games/season/1',
      timeout: 120_000,
      reuseExistingServer: false,
      env: {
        ASPNETCORE_URLS: 'http://localhost:15154',
        ASPNETCORE_ENVIRONMENT: 'Development',
        ConnectionStrings__Default: 'Server=localhost,14365;Database=HopperE2e;User Id=sa;Password=HopperE2e-Only!2026;TrustServerCertificate=True'
      }
    },
    {
      command: 'npm --prefix ../Hopper.Client start -- --host localhost --port 4278 --configuration e2e',
      url: 'http://localhost:4278',
      timeout: 120_000,
      reuseExistingServer: false
    }
  ]
});

import { defineConfig, devices } from "@playwright/test";
import * as dotenv from 'dotenv';

dotenv.config(); 

const HOST = process.env.HOST || 'localhost';
const FRONTEND_PORT = process.env.VITE_PORT || 5173;
const API_PORT = process.env.API_PORT || 3000;

const FRONTEND_URL = `http://${HOST}:${FRONTEND_PORT}`;
const API_URL_CHECK = `http://${HOST}:${API_PORT}/todos`; 


export default defineConfig({
  testDir: "./tests/e2e",
  
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  
  webServer: [
    {
      command: 'npm run dev:api', 
      url: API_URL_CHECK,
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: 'npm run dev', 
      url: FRONTEND_URL, 
      timeout: 120 * 1000,
      reuseExistingServer: !process.env.CI,
    },
  ],

  use: {
    baseURL: FRONTEND_URL,
    trace: "on-first-retry",
  },
  
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
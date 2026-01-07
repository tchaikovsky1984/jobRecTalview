/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import tailwindcss from "@tailwindcss/vite";
import react from '@vitejs/plugin-react-swc';

// https://vite.dev/config/
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    projects: [
      // PROJECT 1: Storybook Interaction Tests (Existing)
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(dirname, '.storybook')
          })
        ],
        test: {
          name: 'storybook',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright({}),
            instances: [{ browser: 'chromium' }]
          },
          setupFiles: ['.storybook/vitest.setup.ts']
        }
      },

      // PROJECT 2: Functional / Unit Tests (NEW)
      // This runs your standard *.test.tsx files in JSDOM
      {
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          // Only look for .test files, ignore stories
          include: ['src/**/*.test.{ts,tsx}'],
          exclude: ['src/**/*.stories.{ts,tsx}', 'node_modules'],
          globals: true, // Optional: if you want to use 'describe' without importing
          setupFiles: ['./src/test/setup.ts'] // We need to create this
        }
      }
    ]
  }
});

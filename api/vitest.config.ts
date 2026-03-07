import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/app/controllers/*.ts', 'src/app/use-cases/*.ts'],
      exclude: ['src/tests/**', 'src/server.ts'],
    },

    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          dir: 'src/tests/use-cases',
        },
      },
      {
        extends: true,
        test: {
          name: 'e2e',
          dir: 'src/tests/controllers',
          environment: './prisma/vitest-environment-prisma',
          fileParallelism: false,
        },
      },
    ],
  },
})

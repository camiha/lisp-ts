import { defineConfig } from 'vitest/config';

export default defineConfig({
    define: {
        'import.meta.vitest': false,
    },
    test: {
        globals: true,
        passWithNoTests: true,
        includeSource: ['src/**/*.{js,ts}'],
    },
});

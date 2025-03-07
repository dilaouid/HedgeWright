import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        dts({
            include: ['src/**/*'],
            outDir: 'dist'
        })
    ],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.ts'),
            name: 'HedgeWrightCommon',
            formats: ['es', 'cjs'],
            fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`
        },
        sourcemap: true,
        outDir: 'dist'
    }
});
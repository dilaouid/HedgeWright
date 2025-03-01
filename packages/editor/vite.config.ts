import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import electron from 'vite-plugin-electron';
import { resolve } from 'path';

export default defineConfig({
    plugins: [
        react(),
        electron({
            entry: 'electron/main.ts',
        }),
    ],
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@common': resolve(__dirname, '../common/src'),
            '@domain': resolve(__dirname, 'src/domain'),
            '@app': resolve(__dirname, 'src/application'),
            '@infra': resolve(__dirname, 'src/infrastructure'),
            '@ui': resolve(__dirname, 'src/presentation'),
            '@utils': resolve(__dirname, 'src/utils')
        }
    }
});

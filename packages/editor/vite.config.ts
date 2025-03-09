import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
    plugins: [
        react({
            babel: {
                plugins: []
            }
        })
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
            '@components': path.resolve(__dirname, './src/presentation/components'),
            '@pages': path.resolve(__dirname, './src/presentation/pages'),
            '@layouts': path.resolve(__dirname, './src/presentation/layouts'),
            '@lib': path.resolve(__dirname, './src/lib'),
            '@styles': path.resolve(__dirname, './src/styles'),
            '@hedgewright/common': path.resolve(__dirname, '../common/src'),
            '@hedgewright/common/*': path.resolve(__dirname, '../common/src/*'),
            '@common': path.resolve(__dirname, '../common/src')
        }
    },
    server: {
        port: 5173,
        strictPort: true,
        host: true,
    },
    base: './',
    build: {
        outDir: 'dist',
        emptyOutDir: true,
        sourcemap: false,
        reportCompressedSize: false,
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    ui: [
                        '@radix-ui/react-accordion',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-tooltip',
                    ],
                },
            }
        }
    }
});
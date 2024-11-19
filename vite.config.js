import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  css: {
    modules: {
      generateScopedName: '[local]',
    },
  },
  build: {
    minify: true,
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, './index.html'),
      },
      output: {
        entryFileNames: 'romajs.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "main.css") {
            return "romajs.css"
          }
          return assetInfo.name
        }
      }
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.js$/,
    exclude: [],
  },
  publicDir: 'assets',
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }
});

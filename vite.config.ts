import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

export default () => {
  const SERVER_URL = process.env.SERVER_URL;
  if (!SERVER_URL) {
    throw new Error('No SEVER_URL is defined');
  }

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: `${SERVER_URL}/api`,
          rewrite: (path) => path.replace(/^\/api/, ''),
          changeOrigin: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    },
  });
};

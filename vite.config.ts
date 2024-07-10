import path from 'path';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';
import dotenv from 'dotenv';

dotenv.config({
  path: './.env',
});

export default () => {
  const SERVER_URL = process.env.SERVER_URL;
  const WS_SERVER_URL = process.env.WS_SERVER_URL;
  if (!WS_SERVER_URL) {
    throw new Error('No SEVER_URL is defined');
  }
  if (!SERVER_URL) {
    throw new Error('No WS_SERVER_URL is defined');
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
        '/api/v1/ws': {
          target: WS_SERVER_URL,
          changeOrigin: true,
          ws: true,
        },
      },
    },
  });
};

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { execSync } from 'child_process';
import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

// Custom plugin to ensure dist/ChronoFlow_Offline.html is generated after vite build
function renameOfflineHtmlPlugin() {
  return {
    name: 'rename-offline-html-plugin',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const indexPath = path.join(distDir, 'index.html');
      const offlinePath = path.join(distDir, 'ChronoFlow_Offline.html');
      if (fs.existsSync(indexPath)) {
        fs.copyFileSync(indexPath, offlinePath);
      }
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      viteSingleFile(),
      renameOfflineHtmlPlugin(),
      {
        name: 'download-offline-html-middleware',
        configureServer(server) {
          server.middlewares.use('/download-offline-html', async (req, res, next) => {
            if (req.method !== 'GET') {
              return next();
            }
            try {
              console.log('[Offline Build] Rebuilding app for single-file HTML export...');
              execSync('npx vite build', { stdio: 'inherit', cwd: __dirname });

              const distDir = path.resolve(__dirname, 'dist');
              const offlineHtmlPath = path.join(distDir, 'ChronoFlow_Offline.html');
              const indexHtmlPath = path.join(distDir, 'index.html');
              let targetPath = offlineHtmlPath;
              if (!fs.existsSync(targetPath) && fs.existsSync(indexHtmlPath)) {
                targetPath = indexHtmlPath;
              }

              if (fs.existsSync(targetPath)) {
                const stat = fs.statSync(targetPath);
                res.writeHead(200, {
                  'Content-Type': 'text/html; charset=utf-8',
                  'Content-Disposition': 'attachment; filename="ChronoFlow_Offline.html"',
                  'Content-Length': stat.size,
                });
                const stream = fs.createReadStream(targetPath);
                stream.pipe(res);
              } else {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Built file not found' }));
              }
            } catch (err: any) {
              console.error('[Offline Build Error]:', err);
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Failed to build singlefile HTML', details: String(err?.message || err) }));
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

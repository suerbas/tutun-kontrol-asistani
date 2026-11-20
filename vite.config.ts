import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Geliştirme sunucusunda /api/roleplay isteğini, Vercel'deki ile aynı işleyiciye yönlendirir.
const roleplayDevApi = (): Plugin => ({
    name: 'roleplay-dev-api',
    configureServer(server) {
        server.middlewares.use('/api/roleplay', async (req, res) => {
            try {
                const mod = await server.ssrLoadModule('/api/roleplay.ts');
                await mod.default(req, res);
            } catch (err) {
                console.error('[roleplay-dev-api]', err);
                if (!res.headersSent) {
                    res.statusCode = 500;
                    res.setHeader('Content-Type', 'application/json; charset=utf-8');
                    res.end(JSON.stringify({ error: 'Geliştirme sunucusunda hata oluştu.' }));
                }
            }
        });
    }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Sunucu tarafı işleyici process.env üzerinden okur; anahtarlar istemci koduna gömülmez.
    for (const key of ['OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'OPENROUTER_BASE_URL']) {
        if (env[key]) process.env[key] = env[key];
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), roleplayDevApi()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

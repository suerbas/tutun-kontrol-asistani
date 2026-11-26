import path from 'path';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// Geliştirme sunucusunda /api/* isteklerini, Vercel'deki ile aynı işleyicilere yönlendirir.
const DEV_API_ROUTES = ['roleplay', 'assistant'];

const devApi = (): Plugin => ({
    name: 'dev-api',
    configureServer(server) {
        for (const route of DEV_API_ROUTES) {
            server.middlewares.use(`/api/${route}`, async (req, res) => {
                try {
                    const mod = await server.ssrLoadModule(`/api/${route}.ts`);
                    await mod.default(req, res);
                } catch (err) {
                    console.error(`[dev-api:${route}]`, err);
                    if (!res.headersSent) {
                        res.statusCode = 500;
                        res.setHeader('Content-Type', 'application/json; charset=utf-8');
                        res.end(JSON.stringify({ error: 'Geliştirme sunucusunda hata oluştu.' }));
                    }
                }
            });
        }
    }
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    // Sunucu tarafı işleyici process.env üzerinden okur; anahtarlar istemci koduna gömülmez.
    for (const key of ['OPENROUTER_API_KEY', 'OPENROUTER_MODEL', 'OPENROUTER_BASE_URL', 'OPENROUTER_DATA_COLLECTION', 'OPENROUTER_REASONING', 'AI_DISABLED']) {
        if (env[key]) process.env[key] = env[key];
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), devApi()],
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});

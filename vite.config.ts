import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { parseBrainDump, getAIPlannerTop3, judgeEmergencyUnlock, getAICoachNudge, summarizeStudyMaterial } from './src/server/gemini';

function apiMiddlewarePlugin(): Plugin {
  return {
    name: 'api-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        const url = req.url;
        let body = '';

        req.on('data', chunk => {
          body += chunk.toString();
        });

        req.on('end', async () => {
          try {
            const parsedBody = body ? JSON.parse(body) : {};
            res.setHeader('Content-Type', 'application/json');

            if (url === '/api/brain-dump') {
              const result = await parseBrainDump(parsedBody.rawInput || '');
              return res.end(JSON.stringify(result));
            }

            if (url === '/api/planner') {
              const result = await getAIPlannerTop3(parsedBody.tasks || []);
              return res.end(JSON.stringify(result));
            }

            if (url === '/api/emergency-unlock') {
              const result = await judgeEmergencyUnlock(parsedBody.siteOrApp || '', parsedBody.reason || '');
              return res.end(JSON.stringify(result));
            }

            if (url === '/api/ai-coach') {
              const result = await getAICoachNudge(parsedBody.currentTask || '', parsedBody.minutesIdle || 20);
              return res.end(JSON.stringify({ nudge: result }));
            }

            if (url === '/api/study-summary') {
              const result = await summarizeStudyMaterial(parsedBody.material || '');
              return res.end(JSON.stringify(result));
            }

            res.statusCode = 404;
            return res.end(JSON.stringify({ error: 'Endpoint not found' }));
          } catch (err: any) {
            console.error("API error:", err);
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: err.message || 'Internal error' }));
          }
        });
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiMiddlewarePlugin()],
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

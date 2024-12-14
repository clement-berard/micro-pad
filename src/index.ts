import type { Server } from 'node:http';
import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { type WebSocket, WebSocketServer } from 'ws';
import { CONFIG } from './config.js';
import padRoutes from './routes/padRoutes.js';
import { PadManager } from './services/PadManager.js';
import { setupWebSocketHandlers } from './websocket/wsHandler.js';

const app = new Hono();
const padManager = new PadManager();

// Routes
app.use('/*', serveStatic({ root: './src/public' }));
app.route('/', padRoutes);

let server: Server;

async function startServer() {
  server = await new Promise((resolve) => {
    const server = serve({
      fetch: app.fetch,
      port: CONFIG.PORT,
    });
    resolve(server as Server);
  });

  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: WebSocket) => {
    setupWebSocketHandlers(ws, padManager);
  });

  console.log(`Server running on http://${CONFIG.HOST}:${CONFIG.PORT}`);
}

startServer().catch(console.error);

import type { WebSocket } from 'ws';
import type { PadManager } from '../services/PadManager.js';
import type { WSMessage } from '../types.js';

export function setupWebSocketHandlers(ws: WebSocket, padManager: PadManager): void {
  let currentPadId: string | null = null;

  ws.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString()) as WSMessage;

      switch (message.type) {
        case 'join':
          if (message.padId) {
            currentPadId = message.padId;
            padManager.joinPad(currentPadId, ws);
            const content = padManager.getPadContent(currentPadId);
            ws.send(JSON.stringify({ type: 'content', content }));
          }
          break;

        case 'update':
          if (currentPadId && message.content !== undefined) {
            padManager.updatePad(currentPadId, message.content, ws);
          }
          break;
      }
    } catch (error) {
      console.error('WebSocket message handling error:', error);
    }
  });

  ws.on('close', () => {
    if (currentPadId) {
      console.log(`WebSocket closed for pad ${currentPadId}`);
      padManager.leavePad(currentPadId, ws);
    }
  });
}

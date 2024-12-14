import type { WebSocket } from 'ws';
import type { Pad } from '../types.js';

export class PadManager {
  private pads: Map<string, Pad>;

  constructor() {
    this.pads = new Map();
  }

  private getPad(padId: string): Pad {
    let pad = this.pads.get(padId);
    if (!pad) {
      pad = { content: '', clients: new Set() };
      this.pads.set(padId, pad);
    }
    return pad;
  }

  joinPad(padId: string, client: WebSocket): void {
    const pad = this.getPad(padId);
    pad.clients.add(client);
  }

  leavePad(padId: string, client: WebSocket): void {
    const pad = this.pads.get(padId);
    if (pad) {
      pad.clients.delete(client);
      if (pad.clients.size === 0) {
        this.pads.delete(padId);
      }
    }
  }

  getPadContent(padId: string): string {
    return this.getPad(padId).content;
  }

  updatePad(padId: string, content: string, sender: WebSocket): void {
    const pad = this.getPad(padId);
    pad.content = content ?? '';

    const message = JSON.stringify({
      type: 'content',
      content: pad.content,
    });

    for (const client of pad.clients) {
      if (client !== sender) {
        try {
          client.send(message);
        } catch (error) {
          console.error('Failed to send to client:', error);
          this.leavePad(padId, client);
        }
      }
    }
  }
}

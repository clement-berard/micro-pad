import type { WebSocket } from 'ws';

export type Pad = {
  content: string;
  clients: Set<WebSocket>;
};

export type WSMessage = {
  type: 'join' | 'update';
  padId?: string;
  content?: string;
};

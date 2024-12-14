import crypto from 'node:crypto';
import { Hono } from 'hono';
import { html } from '../templates/editor.js';

const padRoutes = new Hono();

padRoutes.get('/', (c) => {
  const randomId = crypto.randomBytes(4).toString('hex');
  return c.redirect(`/${randomId}`);
});

padRoutes.get('/:padId', (c) => {
  const padId = c.req.param('padId');
  return c.html(html(padId));
});

export default padRoutes;

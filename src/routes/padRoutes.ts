import { Hono } from 'hono';
import { html } from '../templates/editor.js';

const padRoutes = new Hono();

padRoutes.get('/:padId', (c) => {
  return c.html(html);
});

export default padRoutes;

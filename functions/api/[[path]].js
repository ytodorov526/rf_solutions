import { Hono } from 'hono';
import { handle } from 'hono/cloudflare-pages';
import { cors } from 'hono/cors';
import contactRoutes from '../../server-lib/routes/contacts.js';
import productRoutes from '../../server-lib/routes/products.js';
import projectRoutes from '../../server-lib/routes/projects.js';
import roboAdvisorRoutes from '../../server-lib/routes/roboAdvisor.js';

const app = new Hono().basePath('/api');
app.use('*', cors());

// Mount routes
app.route('/contacts', contactRoutes);
app.route('/products', productRoutes);
app.route('/projects', projectRoutes);
app.route('/', roboAdvisorRoutes);

export const onRequest = handle(app);

import { Hono } from 'hono';
import { getAllProducts, getProductCategories, getProductById, createProduct, updateProduct, deleteProduct } from '../db/productsDb.js';

const app = new Hono();

// GET /api/products — List products (optionally filter by category/inStock)
app.get('/', async (c) => {
  const db = c.env.DB;
  const { category, inStock } = c.req.query();
  try {
    const products = await getAllProducts(db, { category, inStock });
    return c.json(products);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /api/products/categories — Unique categories
app.get('/categories', async (c) => {
  const db = c.env.DB;
  try {
    const categories = await getProductCategories(db);
    return c.json(categories);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /api/products/:id — Single product
app.get('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const product = await getProductById(db, id);
    if (!product) return c.json({ message: 'Product not found' }, 404);
    return c.json(product);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// POST /api/products — Create product
app.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  try {
    const saved = await createProduct(db, body);
    return c.json(saved, 201);
  } catch (err) {
    return c.json({ message: err.message }, 400);
  }
});

// PUT /api/products/:id — Update product
app.put('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json();
  try {
    const updated = await updateProduct(db, id, body);
    if (!updated) return c.json({ message: 'Product not found' }, 404);
    return c.json(updated);
  } catch (err) {
    return c.json({ message: err.message }, 400);
  }
});

// DELETE /api/products/:id — Delete product
app.delete('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const deleted = await deleteProduct(db, id);
    if (!deleted) return c.json({ message: 'Product not found' }, 404);
    return c.json({ message: 'Product deleted successfully' });
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

export default app;

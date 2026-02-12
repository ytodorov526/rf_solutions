import { Hono } from 'hono';
import { getAllProjects, getProjectCategories, getProjectById, createProject, updateProject, deleteProject } from '../db/projectsDb.js';

const app = new Hono();

// GET /api/projects — List projects (optionally filter by category/featured)
app.get('/', async (c) => {
  const db = c.env.DB;
  const { category, featured } = c.req.query();
  try {
    const projects = await getAllProjects(db, { category, featured });
    return c.json(projects);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /api/projects/categories — Unique categories
app.get('/categories', async (c) => {
  const db = c.env.DB;
  try {
    const categories = await getProjectCategories(db);
    return c.json(categories);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /api/projects/:id — Single project
app.get('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const project = await getProjectById(db, id);
    if (!project) return c.json({ message: 'Project not found' }, 404);
    return c.json(project);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// POST /api/projects — Create project
app.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();
  try {
    const saved = await createProject(db, body);
    return c.json(saved, 201);
  } catch (err) {
    return c.json({ message: err.message }, 400);
  }
});

// PUT /api/projects/:id — Update project
app.put('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json();
  try {
    const updated = await updateProject(db, id, body);
    if (!updated) return c.json({ message: 'Project not found' }, 404);
    return c.json(updated);
  } catch (err) {
    return c.json({ message: err.message }, 400);
  }
});

// DELETE /api/projects/:id — Delete project
app.delete('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const deleted = await deleteProject(db, id);
    if (!deleted) return c.json({ message: 'Project not found' }, 404);
    return c.json({ message: 'Project deleted successfully' });
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

export default app;

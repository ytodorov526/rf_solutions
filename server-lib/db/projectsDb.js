export async function getAllProjects(db, filters = {}) {
  let sql = 'SELECT * FROM projects';
  const conditions = [];
  const params = [];

  if (filters.category && filters.category !== 'all') {
    conditions.push('category = ?');
    params.push(filters.category);
  }
  if (filters.featured === 'true') {
    conditions.push('featured = 1');
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY created_at DESC';

  const stmt = params.length > 0
    ? db.prepare(sql).bind(...params)
    : db.prepare(sql);
  const { results } = await stmt.all();
  return results.map(deserializeProject);
}

export async function getProjectCategories(db) {
  const { results } = await db.prepare('SELECT DISTINCT category FROM projects ORDER BY category').all();
  return results.map(r => r.category);
}

export async function getProjectById(db, id) {
  const result = await db.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  return result ? deserializeProject(result) : null;
}

export async function createProject(db, project) {
  const { title, summary, description, image, technologies, category, results: projResults, featured } = project;
  const result = await db.prepare(
    'INSERT INTO projects (title, summary, description, image, technologies, category, results, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(
    title, summary, description, image || null,
    JSON.stringify(technologies || []),
    category,
    projResults || null,
    featured ? 1 : 0
  ).first();
  return deserializeProject(result);
}

export async function updateProject(db, id, updates) {
  const fields = [];
  const values = [];
  if (updates.title !== undefined) { fields.push('title = ?'); values.push(updates.title); }
  if (updates.summary !== undefined) { fields.push('summary = ?'); values.push(updates.summary); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.technologies !== undefined) { fields.push('technologies = ?'); values.push(JSON.stringify(updates.technologies)); }
  if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
  if (updates.results !== undefined) { fields.push('results = ?'); values.push(updates.results); }
  if (updates.featured !== undefined) { fields.push('featured = ?'); values.push(updates.featured ? 1 : 0); }
  if (fields.length === 0) return getProjectById(db, id);
  values.push(id);
  const result = await db.prepare(
    `UPDATE projects SET ${fields.join(', ')} WHERE id = ? RETURNING *`
  ).bind(...values).first();
  return result ? deserializeProject(result) : null;
}

export async function deleteProject(db, id) {
  const result = await db.prepare('DELETE FROM projects WHERE id = ? RETURNING id').bind(id).first();
  return !!result;
}

function deserializeProject(row) {
  return {
    id: row.id,
    title: row.title,
    summary: row.summary,
    description: row.description,
    image: row.image,
    technologies: JSON.parse(row.technologies || '[]'),
    category: row.category,
    results: row.results,
    featured: !!row.featured,
    createdAt: row.created_at,
  };
}

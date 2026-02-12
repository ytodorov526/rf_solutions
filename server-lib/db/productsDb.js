export async function getAllProducts(db, filters = {}) {
  let sql = 'SELECT * FROM products';
  const conditions = [];
  const params = [];

  if (filters.category && filters.category !== 'all') {
    conditions.push('category = ?');
    params.push(filters.category);
  }
  if (filters.inStock === 'true') {
    conditions.push('in_stock = 1');
  }
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY name';

  const stmt = params.length > 0
    ? db.prepare(sql).bind(...params)
    : db.prepare(sql);
  const { results } = await stmt.all();
  return results.map(deserializeProduct);
}

export async function getProductCategories(db) {
  const { results } = await db.prepare('SELECT DISTINCT category FROM products ORDER BY category').all();
  return results.map(r => r.category);
}

export async function getProductById(db, id) {
  const result = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first();
  return result ? deserializeProduct(result) : null;
}

export async function createProduct(db, product) {
  const { name, description, image, features, category, specifications, price, inStock } = product;
  const result = await db.prepare(
    'INSERT INTO products (name, description, image, features, category, specifications, price, in_stock) VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(
    name, description, image || null,
    JSON.stringify(features || []),
    category,
    JSON.stringify(specifications || {}),
    price || null,
    inStock !== false ? 1 : 0
  ).first();
  return deserializeProduct(result);
}

export async function updateProduct(db, id, updates) {
  const fields = [];
  const values = [];
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.description !== undefined) { fields.push('description = ?'); values.push(updates.description); }
  if (updates.image !== undefined) { fields.push('image = ?'); values.push(updates.image); }
  if (updates.features !== undefined) { fields.push('features = ?'); values.push(JSON.stringify(updates.features)); }
  if (updates.category !== undefined) { fields.push('category = ?'); values.push(updates.category); }
  if (updates.specifications !== undefined) { fields.push('specifications = ?'); values.push(JSON.stringify(updates.specifications)); }
  if (updates.price !== undefined) { fields.push('price = ?'); values.push(updates.price); }
  if (updates.inStock !== undefined) { fields.push('in_stock = ?'); values.push(updates.inStock ? 1 : 0); }
  if (fields.length === 0) return getProductById(db, id);
  values.push(id);
  const result = await db.prepare(
    `UPDATE products SET ${fields.join(', ')} WHERE id = ? RETURNING *`
  ).bind(...values).first();
  return result ? deserializeProduct(result) : null;
}

export async function deleteProduct(db, id) {
  const result = await db.prepare('DELETE FROM products WHERE id = ? RETURNING id').bind(id).first();
  return !!result;
}

function deserializeProduct(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    image: row.image,
    features: JSON.parse(row.features || '[]'),
    category: row.category,
    specifications: JSON.parse(row.specifications || '{}'),
    price: row.price,
    inStock: !!row.in_stock,
    createdAt: row.created_at,
  };
}

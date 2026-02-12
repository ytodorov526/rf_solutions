export async function getAllContacts(db) {
  const { results } = await db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
  return results.map(deserializeContact);
}

export async function getContactById(db, id) {
  const result = await db.prepare('SELECT * FROM contacts WHERE id = ?').bind(id).first();
  return result ? deserializeContact(result) : null;
}

export async function createContact(db, contact) {
  const { name, email, phone, company, inquiryType, message } = contact;
  const result = await db.prepare(
    'INSERT INTO contacts (name, email, phone, company, inquiry_type, message) VALUES (?, ?, ?, ?, ?, ?) RETURNING *'
  ).bind(name, email, phone || null, company || null, inquiryType || 'General Inquiry', message).first();
  return deserializeContact(result);
}

export async function updateContact(db, id, updates) {
  const fields = [];
  const values = [];
  if (updates.name !== undefined) { fields.push('name = ?'); values.push(updates.name); }
  if (updates.email !== undefined) { fields.push('email = ?'); values.push(updates.email); }
  if (updates.phone !== undefined) { fields.push('phone = ?'); values.push(updates.phone); }
  if (updates.company !== undefined) { fields.push('company = ?'); values.push(updates.company); }
  if (updates.inquiryType !== undefined) { fields.push('inquiry_type = ?'); values.push(updates.inquiryType); }
  if (updates.message !== undefined) { fields.push('message = ?'); values.push(updates.message); }
  if (updates.status !== undefined) { fields.push('status = ?'); values.push(updates.status); }
  if (fields.length === 0) return getContactById(db, id);
  values.push(id);
  const result = await db.prepare(
    `UPDATE contacts SET ${fields.join(', ')} WHERE id = ? RETURNING *`
  ).bind(...values).first();
  return result ? deserializeContact(result) : null;
}

export async function deleteContact(db, id) {
  const result = await db.prepare('DELETE FROM contacts WHERE id = ? RETURNING id').bind(id).first();
  return !!result;
}

function deserializeContact(row) {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    company: row.company,
    inquiryType: row.inquiry_type,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

import { Hono } from 'hono';
import { getAllContacts, getContactById, createContact, updateContact, deleteContact } from '../db/contactsDb.js';
import { sendContactConfirmation, sendAdminNotification } from '../services/emailService.js';

const app = new Hono();

// POST /api/contacts — Submit a new contact form
app.post('/', async (c) => {
  const db = c.env.DB;
  const body = await c.req.json();

  if (!body.email) {
    return c.json({ message: 'Email is required', success: false }, 400);
  }

  try {
    const saved = await createContact(db, body);

    // Fire-and-forget email notifications
    Promise.allSettled([
      sendContactConfirmation(saved, c.env),
      sendAdminNotification(saved, c.env),
    ]).catch(() => {});

    return c.json({ ...saved, message: 'Your contact request has been received. Thank you!', success: true }, 201);
  } catch (err) {
    return c.json({ message: 'Failed to process your request. Please try again later.', error: err.message, success: false }, 400);
  }
});

// GET /api/contacts — List all contacts
app.get('/', async (c) => {
  const db = c.env.DB;
  try {
    const contacts = await getAllContacts(db);
    return c.json(contacts);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// GET /api/contacts/:id — Get a specific contact
app.get('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const contact = await getContactById(db, id);
    if (!contact) return c.json({ message: 'Contact not found' }, 404);
    return c.json(contact);
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

// PUT /api/contacts/:id — Update contact
app.put('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  const body = await c.req.json();
  try {
    const updated = await updateContact(db, id, body);
    if (!updated) return c.json({ message: 'Contact not found' }, 404);
    return c.json(updated);
  } catch (err) {
    return c.json({ message: err.message }, 400);
  }
});

// DELETE /api/contacts/:id — Delete a contact
app.delete('/:id', async (c) => {
  const db = c.env.DB;
  const id = c.req.param('id');
  try {
    const deleted = await deleteContact(db, id);
    if (!deleted) return c.json({ message: 'Contact not found' }, 404);
    return c.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    return c.json({ message: err.message }, 500);
  }
});

export default app;

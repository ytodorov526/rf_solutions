const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

// @route   POST /api/contacts
// @desc    Submit a new contact form
// @access  Public
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    const { name, email, message } = req.body;
    
    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        success: false 
      });
    }
    
    // Create and save the contact
    const newContact = new Contact(req.body);
    const savedContact = await newContact.save();
    
    // Email sending - won't block the response
    Promise.allSettled([
      emailService.sendContactConfirmation(savedContact),
      emailService.sendAdminNotification(savedContact)
    ]).then(results => {
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.error(`Email ${index === 0 ? 'confirmation' : 'notification'} failed:`, result.reason);
        }
      });
    });
    
    // Respond to client immediately after saving to database
    // Don't wait for emails to complete
    res.status(201).json({
      ...savedContact.toJSON(),
      message: 'Your contact request has been received. Thank you!',
      success: true
    });
  } catch (err) {
    console.error('Error handling contact submission:', err);
    res.status(400).json({ 
      message: 'Failed to process your request. Please try again later.',
      error: err.message,
      success: false 
    });
  }
});

// @route   GET /api/contacts
// @desc    Get all contact submissions (would be protected in production)
// @access  Private (in a real app)
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   GET /api/contacts/:id
// @desc    Get a specific contact submission
// @access  Private
router.get('/:id', async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route   PUT /api/contacts/:id
// @desc    Update contact status
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json(updatedContact);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// @route   DELETE /api/contacts/:id
// @desc    Delete a contact
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    
    res.json({ message: 'Contact deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
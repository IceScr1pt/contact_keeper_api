const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const User = require('../models/User');
const Contact = require('../models/Contact');
const auth = require('../middleware/auth');
const { restart } = require('nodemon');

//@route   GET api/contacts
//@desc    Get all users contacts
//@access  Private
router.get('/', auth, async (req, res) => {
  try {
    /*get only the contacts of the specified user id from the req obj 
    if the auth middleware passed and sort it by the most recent contacts first
    */
    const contacts = await Contact.find({ user: req.user.id }).sort({
      date: -1,
    });
    res.json(contacts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route   POST api/contacts
//@desc    Add a new  contact
//@access  Private
router.post(
  '/',
  [auth, [check('name', 'Name is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, type } = req.body;

    try {
      const newContact = new Contact({
        name,
        email,
        phone,
        type,
        //to know which user added that contact
        user: req.user.id,
      });

      //create a new contact in the db
      const contact = await Contact.create(newContact);
      res.json(contact);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//@route   PUT api/contacts/:id
//@desc    Update contact
//@access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, email, phone, type } = req.body;

  //Build contact object based on which credntials the user wants to update
  const contactFields = {};
  if (name) contactFields.name = name;
  if (email) contactFields.email = email;
  if (phone) contactFields.phone = phone;
  if (type) contactFields.type = type;

  try {
    let contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    /*Make sure user owns contact by checking if the contact that been found
    has the same id as the req.user.id we get from auth
    */
    if (contact.user.toString() !== req.user.id) {
      console.log(contact.user.toString(), req.user.id);
      return res.status(401).json({ msg: 'Not authorized' });
    }
    contact = await Contact.findByIdAndUpdate(req.params.id, contactFields, {
      new: true,
    });
    // let contact = await Contact.findByIdAndUpdate({ _id: id }, contactFields);
    res.status(200).json(contact);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route   DELETE api/contacts/:id
//@desc    Delete contact
//@access  Private
router.delete('/:id', auth, async (req, res) => {
  //get the id of the contact document we want to delete
  const id = req.params.id;
  try {
    let contact = await Contact.findById(id);
    if (!contact) return res.status(404).json({ msg: 'Contact not found' });

    //Make sure user owns contact
    if (contact.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    await Contact.findByIdAndRemove(id);
    res.status(200).json({ msg: 'Contact removed' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;

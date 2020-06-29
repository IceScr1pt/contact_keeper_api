const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const jwtSecret = config.get('jwtSecret');
const { check, validationResult } = require('express-validator');
//bring protect middaleware
const auth = require('../middleware/auth');
const User = require('../models/User');

//@route  Get api/auth
//@desc   Get logged in user
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    //get the logged user data by search the db by his ID
    //if a user provide a valid token the req obj hold a user obj that has the id as the key
    const user = await User.findById(req.user.id).select('-password');
    console.log(req.user);
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route  POST api/auth
//@desc   Login, Auth user & get token
//@access Public
router.post(
  '/',
  [
    check('email', 'Please enter  a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      //check if there is a user regisered with the passed in email
      let user = await User.findOne({ email });

      if (!user) {
        return res.status(400).json({ msg: 'Invalid  Credentials' });
      }

      //check if passed in password is the same as the encrypted passwored in the db with bcrypt
      //comapre('password from user','password from db')
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ msg: 'Invalid  Credentials' });
      }

      //if email and password are ok we get a token
      const payload = {
        user: {
          id: user.id,
        },
      };

      //generate a jwt token with .sign(what to encrypt in jwt, jwtsecret, options)
      jwt.sign(
        payload,
        jwtSecret,
        {
          //object of options
          expiresIn: 360000,
        },
        (err, token) => {
          //check if there are any errors.
          if (err) throw err;
          res.json({ success: true, token });
        }
      );
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;

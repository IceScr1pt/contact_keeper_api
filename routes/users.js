const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
//get the jwt secret token from the defalt.json file
const jwtSecret = config.get('jwtSecret');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

//@route  POST api/users
//@desc  Register a user
//@access Public
router.post(
  '/',
  [
    //set the checks and create custom error msg for each case with express-validator
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    //check if there are any erros
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('errors', errors);
      //turn all the errors to an array
      return res.status(400).json({ errors: errors.array() });
    }

    //if there are no erros i get all data from req.body
    const { name, email, password } = req.body;
    try {
      // Finds the validation errors in this request and wraps them in an object with handy functions
      let user = await User.findOne({ email: email });
      if (user) {
        return res.status(400).json({ msg: 'User already exists' });
      }

      //create a user obj
      user = new User({
        name,
        email,
        password,
      });

      //get a salt to secure the possword
      const salt = await bcrypt.genSalt(10);
      //hash the password in the user obj
      user.password = await bcrypt.hash(password, salt);

      //save the new created user to the db
      await user.save();

      //what we want to encrypt in the jsonwebtoken
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
      res.status(500).send('Server error');
    }
  }
);

module.exports = router;

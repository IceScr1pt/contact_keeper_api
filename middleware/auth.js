const jwt = require('jsonwebtoken');
const config = require('config');

//Auth middleware to verify the token the user got after login/registeration to access to protected routes
module.exports = function (req, res, next) {
  //Get token from header by checking if there is a token in the header
  const token = req.header('x-auth-token');

  //Check if there is not token in the header
  if (!token) {
    return res.status(401).json({ msg: 'No token, authrization denied' });
  }

  //if there is a token in the header we decode the token to get the user id
  try {
    //decode the jwt and get the user id
    const decoded = jwt.verify(token, config.get('jwtSecret'));

    console.log(decoded);
    //extract the user obj from the decoded object
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

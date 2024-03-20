require('dotenv').config();
const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = process.env.JWT_SECRET;
const expiration = '2h';
//const jwtSecret = 'mysecretshhhhh'; // just hardcoding to see if everything else works. 

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {          // changed from: function authMiddleware(req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization || ''; // changed from: let token = req.body.token || req.headers.authorization; 
    console.log(`token before processing:  , ${token}`);
    
    ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }
    console.log(`token after processing:  , ${token}`);
    if (!token) {
    return { user: null }                         //throw new Error('You have no token!' );
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret);  //, { maxAge: expiration }
      console.log('payload from token: ', data);
      return { user: data }                //req.user = data;
    } catch {
      console.log('Invalid token');
      return { user: null }                //throw new Error('invalid token!');
    }

    // send to next endpoint
    // changed from: next();
   return req;
  },
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    const token = jwt.sign({ data: payload }, secret, { expiresIn: expiration });
    console.log('token created: ', token);

return token;
  },
};

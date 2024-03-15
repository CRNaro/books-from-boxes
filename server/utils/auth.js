const jwt = require('jsonwebtoken');

// set token secret and expiration date
const secret = 'mysecretsshhhhh';
const expiration = '2h';

module.exports = {
  // function for our authenticated routes
  authMiddleware: function ({ req }) {          // changed from: function authMiddleware(req, res, next) {
    // allows token to be sent via  req.query or headers
    let token = req.headers.authorization || ''; // changed from: let token = req.body.token || req.headers.authorization; 

    // ["Bearer", "<tokenvalue>"]
    if (req.headers.authorization) {
      token = token.split(' ').pop().trim();
    }

    if (!token) {
    return { user: null }                         //throw new Error('You have no token!' );
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
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

    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};

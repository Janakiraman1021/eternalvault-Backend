const jwt = require('jsonwebtoken');
require('dotenv').config(); // Ensure .env variables are accessible

// Middleware to authenticate JWT tokens
const authenticate = (req, res, next) => {
  const token = req.header('Authorization'); // Expecting token in the Authorization header

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to request object
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    res.status(400).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticate;

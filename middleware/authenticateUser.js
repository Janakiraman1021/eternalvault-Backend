const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Extract Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify JWT
    req.user = decoded; // Attach user payload to the request
    next();
  } catch (error) {
    console.error('JWT Error:', error.message);
    res.status(401).json({ message: 'Invalid token.' });
  }
};

module.exports = authenticateUser;

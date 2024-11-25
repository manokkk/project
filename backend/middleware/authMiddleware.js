const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get the token from the Authorization header
  const token = req.headers.authorization?.split(' ')[1];  // "Bearer <token>"

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Ensure JWT_SECRET exists in environment variables
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not defined in the environment variables!');
      return res.status(500).json({ message: 'Server configuration error' });
    }

    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;  // Attach decoded user data to the request object

    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    // Log the error for debugging and send an unauthorized response
    console.error('Token verification failed:', error.message);
    return res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = { authMiddleware };

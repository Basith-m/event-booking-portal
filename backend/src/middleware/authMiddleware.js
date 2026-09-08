import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes: verify JWT token from Authorization header
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'fallback_secret_for_dev_only'
      );

      // Attach user object to request (excluding password)
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        res.status(401);
        throw new Error('User belonging to this token no longer exists');
      }

      return next();
    } catch (error) {
      res.status(401);
      return next(new Error('Not authorized, token verification failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no bearer token provided'));
  }
};

// Restrict access to specific roles ('ORGANIZER', 'CUSTOMER')
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(
        new Error(`Role [${req.user ? req.user.role : 'Guest'}] is not authorized to access this route`)
      );
    }
    next();
  };
};
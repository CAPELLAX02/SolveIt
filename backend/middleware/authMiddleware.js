import jwt from 'jsonwebtoken';
import asyncHandler from './asyncHandler.js';
import User from '../models/userModel.js';

/**
 * Middleware to protect routes and ensure user is authenticated.
 * Verifies JWT from the Authorization header and attaches user to request object.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // HTTP-Only Cookie'den token kontrolü
  if (req.cookies && req.cookies['adminToken']) {
    token = req.cookies['adminToken'];
  }
  // Authorization header üzerinden token kontrolü
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }

  try {
    // Token'ı doğrulama
    const decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);

    // Kullanıcıyı bul ve şifre hariç bilgileri request objesine ekle
    req.user = await User.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * Middleware to check if the authenticated user is an admin.
 * Blocks access if the user is not an admin.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {Function} next - The next middleware function.
 */
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized as an admin');
  }
};

export { protect, admin };

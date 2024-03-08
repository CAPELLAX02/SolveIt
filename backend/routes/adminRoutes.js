import express from 'express';
import {
  authAdminUser,
  logoutAdminUser,
  getAllUsers,
  getUserById,
  deleteUser,
  banUser,
  unbanUser,
  getAllIssues,
  solveIssue,
  unsolveIssue,
  deleteIssue,
  getAdminProfile,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication Routes for Admin Users
router.post('/auth', authAdminUser);
router.post('/logout', logoutAdminUser);
router.get('/profile', protect, admin, getAdminProfile);

// User Routes for Admin Users
router.get('/users', protect, admin, getAllUsers);
router.get('/users/:id', protect, admin, getUserById);
router.delete('/users/:id', protect, admin, deleteUser);
router.put('/users/:id/ban', protect, admin, banUser);
router.put('/users/:id/unban', protect, admin, unbanUser);

// Issue Routes for Admin Users
router.get('/issues', protect, admin, getAllIssues);
router.post('/issues/:id/solve', protect, admin, solveIssue);
router.post('/issues/:id/unsolve', protect, admin, unsolveIssue);
router.delete('/issues/:id', protect, admin, deleteIssue);

export default router;

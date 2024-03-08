import express from 'express';
import {
  // getAllIssues,
  getIssueById,
  createIssue,
  // deleteIssue,
  getMyIssues,
  // solveIssue,
  // unsolveIssue,
} from '../controllers/issueController.js';
import { protect } from '../middleware/authMiddleware.js';

// Initialize the router
const router = express.Router();

router
  .route('/')
  // .get(getAllIssues) // for admin users
  .post(protect, createIssue); // for authenticated users

router.route('/myissues').get(protect, getMyIssues); // for authenticated users

router.route('/:id').get(protect, getIssueById); // for authenticated users
// .delete(deleteIssue); // for admin users

// router.post('/:id/solve', solveIssue); // for admin users

// router.post('/:id/unsolve', unsolveIssue); // for admin users

export default router;

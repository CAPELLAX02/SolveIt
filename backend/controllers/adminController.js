import asyncHandler from '../middleware/asyncHandler.js';
import User from '../models/userModel.js';
import Issue from '../models/issueModel.js';
import { generateAdminToken } from '../utils/generateAdminToken.js';

/**
 * @desc    Auth admin user & get token
 * @route   POST /api/admin/auth
 * @access  Public
 */
const authAdminUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const adminUser = await User.findOne({ email }).select('+password');

  if (adminUser && (await adminUser.matchPassword(password))) {
    if (adminUser.isAdmin) {
      const { adminToken, cookieOptions } = generateAdminToken(adminUser._id);

      res.cookie('adminToken', adminToken, cookieOptions);

      res.status(200).json({
        adminToken,
        _id: adminUser._id,
        name: adminUser.name,
        surname: adminUser.surname,
        email: adminUser.email,
        phone: adminUser.phone,
        isAdmin: adminUser.isAdmin,
      });
    } else {
      res.status(403).json({
        message: 'Access denied. Admins only.',
      });
    }
  } else {
    res.status(401).json({
      message: 'Invalid email or password.',
    });
  }
});

/**
 * @desc    Logout admin user & clear cookie
 * @route   POST /api/admin/logout
 * @access  Public
 */
const logoutAdminUser = asyncHandler(async (req, res) => {
  res.clearCookie('adminToken');
  res.status(200).json({
    message: 'Admin başarıyla çıkış yaptı.',
  });
});

/**
 * @desc    Get admin's profile
 * @route   GET /api/admin/profile
 * @access  Private/Admin
 */
const getAdminProfile = asyncHandler(async (req, res) => {
  const adminUserId = req.user._id;

  const adminUser = await User.findById(adminUserId).select('-password');

  if (adminUser) {
    res.json({
      id: adminUser._id,
      name: adminUser.name,
      email: adminUser.email,
      isAdmin: adminUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error('Admin user not found.');
  }
});

/**
 * @desc    Get all issues
 * @route   GET /api/admin/issues
 * @access  Private/Admin
 */
const getAllIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({});
  res.json(issues);
});

/**
 * @desc    Get all users
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.json(users);
});

/**
 * @desc    Get user by ID
 * @route   GET /api/admin/users/:id
 * @access  Private/Admin
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Delete user
 * @route   DELETE /api/admin/users/:id
 * @access  Private/Admin
 */
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({
      message: 'User deleted.',
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Ban user
 * @route   PUT /api/admin/users/:id/ban
 * @access  Private/Admin
 */
const banUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isBanned = true;
    await user.save();
    res.json({
      message: 'User has been banned.',
      user,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Unban user
 * @route   PUT /api/admin/users/:id/unban
 * @access  Private/Admin
 */
const unbanUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.isBanned = false;
    await user.save();
    res.json({
      message: 'User has been unbanned.',
      user,
    });
  } else {
    res.status(404);
    throw new Error('User not found.');
  }
});

/**
 * @desc    Mark issue as solved
 * @route   POST /api/admin/issues/:id
 * @access  Private/Admin
 */
const solveIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    issue.status = 'solved';
    await issue.save();
    res.json({
      message: 'Issue marked as solved.',
      issue,
    });
  } else {
    res.status(404);
    throw new Error('Issue not found.');
  }
});

/**
 * @desc    Mark issue as unsolved
 * @route   POST /api/admin/issues/:id
 * @access  Private/Admin
 */
const unsolveIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    issue.status = 'unsolved';
    await issue.save();
    res.json({
      message: 'Issue marked as unsolved.',
      issue,
    });
  } else {
    res.status(404);
    throw new Error('Issue not found.');
  }
});

/**
 * @desc    Delete issue
 * @route   DELETE /api/admin/issues/:id
 * @access  Private/Admin
 */
const deleteIssue = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id);

  if (issue) {
    await issue.deleteOne();
    res.json({
      message: 'Issue has been deleted.',
    });
  } else {
    res.json(404);
    throw new Error('Issue not found.');
  }
});

export {
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
};

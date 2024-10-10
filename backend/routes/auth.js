// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/github', authController.githubAuth);
router.get('/github/callback', authController.githubCallback);
router.get('/status', authController.authStatus);

module.exports = router;

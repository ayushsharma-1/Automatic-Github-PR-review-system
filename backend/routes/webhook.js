// backend/routes/webhook.js

const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');

router.post('/github', webhookController.handleWebhook);

module.exports = router;

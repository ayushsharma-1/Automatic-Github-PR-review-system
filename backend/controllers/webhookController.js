// backend/controllers/webhookController.js

const crypto = require('crypto');
const aiService = require('../services/aiService');
const githubService = require('../services/githubService');
const User = require('../models/User');

exports.handleWebhook = async (req, res) => {
    const signature = req.headers['x-hub-signature-256'];
    const event = req.headers['x-github-event'];
    const payload = req.body;

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
    const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');

    if (signature !== digest) {
        return res.status(401).send('🔒 Invalid signature');
    }

    if (event === 'pull_request' && payload.action === 'opened') {
        const pr = payload.pull_request;
        const repo = payload.repository;
        const owner = repo.owner.login;
        const repoName = repo.name;
        const prNumber = pr.number;

        try {
            // Find user by GitHub ID
            const user = await User.findOne({ githubId: pr.user.id });
            if (!user) {
                throw new Error('🛑 User not found');
            }

            const prData = {
                title: pr.title,
                body: pr.body,
                head: pr.head,
                base: pr.base,
                url: pr.url,
                html_url: pr.html_url,
                user: pr.user,
            };

            // Generate AI review
            const review = await aiService.generateReview(prData);

            // Post comment on PR
            await githubService.postPRComment(user.accessToken, owner, repoName, prNumber, review);

            res.status(200).send('✅ PR reviewed and comment posted');
        } catch (error) {
            console.error('❌ Webhook Processing Error:', error);
            res.status(500).send('🛑 Error processing PR');
        }
    } else {
        res.status(200).send('ℹ️ Event ignored');
    }
};

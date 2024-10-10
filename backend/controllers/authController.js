const axios = require('axios');
const User = require('../models/User');
const githubService = require('../services/githubService');

exports.githubAuth = (req, res) => {
    const redirect_uri = `${process.env.BACKEND_URL}/auth/github/callback`;
    const redirect_uri2 = `${process.env.BACKEND_URL}/github/callback`;
    res.redirect(`https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${redirect_uri}&scope=repo`);
};

exports.githubCallback = async (req, res) => {
    const code = req.query.code;
    const redirect_uri = `${process.env.BACKEND_URL}/auth/github/callback`;

    try {
        // Exchange code for access token
        const tokenResponse = await axios.post(
            'https://github.com/login/oauth/access_token',
            {
                client_id: process.env.GITHUB_CLIENT_ID,
                client_secret: process.env.GITHUB_CLIENT_SECRET,
                code,
                redirect_uri,
            },
            {
                headers: {
                    accept: 'application/json',
                },
            }
        );

        const accessToken = tokenResponse.data.access_token;

        // Get user information
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${accessToken}`,
            },
        });

        const { id, login } = userResponse.data;

        // Upsert user in the database
        const user = await User.findOneAndUpdate(
            { githubId: id },
            { username: login, accessToken },
            { upsert: true, new: true }
        );

        // Register webhooks for the user's repositories
        await githubService.registerWebhooks(accessToken);

        // Redirect to frontend with token (for simplicity)
        res.redirect(`${process.env.FRONTEND_URL}?token=${accessToken}`);
    } catch (error) {
        console.error('❌ GitHub OAuth Callback Error:', error);
        res.status(500).send('Authentication failed');
    }
};

exports.authStatus = async (req, res) => {
    // For simplicity, assuming token is sent via query parameters
    const token = req.query.token;

    if (!token) {
        return res.json({ isAuthenticated: false });
    }

    try {
        // Verify token by fetching user info
        const userResponse = await axios.get('https://api.github.com/user', {
            headers: {
                Authorization: `token ${token}`,
            },
        });

        const { id, login } = userResponse.data;

        // Find user in the database
        const user = await User.findOne({ githubId: id });

        if (user && user.accessToken === token) {
            return res.json({ isAuthenticated: true, user: { username: login } });
        } else {
            return res.json({ isAuthenticated: false });
        }
    } catch (error) {
        console.error('❌ Authentication Status Error:', error);
        res.json({ isAuthenticated: false });
    }
};

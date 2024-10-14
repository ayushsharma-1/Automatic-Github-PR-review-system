# **Automatic GitHub PR Review System Backend**

## **Overview**

This project creates an automatic pull request (PR) review system using GitHub OAuth for authentication, an AI model for generating PR comments, and webhooks to manage PR events.

## **Project Structure**

```
automatic-github-pr-review/
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ConnectGitHub.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── App.css
│   ├── .env
│   ├── package.json
│   └── README.md
├── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   └── webhookController.js
│   ├── models/
│   │   └── User.js
│   ├── routes/
│   │   ├── auth.js
│   │   └── webhook.js
│   ├── services/
│   │   ├── aiService.js
│   │   └── githubService.js
│   ├── .env
│   ├── server.js
│   ├── package.json
│   └── README.md
└── README.md
```

## **Setup Instructions**

### **1. Clone the repository**

```bash
git clone <repository_url>
cd automatic-github-pr-review
```

### **2. Frontend Setup**

Navigate to the `frontend` directory:

```bash
cd frontend
npm install
```

### **3. Backend Setup**

Navigate back to the root directory and then into the `backend`:

```bash
cd ..
cd backend
npm install
```

### **4. MongoDB Setup**

1. Create an account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Set up a free cluster and get the **MongoDB URI**.

Your connection string should look like this:

```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
```

Replace `<username>`, `<password>`, and `<database_name>` with your specific details.

### **5. GitHub OAuth Setup**

To enable GitHub OAuth, follow these steps:

1. **Go to GitHub Developer Settings**:
   - Visit [GitHub Developer Settings](https://github.com/settings/developers).
   
2. **Register a new OAuth application**:
   - **Application name**: Choose a name for your app.
   - **Homepage URL**: Set this to your frontend URL for local development: `http://localhost:3000`.
   - **Authorization callback URL**: This must point to your backend GitHub callback endpoint, e.g., `http://localhost:5000/auth/github/callback`.

3. **Copy the `Client ID` and `Client Secret`**:
   - After creating the OAuth application, GitHub will provide you with a `Client ID` and `Client Secret`.
   - These will be used to authenticate users and should be stored in your `.env` file.

### **6. AI Model API Key Setup**

If you are using an AI model (e.g., OpenAI's GPT) for the review comments:

1. Visit the API provider's website (e.g., [OpenAI](https://beta.openai.com/signup/)).
2. Create an account and obtain an **API key**.
3. Store this key in your backend's `.env` file under the `AI_MODEL_API_KEY` variable.

### **7. Configure `.env` Files**

#### Frontend `.env`:

```env
REACT_APP_BACKEND_URL=http://localhost:5000
```

#### Backend `.env`:

Create a `.env` file in the `backend` directory with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GITHUB_WEBHOOK_SECRET=your_webhook_secret
FRONTEND_URL=http://localhost:3000
AI_MODEL_API_KEY=your_ai_model_api_key
BACKEND_URL=http://localhost:5000
```

**Explanation of Environment Variables:**
- `MONGO_URI`: The connection string to your MongoDB database.
- `GITHUB_CLIENT_ID` & `GITHUB_CLIENT_SECRET`: These values are obtained from the GitHub OAuth application you created earlier.
- `GITHUB_WEBHOOK_SECRET`: A secret key to secure the webhooks from GitHub.
- `AI_MODEL_API_KEY`: The API key for your AI service (e.g., OpenAI).
- `FRONTEND_URL`: The URL where your frontend is hosted (for local dev, `http://localhost:3000`).
- `BACKEND_URL`: The URL where your backend is hosted (for local dev, `http://localhost:5000`).

### **8. Start the Backend**

Navigate to the `backend` directory and run the following command to start the backend server:

```bash
npm start
```

### **9. Start the Frontend**

Navigate to the `frontend` directory and start the frontend server:

```bash
npm start
```

### **10. Exposing Localhost for Webhooks (Optional)**

For local development, GitHub must be able to reach your backend via the internet to trigger webhooks. You can use `ngrok` to expose your localhost:

```bash
ngrok http 5000
```

Copy the public URL provided by `ngrok` and use it to configure your GitHub webhook URL (e.g., `https://<ngrok_url>/webhook/github`).

---

## **Testing the Application**

### **1. Connecting GitHub Account**

1. Open the frontend at `http://localhost:3000`.
2. Click the "Connect with GitHub" button.
3. Authorize the app when redirected to GitHub.

### **2. Creating a Pull Request**

1. Create a new Pull Request in one of your GitHub repositories.
2. The GitHub webhook will trigger, and the backend will process the PR.
3. The AI model will generate a comment and post it to the PR.

### **3. Verifying Functionality**

- **Check GitHub PR:** Ensure the AI-generated review comment appears on the pull request.
- **Backend Logs:** Ensure that the webhook event is being received and processed.

---

## **API Endpoints**

### **Authentication:**
- `GET /auth/github`: Initiates the GitHub OAuth flow.
- `GET /auth/github/callback`: Handles the OAuth callback from GitHub.
- `GET /auth/status`: Checks the authentication status.

### **Webhook Handling:**
- `POST /webhook/github`: Receives and processes GitHub webhook events.

---

## **Security Considerations**

- **Token Storage**: Ensure GitHub access tokens are encrypted and stored securely in your database.
- **HTTPS**: Always use HTTPS for production environments to secure communications.
- **Environment Variables**: Never commit sensitive information (e.g., tokens, API keys) to version control. Use environment variables.

---

## **Additional Enhancements**

### **1. Scalability**

- **Webhook Management**: Ensure that webhook events are managed efficiently to avoid duplicated events.
- **Rate Limiting**: Implement mechanisms to handle API rate limits from both GitHub and AI services.

### **2. Error Handling**

- Implement proper logging and error handling to debug and resolve any issues efficiently.

### **3. Deployment**

- **Backend Hosting**: Deploy the backend on services like Heroku, AWS, or DigitalOcean.
- **Frontend Hosting**: Host the React app on platforms like Netlify or Vercel.
- **Database Hosting**: Use a cloud-hosted MongoDB instance (e.g., MongoDB Atlas).

---

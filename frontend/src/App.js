// frontend/src/App.js

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ConnectGitHub from './components/ConnectGitHub';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check if the user is authenticated
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/auth/status`, { withCredentials: true })
            .then(response => {
                if (response.data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUser(response.data.user);
                }
            })
            .catch(error => {
                console.error('Authentication check failed:', error);
            });
    }, []);

    return (
        <div className="App">
            {isAuthenticated ? (
                <div className="auth-container">
                    <h1>Welcome, {user.username}!</h1>
                    <p>Your GitHub account is connected.</p>
                </div>
            ) : (
                <ConnectGitHub />
            )}
        </div>
    );
}

export default App;

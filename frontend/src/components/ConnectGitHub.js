import React from 'react';

const ConnectGitHub = () => {
    const handleConnect = () => {
        window.location.href = `${process.env.REACT_APP_BACKEND_URL}/auth/github`;
    };

    return (
        <div className="connect-github">
            <h2>Automatic GitHub PR Review System</h2>
            <button onClick={handleConnect}>Connect with GitHub</button>
        </div>
    );
};

export default ConnectGitHub;

import React from 'react';

function LoadingAnimation() {
    return (
        <div className="loading-container" id="loading-container">
            <div className="scanner">
                <div className="scanner-logo">📑</div>
                <div className="scan-line"></div>
            </div>
            <h3 className="processing-text">
                Processing your bills<span className="processing-dots"></span>
            </h3>
            <p className="processing-subtext">This might take a moment</p>
            <div className="progress-container">
                <div className="progress-bar"></div>
            </div>
        </div>
    );
}

export default LoadingAnimation;
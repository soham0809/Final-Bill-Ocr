import React, { useState, useRef } from 'react';

function UploadForm({ onUpload }) {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const uploadAreaRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        if (selectedFiles.length > 0) {
            setFiles(selectedFiles);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        uploadAreaRef.current.style.borderColor = "var(--primary)";
        uploadAreaRef.current.style.backgroundColor = "rgba(67, 97, 238, 0.05)";
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        uploadAreaRef.current.style.borderColor = "var(--border)";
        uploadAreaRef.current.style.backgroundColor = "#fafbfc";
    };

    const handleDrop = (e) => {
        e.preventDefault();
        uploadAreaRef.current.style.borderColor = "var(--border)";
        uploadAreaRef.current.style.backgroundColor = "#fafbfc";

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            setFiles(droppedFiles);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files.length > 0) {
            onUpload(files);
            setFiles([]);
            fileInputRef.current.value = '';
        }
    };

    const handleUploadAreaClick = () => {
        fileInputRef.current.click();
    };

    return (
        <form onSubmit={handleSubmit} id="upload-form">
            <div className="card">
                <h2 className="card-title">
                    <span><span className="card-title-icon">📤</span> Upload Bills</span>
                </h2>
                <div
                    className="upload-area"
                    ref={uploadAreaRef}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={handleUploadAreaClick}
                >
                    <div className="upload-icon">📄</div>
                    <p className="upload-text">
                        Drag & drop your bill images here or click to browse
                    </p>
                    <p className="upload-hint">
                        Select multiple files to process them in batch
                    </p>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="file-input"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                {files.length > 0 && (
                    <div className="file-name-container" style={{ display: 'block' }}>
                        <ul className="file-name-list">
                            {files.map((file, index) => (
                                <li key={index} className="file-name-item">
                                    <span className="file-icon">📄</span>
                                    {file.name}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <button
                    type="submit"
                    className="submit-btn"
                    disabled={files.length === 0}
                >
                    Process Bills
                </button>
            </div>
        </form>
    );
}

export default UploadForm;
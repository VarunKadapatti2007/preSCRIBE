const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'OK', 
        message: 'App is running',
        timestamp: new Date().toISOString() 
    });
});

// API endpoint for logging (optional - for future enhancements)
app.post('/api/log', (req, res) => {
    const { level, message, timestamp } = req.body;
    console.log(`[${timestamp}] ${level}: ${message}`);
    res.json({ status: 'logged' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.stack);
    res.status(500).json({ 
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        message: 'The requested resource was not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`

         Medical Transcription & Prescription System     
                                                        
  Server running on: http://localhost:${PORT}        
  Check server status: http://localhost:${PORT}/health                                                                             ║
  Press Ctrl+C to stop the server                       

    `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('\nSIGINT received. Shutting down...');
    process.exit(0);
});
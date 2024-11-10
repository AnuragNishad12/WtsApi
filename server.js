const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = 9001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for OTPs (use a database in production)
let otps = [];

// Store WebSocket clients
const clients = new Map();

// WebSocket connection handler
wss.on('connection', (ws) => {
    const clientId = Math.random().toString(36).substr(7);
    clients.set(clientId, ws);
    
    console.log(`Client connected: ${clientId}`);

    // Send connection confirmation
    ws.send(JSON.stringify({
        type: 'connection',
        message: 'Connected to OTP WebSocket server',
        clientId
    }));

    ws.on('close', () => {
        clients.delete(clientId);
        console.log(`Client disconnected: ${clientId}`);
    });

    ws.on('error', (error) => {
        console.error(`WebSocket error for client ${clientId}:`, error);
    });
});

// Function to broadcast OTP updates to all connected clients
const broadcastOTPUpdate = (otp) => {
    const message = JSON.stringify({
        type: 'newOTP',
        data: otp,
        timestamp: new Date()
    });

    clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
};

// API to receive OTP
app.post('/api/otpData', (req, res) => {
    const { otp, timestamp } = req.body;
    if (otp && timestamp) {
        const newOTP = { otp, timestamp };
        otps.push(newOTP);
        
        // Broadcast the new OTP to all connected clients
        broadcastOTPUpdate(newOTP);
        
        res.status(201).send({ message: 'OTP added successfully' });
    } else {
        res.status(400).send({ message: 'Invalid data' });
    }
});

// API to retrieve OTP data
app.get('/api/Fetchotps', (req, res) => {
    res.status(200).json(otps);
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'healthy',
        connections: clients.size,
        otpsStored: otps.length
    });
});

// Use server.listen instead of app.listen for WebSocket support
server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


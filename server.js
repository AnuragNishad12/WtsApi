const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 9001;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// In-memory storage for OTPs (use a database in production)
let otps = [];

// API to receive OTP data
app.post('/api/otpData', (req, res) => {
    const { otp, timestamp } = req.body;
    if (otp && timestamp) {
        otps.push({ otp, timestamp });
        res.status(201).send({ message: 'OTP added successfully' });
    } else {
        res.status(400).send({ message: 'Invalid data' });
    }
});

// API to retrieve OTP data
app.get('/api/Fetchotps', (req, res) => {
    res.status(200).json(otps);
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});


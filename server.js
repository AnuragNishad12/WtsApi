const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'anuktsksanurag@gmail.com',
        pass: 'uuwb hpug caoj zbln', 
    }
});

app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;
    try {
        await transporter.sendMail({
            from: email,
            to: 'anuktsksanurag@gmail.com',
            subject: 'New Contact Form Submission',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
        });
        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.listen(4000, () => console.log('Server running on port 5000'));

// Load environment variables from .env file
require('dotenv').config();

const express = require('express');
const sgMail = require('@sendgrid/mail');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors()); // Allow requests from any origin (you can configure this for production)
app.use(express.json()); // To parse JSON request bodies

// Set the SendGrid API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Define the route for form submission
app.post('/send-email', (req, res) => {
    // Destructure the form data from the request body
    const { name, contact, email, message, projects } = req.body;

    if (!name || !email || !message) {
        return res.status(400).send({ message: 'Name, email, and message are required.' });
    }

    // Construct the email
    const msg = {
        to: 'angroup.realestate@gmail.com', // The email address you want to receive the message
        from: 'your-verified-sender@example.com', // IMPORTANT: This must be a verified sender in your SendGrid account
        subject: `New Contact Form Submission from ${name}`,
        html: `
            <h2>New Inquiry from your Website</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Contact No.:</strong> ${contact || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
            <p><strong>Interested Projects:</strong> ${projects ? projects.join(', ') : 'None selected'}</p>
        `,
    };

    // Send the email
    sgMail
        .send(msg)
        .then(() => {
            console.log('Email sent successfully');
            res.status(200).send({ message: 'Thank you for your message! It has been sent.' });
        })
        .catch((error) => {
            console.error('Error sending email:', error.response.body);
            res.status(500).send({ message: 'Sorry, there was an error sending your message. Please try again later.' });
        });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
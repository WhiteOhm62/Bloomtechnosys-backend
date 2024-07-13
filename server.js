const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const validator = require('validator');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({
  origin: 'https://bloomtechnosys.onrender.com',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true  // enable CORS with credentials
}));

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'avi.bloomtechnosys@gmail.com',
    pass: 'lwmmqvcidvuvhmmq'
  }
});

// POST route for form submission
app.post('/submit', async (req, res) => {
  const { name, email, message } = req.body;

  // Validate email format
  if (!validator.isEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  const mailOptionsToUser = {
    from: 'avi.bloomtechnosys@gmail.com',
    to: email,
    subject: 'Greetings from Bloomstechnosys !!!',
    text: `Thank you, ${name}, for reaching out to us. We have received your message: "${message}".`
  };

  const mailOptionsToAdmin = {
    from: 'avi.bloomtechnosys@gmail.com',
    to: 'avi.bloomtechnosys@gmail.com',
    subject: `New Message Submission by ${name}`,
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
  };

  try {
    // Send email to user
    await transporter.sendMail(mailOptionsToUser);

    // Send email to admin
    await transporter.sendMail(mailOptionsToAdmin);

    res.json({ success: true });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ success: false, message: 'Failed to send email. Please try again later.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

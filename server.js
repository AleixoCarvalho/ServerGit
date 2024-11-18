const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');  // To serve static files like HTML

const app = express();
app.use(bodyParser.json());

// Serve static files (HTML, CSS, JS) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// Mock database (replace with a real database)
const users = [];

// Serve the registration page (GET request for root)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));  // Serve the signup HTML page
});

// Registration endpoint (POST request)
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user to the "database"
    users.push({ username, email, password: hashedPassword });

    console.log('Users:', users); // Debug: view stored users
    res.status(201).json({ message: 'User registered successfully.' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

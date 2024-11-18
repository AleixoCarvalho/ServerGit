import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors()); // Enable CORS for front-end communication

// Mock database (replace with a real database in production)
const users = [];

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    console.log("Received registration data:", req.body); // Log the received data

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user to the "database"
        users.push({ username, email, password: hashedPassword });

        console.log('Registered user:', { username, email }); // Log the successful registration

        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        console.error('Error during password hashing:', error);
        return res.status(500).json({ message: 'Error occurred while processing your request.' });
    }
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    // Find the user by username
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the password with the hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid password.' });
    }

    res.status(200).json({ message: 'Login successful.' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

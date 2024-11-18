import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Mock database, endpoints, and server setup remain the same...


// Mock "database" for storing users (replace with a real database in production)
const users = [];

// Registration endpoint
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    const existingUser = users.find(user => user.username === username || user.email === email);
    if (existingUser) {
        return res.status(400).json({ message: 'User already exists.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save the user to the "database"
    const newUser = { username, email, password: hashedPassword };
    users.push(newUser);

    // Respond with success
    res.status(201).json({ message: 'User registered successfully.' });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    // Validate input fields
    if (!username || !password) {
        return res.status(400).json({ message: 'Both username and password are required.' });
    }

    // Find the user by username (or email if necessary)
    const user = users.find(user => user.username === username);
    if (!user) {
        return res.status(400).json({ message: 'User not found.' });
    }

    // Compare the password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid password.' });
    }

    // Login successful, send a success response
    res.status(200).json({ message: 'Login successful!' });
});

// Start the server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});

import express from 'express';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import cors from 'cors';
import path from 'path';
import db from './db.js'; // Assuming db.js is set up correctly for MySQL connection

const app = express();

// Serve static files from the appropriate directories
// CSS, JS, and Image folders are outside the public folder
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Validate input fields
    if (!username || !email || !password) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the user already exists
    db.query(
        'SELECT * FROM users WHERE username = ? OR email = ?',
        [username, email],
        (err, results) => {
            if (err) {
                console.error('Error checking user existence:', err);
                return res.status(500).json({ message: 'Server error' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists.' });
            }

            // Hash the password
            bcrypt.hash(password, 10, (err, hashedPassword) => {
                if (err) {
                    console.error('Error hashing password:', err);
                    return res.status(500).json({ message: 'Server error' });
                }

                // Insert the user into the database
                db.query(
                    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
                    [username, email, hashedPassword],
                    (err, results) => {
                        if (err) {
                            console.error('Error saving user to MySQL:', err);
                            return res.status(500).json({ message: 'Server error' });
                        }

                        res.status(201).json({ message: 'User registered successfully.' });
                    }
                );
            });
        }
    );
});

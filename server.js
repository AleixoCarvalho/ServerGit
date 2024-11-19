import express from 'express';
import mysql from 'mysql2';
import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';

const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// MySQL Database connection
const db = mysql.createConnection({
    host: 'database-1.cd2sa42yg2v7.eu-north-1.rds.amazonaws.com',  // Use your RDS endpoint or 'localhost' if running locally
    user: 'admin',  // Your MySQL username
    password: 'Aleixinho777',  // Your MySQL password
    database: 'Hairstyle_booking', // Your database name
});

// Check the connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
    } else {
        console.log('Connected to MySQL');
    }
});

// Registration endpoint
app.post('/register', (req, res) => {
    const { email, username, password } = req.body;

    // Validate input
    if (!email || !username || !password) {
        return res.status(400).send({ message: 'Email, username, and password are required' });
    }

    // Check if username or email already exists
    const checkUserQuery = 'SELECT * FROM users WHERE email = ? OR username = ?';
    db.query(checkUserQuery, [email, username], (err, results) => {
        if (err) {
            console.error('Error checking user:', err);
            return res.status(500).send({ message: 'Error checking user' });
        }

        if (results.length > 0) {
            return res.status(400).send({ message: 'Email or username already exists' });
        }

        // Hash password and insert into database
        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                console.error('Error hashing password:', err);
                return res.status(500).send({ message: 'Error registering user' });
            }

            const insertQuery = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
            db.query(insertQuery, [email, username, hashedPassword], (err, result) => {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).send({ message: 'Error registering user' });
                }

                res.status(201).send({ message: 'User registered successfully' });
            });
        });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send({ message: 'Username and password are required' });
    }

    // Check if user exists
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error finding user:', err);
            return res.status(500).send({ message: 'Error logging in' });
        }

        if (results.length === 0) {
            return res.status(400).send({ message: 'User not found' });
        }

        const user = results[0];
        // Compare password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing password:', err);
                return res.status(500).send({ message: 'Error logging in' });
            }

            if (!isMatch) {
                return res.status(400).send({ message: 'Incorrect password' });
            }

            res.status(200).send({ message: 'Login successful' });
        });
    });
});

// Start the server
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

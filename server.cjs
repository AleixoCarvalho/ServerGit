const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();
const port = 3000;

// MySQL Database connection
const db = mysql.createConnection({
    host: 'database-1.cd2sa42yg2v7.eu-north-1.rds.amazonaws.com', // Replace with your RDS endpoint
    user: 'admin', // Replace with your DB username (admin)
    password: 'Aleixinho777', // Replace with your DB password
    database: 'Hairstyle_booking', // Your schema/database name
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
  } else {
    console.log('Connected to MySQL');
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: 'secret-key', // Use a proper secret key
    resave: false,
    saveUninitialized: false,
  })
);

// Registration Route (updated to handle email)
app.post('/register', (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).send({ message: 'Email, username, and password are required' });
  }

  // Hash the password before storing it
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      return res.status(500).send({ message: 'Error registering user' });
    }

    // Insert user into the database (make sure to handle email)
    const query = 'INSERT INTO users (email, username, password) VALUES (?, ?, ?)';
    db.query(query, [email, username, hashedPassword], (err, result) => {
      if (err) {
        console.error('Error inserting user into database:', err);
        return res.status(500).send({ message: 'Error registering user' });
      }
      res.status(201).send({ message: 'User registered successfully' });
    });
  });
});


// Login route
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  db.query('SELECT * FROM users WHERE username = ?', [username], (err, results) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching user data' });
    }
    if (results.length === 0) {
      return res.status(400).json({ message: 'User not found' });
    }

    bcrypt.compare(password, results[0].password, (err, isMatch) => {
      if (err || !isMatch) {
        return res.status(400).json({ message: 'Incorrect password' });
      }

      // Successful login, create session
      req.session.user = { id: results[0].id, username: results[0].username };
      res.status(200).json({ message: 'Login successful' });
    });
  });
});

// Protected route to check if the user is logged in
app.get('/user', (req, res) => {
  if (req.session.user) {
    res.send(`<h1>Hello, ${req.session.user.username}</h1>`);
  } else {
    res.status(401).send('Unauthorized');
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

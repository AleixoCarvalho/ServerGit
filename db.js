import mysql from 'mysql2';

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

export default db;

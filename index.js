import express from 'express';
import sqlite3 from 'sqlite3';

const app = express();

// Create a database users.db
const db = new sqlite3.Database('users.db', (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Connected to the SQlite database.');
});

// Create a table users if it does not exist
db.run('CREATE TABLE IF NOT EXISTS user (name TEXT, surname TEXT, matr INTEGER)');

// Handle GET requests to the root: get data from database with given matr
app.get('/:matr', (req, res) => {
    db.get('SELECT * FROM user WHERE matr = ?', [req.params.matr], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            res.send(`A user with matr ${req.params.matr} does not exist`);
        } else {
            res.send(row);
        }
    });
});

// Handle POST requests to the root: insert data into database
app.post('/:name/:surname/:matr', (req, res) => {
    db.get('SELECT matr FROM user WHERE matr = ?', [req.params.matr], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            db.run('INSERT INTO user (name, surname, matr) VALUES (?, ?, ?)', [req.params.name, req.params.surname, req.params.matr], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                res.send(`User with matr ${req.params.matr} added to database`);
            });
        } else {
            res.send(`A user with matr ${req.params.matr} already exists`);
        }
    });
});

app.delete('/:matr', (req, res) => {
    db.get('SELECT matr FROM user WHERE matr = ?', [req.params.matr], (err, row) => {
        if (err) {
            return console.error(err.message);
        }
        if (!row) {
            res.send(`A user with matr ${req.params.matr} does not exist`);
        } else {
            db.run('DELETE FROM user WHERE matr = ?', [req.params.matr], function(err) {
                if (err) {
                    return console.error(err.message);
                }
                res.send(`User with matr ${req.params.matr} deleted from database`);
            });
        }
    });
});


// Listen on port 3000
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});
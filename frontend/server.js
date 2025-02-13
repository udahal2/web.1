// this script is designed to be the interface to learn nextjs and have the project restructured.

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const users = []; // In-memory user storage, replace with a database in production

// Register endpoint
app.post('/register', async (req, res) => {
    const { username, password, fingerprint } = req.body;
    const hashedPassword = await bcryptjs.hash(password, 10);
    users.push({ username, password: hashedPassword, fingerprint });
    res.status(201).send('User registered');
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { username, password, fingerprint } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) {
        return res.status(400).send('Invalid credentials');
    }
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid || user.fingerprint !== fingerprint) {
        return res.status(400).send('Invalid credentials');
    }
    const token = jwt.sign({ username: user.username }, 'secret_key', { expiresIn: '1h' });
    res.json({ token });
});

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.sendStatus(401);
    jwt.verify(token, 'secret_key', (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// Protected route example
app.get('/protected', authenticateToken, (req, res) => {
    res.send('This is a protected route');
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/Users');

const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};

// 🟢 Login Locale
router.post('/login/local', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) return res.status(400).json({ message: 'Utente non trovato o password errata' });

        const token = generateToken(user);
        const userToSend = {
            _id: user._id,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName
        };

        res.json({ token, user: userToSend });
    })(req, res, next);
});

// 🟢 Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password non valida' });
        }

        const token = generateToken(user);
        res.json({ message: 'Login effettuato con successo', token });
    } catch (err) {
        console.error('Errore durante il login:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// 🟢 Registrazione di un nuovo utente
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            firstName, 
            lastName, 
            email, 
            password: hashedPassword 
        });

        await newUser.save();

        const userToSend = { 
            _id: newUser._id, 
            email: newUser.email, 
            firstName: newUser.firstName, 
            lastName: newUser.lastName 
        };

        const token = generateToken(newUser);
        res.status(201).json({ message: 'Utente registrato con successo', user: userToSend, token });

    } catch (err) {
        console.error('❌ Errore durante la registrazione:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// 🟢 Login con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
    const token = generateToken(req.user);
    res.redirect(`http://localhost:3000/login?token=${token}`);
});

module.exports = router;

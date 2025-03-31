const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require('../models/Users');

// Registrazione di un nuovo utente
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Validazione dei campi
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'Tutti i campi sono obbligatori' });
        }

        // Controlla se l'email è già registrata
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email già registrata' });
        }

        // Hash della password
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("Password hashata durante la registrazione:", hashedPassword); // Log per debug

        // Crea un nuovo utente
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword, // Salva la password hashata
        });

        await newUser.save();
        res.status(201).json({ message: 'Utente registrato con successo' });
    } catch (err) {
        console.error('Errore durante la registrazione:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        console.log("Password ricevuta dal frontend:", password); // Log per debug
        console.log("Password salvata nel database:", user.password); // Log per debug

        const isMatch = await bcrypt.compare(password, user.password);
        console.log("Risultato del confronto password:", isMatch); // Log per debug

        if (!isMatch) {
            return res.status(401).json({ message: 'Password non valida' });
        }

        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
        });
    } catch (err) {
        console.error('Errore durante il login:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

module.exports = router;

const express = require('express');
const bcrypt = require('bcrypt'); // Usa bcrypt per l'hashing delle password
const router = express.Router();
const User = require('../models/Users'); // Assicurati che il nome del file sia esattamente "Users.js"

// Registrazione di un nuovo utente
router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Controlla se tutti i campi richiesti sono presenti
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

        // Crea un nuovo utente
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
        });

        await newUser.save();
        res.status(201).json({ message: 'Utente registrato con successo', user: { 
            _id: newUser._id, 
            firstName: newUser.firstName, 
            lastName: newUser.lastName, 
            email: newUser.email 
        }});
    } catch (err) {
        console.error('Errore durante la registrazione:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// Login utente
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Controlla se tutti i campi richiesti sono presenti
        if (!email || !password) {
            return res.status(400).json({ message: 'Email e password sono obbligatori' });
        }

        // Trova l'utente per email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        // Confronta la password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Password non valida' });
        }

        // Restituisci i dati dell'utente (senza la password)
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

//PUT 
router.put("/:id", async (req, res) => {
    try {
        const { firstName, lastName, currentPassword, newPassword } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Utente non trovato' });
        }

        if (currentPassword && !(await bcrypt.compare(currentPassword, user.password))) {
            return res.status(401).json({ message: 'Password attuale non valida' });
        }

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        if (newPassword) {
            user.password = newPassword;
        }
        await user.save();
        res.json({ message: 'Profilo aggiornato con successo', user });
    } catch (err) {
        res.status(500).json({ message: 'Errore del server' });
    }
});

module.exports = router;
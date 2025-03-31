const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const upload = require('../utils/upload'); // Importa il middleware di upload

// POST create a new post con immagine
router.post('/', upload.single('cover'), async (req, res) => {
    try {
        const { title, category, content, readTime, author } = req.body;

        // Verifica che l'autore sia presente
        if (!author) {
            return res.status(400).json({ message: "Author is required" });
        }

        // Verifica che il campo readTime sia valido
        if (!readTime || !readTime.value || isNaN(readTime.value)) {
            return res.status(400).json({ message: "Valid readTime is required" });
        }

        // Verifica che l'immagine sia stata caricata
        if (!req.file) {
            return res.status(400).json({ message: "Cover image is required" });
        }

        const newPost = new Post({
            title,
            category,
            cover: req.file.path,
            content,
            readTime,
            author,
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (err) {
        console.error("Errore durante la creazione del post:", err.message);
        res.status(500).json({ message: err.message });
    }
});

// GET tutti posts con paginazione
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 6;
        const skip = (page - 1) * limit;

        // Filtra i post per autore
        const filter = req.query.author ? { author: req.query.author } : {};
        console.log('Filtro applicato:', filter); // Log per debug

        const posts = await Post.find(filter)
            .skip(skip)
            .limit(limit)
            .populate('author', 'firstName lastName')
            .lean();

        const totalPosts = await Post.countDocuments(filter);

        console.log('Post trovati:', posts); // Log per debug
        res.status(200).json({
            posts,
            totalPages: Math.ceil(totalPosts / limit),
            currentPage: page,
        });
    } catch (err) {
        console.error('Errore durante il recupero dei post:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// GET singolo post
router.get('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName'); // Popola i dettagli dell'autore
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }
        res.status(200).json(post);
    } catch (err) {
        console.error('Errore durante il recupero del post:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

// DELETE singolo post
router.delete('/:id', async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        // Verifica che l'utente sia l'autore del post
        if (post.author.toString() !== req.headers['user-id']) {
            return res.status(403).json({ message: 'Non sei autorizzato a eliminare questo post' });
        }

        await post.remove();
        res.json({ message: 'Post eliminato con successo' });
    } catch (err) {
        console.error('Errore durante l\'eliminazione del post:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

module.exports = router;



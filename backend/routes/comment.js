const express = require('express');
const Comment = require('../models/Comments');
const router = express.Router();

// GET commenti di un post
router.get("/post/:postId", async (req, res) => {
    // Nessun middleware di autenticazione qui
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .populate("author", "firstName lastName")
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (err) {
        console.error("Errore durante il recupero dei commenti:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
});

// POST nuovo commento
router.post("/", async (req, res) => {
    try {
        const { content, post, author } = req.body;

        // Verifica che tutti i campi richiesti siano presenti
        if (!content || !post || !author) {
            return res.status(400).json({ message: "Tutti i campi sono obbligatori" });
        }

        const newComment = new Comment({
            content,
            author, // Usa l'ID dell'autore inviato dal frontend
            post,
        });

        const savedComment = await newComment.save();
        const populatedComment = await Comment.findById(savedComment._id)
            .populate("author", "firstName lastName"); // Popola i dettagli dell'autore
        res.status(201).json(populatedComment);
    } catch (err) {
        console.error("Errore durante la creazione del commento:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
});

// DELETE commento
router.delete("/:id", async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commento non trovato" });
        res.json(comment);
    } catch (err) {
        console.error("Errore durante la cancellazione del commento:", err.message);
        res.status(500).json({ message: "Errore del server" });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedData = req.body;

        const post = await Post.findById(id);
        if (!post) {
            return res.status(404).json({ message: 'Post non trovato' });
        }

        // Aggiorna il post
        Object.assign(post, updatedData);
        await post.save();

        res.json({ message: 'Post aggiornato con successo', post });
    } catch (err) {
        console.error('Errore durante l\'aggiornamento del post:', err.message);
        res.status(500).json({ message: 'Errore del server' });
    }
});

module.exports = router;
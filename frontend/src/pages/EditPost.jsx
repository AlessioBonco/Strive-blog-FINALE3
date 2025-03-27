import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../contexts/AuthorContext'; // Importa il contesto di autenticazione

const EditPost = () => {
    const { user } = useAuth(); // Ottieni l'utente loggato dal contesto
    const [post, setPost] = useState({});
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const { id } = useParams(); // Ottieni l'ID del post dai parametri della route
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`http://localhost:3003/api/posts/${id}`);
                setPost(res.data);
                setTitle(res.data.title);
                setContent(res.data.content);
            } catch (err) {
                setError('Errore durante il recupero del post.');
            }
        };

        fetchPost();
    }, [id]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const updatedPost = { title, content };
            await axios.put(
                `http://localhost:3003/api/posts/${id}`,
                updatedPost,
                {
                    headers: {
                        'user-id': user._id, // Invia l'ID dell'utente nell'header
                    },
                }
            );
            console.log("Post aggiornato con successo!");
            navigate(`/posts/${id}`);
        } catch (error) {
            console.error("Errore durante l'aggiornamento del post:", error.response?.data || error.message);
            setError(error.response?.data?.message || 'Errore durante l\'aggiornamento del post.');
        }
    };

    return (
        <Container className="mt-5">
            <h2>Modifica Post</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSave}>
                <Form.Group controlId="title">
                    <Form.Label>Titolo</Form.Label>
                    <Form.Control
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Group>
                <Form.Group controlId="content">
                    <Form.Label>Contenuto</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={5}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Form.Group>
                <Button variant="primary" type="submit" className="mt-3">
                    Salva modifiche
                </Button>
            </Form>
        </Container>
    );
};

export default EditPost;

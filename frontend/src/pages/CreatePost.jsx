// components/CreatePost.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthorContext';
import { Form, Button, Alert, Row, Col, Container } from 'react-bootstrap';
import axios from 'axios';

const CreatePost = () => {
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        content: '',
        readTime: {
            value: '',
            unit: 'minuti',
        },
    });
    const [cover, setCover] = useState(null); // Stato per l'immagine
    const [error, setError] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const postData = new FormData();
            postData.append('title', formData.title);
            postData.append('category', formData.category);
            postData.append('content', formData.content);
            postData.append('readTime[value]', formData.readTime.value);
            postData.append('readTime[unit]', formData.readTime.unit);
            postData.append('author', user?._id); // ID dell'autore
            if (cover) postData.append('cover', cover); // Aggiungi l'immagine

            await axios.post('http://localhost:3003/api/posts', postData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            navigate('/');
        } catch (error) {
            setError(error.response?.data?.message || 'An unexpected error occurred');
        }
    };

    return (
        <Container>
            <Row className="justify-content-center mt-4">
                <Col md={8} lg={6}>
                    <div className="p-4 shadow-sm rounded-3">
                        <h2 className="text-center text-dark mb-4">Create a New Post</h2>
                        {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}
                        <Form onSubmit={handleSubmit}>
                            <Form.Group controlId="title" className="mb-3">
                                <Form.Label className="fw-semibold">Titolo</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Inserisci il Titolo..."
                                    className="rounded-3"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="category" className="mb-3">
                                <Form.Label className="fw-semibold">Categoria</Form.Label>
                                <Form.Control
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    placeholder="Inserisci la Categoria..."
                                    className="rounded-3"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="cover" className="mb-3">
                             <Form.Label className="fw-semibold">Cover</Form.Label>
                                <input
                                type="file"
                                onChange={(e) => setCover(e.target.files[0])}
                               className="d-none"
                                id="coverInput" 
                               required
                              />
                              <label htmlFor="coverInput" className="btn btn-primary w-100 rounded-3">
                               Scegli il file
                              </label>
                            </Form.Group>
                            <Form.Group controlId="content" className="mb-3">
                                <Form.Label className="fw-semibold">Contenuto</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={5}
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    placeholder="Inserisci il Contenuto..."
                                    className="rounded-3"
                                    required
                                />
                            </Form.Group>
                            <Form.Group controlId="readTime" className="mb-4">
                                <Form.Label className="fw-semibold">Tempo di Lettura (minuti)</Form.Label>
                                <Form.Control
                                    type="number"
                                    min="1"
                                    value={formData.readTime.value}
                                    onChange={(e) =>
                                        setFormData({
                                            ...formData,
                                            readTime: { ...formData.readTime, value: e.target.value },
                                        })
                                    }
                                    required
                                />
                            </Form.Group>
                            <Button variant="primary" type="submit" className="w-100 rounded-3 py-2 fw-semibold shadow-sm">
                                Create Post
                            </Button>
                        </Form>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default CreatePost;





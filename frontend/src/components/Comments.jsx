import { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert, ListGroup } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthorContext';
import axios from 'axios';

const API_URL = 'http://localhost:3003';

const Comments = ({ postId }) => {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const { user } = useAuth();

    const fetchComments = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/comments/post/${postId}`);
            setComments(res.data);
            setError(''); // Resetta l'errore se la richiesta ha successo
        } catch (error) {
            console.error("Errore durante il recupero dei commenti:", error.response?.data || error.message);
            setError('Errore durante il recupero dei commenti.');
        }
    };

    useEffect(() => {
        console.log("Post ID:", postId); // Log per debug
        if (postId) {
            fetchComments();
        } else {
            setError('ID del post non valido.');
        }
    }, [postId]);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        if (!user) {
            setError('Devi essere autenticato per inviare un commento.');
            return;
        }

        try {
            const res = await axios.post(`${API_URL}/api/comments`, {
                content: newComment,
                post: postId,
                author: user._id, // Invia l'ID dell'utente dal frontend
            });
            setComments([...comments, res.data]);
            setNewComment('');
            setError('');
        } catch (error) {
            console.error(error);
            setError('Errore durante l\'invio del commento.');
        }   
    }
    

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`${API_URL}/api/comments/${commentId}`);
            setComments(comments.filter((comment) => comment._id !== commentId));
        } catch (error) {
            console.error(error);
            setError('Errore durante l\'eliminazione del commento.');
        }
    };

    return (
        <div className='mt-5'>
            <h4>Commenti</h4>
            {error && <Alert variant='danger'>{error}</Alert>}
            {user && (
                <Form onSubmit={handleCommentSubmit}>
                    <Row>
                        <Col>
                            <Form.Control
                                as='textarea'
                                rows={3}
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder='Inserisci un commento...'
                            />
                        </Col>
                        <Col xs='auto'>
                            <Button type='submit'>Invia commento</Button>
                        </Col>
                    </Row>
                </Form>
            )}
            <ListGroup className='mt-3'>
                {comments.map((comment) => (
                    <ListGroup.Item key={comment._id}>
                        <strong>
                            {comment.author ? `${comment.author.firstName} ${comment.author.lastName}` : 'Anonimo'}
                        </strong>: {comment.content}
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>
                            {comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}
                        </div>
                        {user && user._id === comment.author?._id && (
                            <Button
                                variant='danger'
                                className='float-end'
                                onClick={() => handleDelete(comment._id)}
                            >
                                Elimina
                            </Button>
                        )}
                    </ListGroup.Item>
                ))}
            </ListGroup>
        </div>
    );
};

export default Comments;


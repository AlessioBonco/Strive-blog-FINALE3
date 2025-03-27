import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Card, Spinner, Alert, Button } from 'react-bootstrap';
import Comments from '../components/Comments';
import { useAuth } from '../contexts/AuthorContext';

const PostDetails = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`http://localhost:3003/api/posts/${id}`);
                console.log('Post ricevuto dal backend:', res.data);
                setPost(res.data);
                setError('');
            } catch (e) {
                console.error('Errore durante il recupero del post:', e.message);
                setError('Errore durante il recupero del post');
                setPost(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            try {
                await axios.delete(`http://localhost:3003/api/posts/${post._id}`, {
                    headers: {
                        'user-id': user._id,
                    },
                });
                navigate('/my-posts');
            } catch (error) {
                console.error('Error deleting post:', error.message);
                setError('Error deleting post');
            }
        }
    };

    const isAuthor = user && user._id === post?.author?._id;

    if (loading) {
        return <Spinner animation="border" />;
    }

    if (error) {
        return <Alert variant="danger">{error}</Alert>;
    }

    if (!post) {
        return <p>Caricamento...</p>;
    }

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8} lg={6}>
                    <Card className="shadow-sm rounded-3">
                        <Card.Img variant="top" src={post.cover} alt={post.title} style={{ maxHeight: '300px', objectFit: 'cover' }} />
                        <Card.Body>
                            <Card.Title className="text-primary">{post.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">{post.category}</Card.Subtitle>
                            <Card.Text>{post.content}</Card.Text>
                            <div className="d-flex justify-content-between">
                                <small className="text-muted">Tempo di lettura: {post.readTime.value} {post.readTime.unit}</small>
                                <small className="text-muted">Autore: {post.author?.firstName} {post.author?.lastName || 'Anonimo'}</small>
                            </div>
                            {isAuthor && (
                                <div className="mt-4">
                                    <Button variant="danger" onClick={handleDelete} className="me-2">
                                        Elimina
                                    </Button>
                                    <Button variant="primary" onClick={() => navigate(`/posts/edit/${id}`)}>
                                        Modifica
                                    </Button>
                                </div>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Comments postId={post._id} />
        </Container>
    );
};

export default PostDetails;





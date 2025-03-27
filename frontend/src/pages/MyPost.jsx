import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthorContext';
import axios from 'axios';
import PostCard from '../components/PostCard';

const MyPosts = () => {
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState('');
    const { user } = useAuth();

    useEffect(() => {
        const fetchPosts = async () => {
            if (!user) {
                setError('Utente non autenticato');
                return;
            }
            try {
                const res = await axios.get(`http://localhost:3003/api/posts?author=${user._id}`);
                setPosts(res.data.posts);
            } catch (err) {
                setError('Errore durante il recupero dei post.');
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    const handleDelete = async (postId) => {
        try {
            await axios.delete(`http://localhost:3003/api/posts/${postId}`);
            setPosts(posts.filter((post) => post._id !== postId));
        } catch (err) {
            console.error('Errore durante l\'eliminazione del post:', err.message);
            setError('Errore durante l\'eliminazione del post');
        }
    };

    return (
        <Container className="mt-5">
            <h2>I Miei Post</h2>
            {error && <p className="text-danger">{error}</p>}
            <Row>
                {posts.length > 0 ? (
                    posts.map((post) => (
                        <Col key={post._id} sm={12} md={6} lg={4}>
                            <PostCard post={post} onDelete={handleDelete} />
                        </Col>
                    ))
                ) : (
                    <Col>
                        <p>Non hai pubblicato ancora nessun post</p>
                    </Col>
                )}
            </Row>
        </Container>
    );
};

export default MyPosts;




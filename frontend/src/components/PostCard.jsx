import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthorContext';
import './Postcard.css';

const PostCard = ({ post, onDelete }) => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const isAuthor = user && user._id === post.author?._id; // Controlla se l'utente è l'autore del post

    return (
        <Card 
            className="mb-4 shadow-sm rounded post-card" 
            style={{ cursor: 'pointer' }}
        >
            <Card.Img 
                variant="top" 
                src={post.cover || 'default-cover.jpg'} 
                style={{ maxHeight: '200px', objectFit: 'cover' }} 
                onClick={() => navigate(`/posts/${post._id}`)} // Naviga ai dettagli del post
            />
            <Card.Body className="d-flex flex-column">
                <Card.Title>{post.title || 'Titolo non disponibile'}</Card.Title>
                <Card.Text className="card-text">
                    {post.content || 'Contenuto non disponibile'}
                </Card.Text>
                <div className="card-author mt-auto">
                    <small>Autore: {post.author ? `${post.author.firstName} ${post.author.lastName}` : 'Autore non disponibile'}</small>
                </div>
          
            </Card.Body>
        </Card>
    );
};

export default PostCard;







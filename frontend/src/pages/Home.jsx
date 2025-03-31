import { useState, useEffect } from 'react';
import { Container, Row, Col, Alert, Pagination } from 'react-bootstrap';
import axios from 'axios';
import PostCard from '../components/PostCard';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true); // Variabile per controllare lo stato di caricamento
  const [error, setError] = useState(''); 
  const [currentPage, setCurrentPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`http://localhost:3003/api/posts?page=${currentPage}&limit=6`);
        setPosts(res.data.posts);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        setError('Errore nel caricamento dei post. Riprova più tardi.');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentPage]); // Ricarica i post ogni volta che cambia la pagina

  // Funzione per gestire il cambio di pagina
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <Container className="mt-5">
      {error && <Alert variant="danger">{error}</Alert>} {/* Mostra errore se presente */}
      <Row>
        {loading ? (
          <Col className="text-center">
            <p>Caricamento in corso...</p>
          </Col>
        ) : (
          posts.map((post) => (
            <Col key={post._id} sm={12} md={6} lg={4}>
              <PostCard post={post} />
            </Col>
          ))
        )}
      </Row>

      {/* Aggiungi la paginazione */}
      {totalPages > 1 && (
        <div className='d-flex justify-content-center mt-4'>
          <Pagination>
            <Pagination.Prev 
              disabled={currentPage === 1} 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} 
            />
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item 
                key={idx + 1} 
                active={currentPage === idx + 1} 
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next 
              disabled={currentPage === totalPages} 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} 
            />
          </Pagination>
        </div>
      )}
    </Container>
  );
};

export default Home;


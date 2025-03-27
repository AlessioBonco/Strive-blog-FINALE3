import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthorContext';

const NavBar = () => {
  const authContext = useAuth();
  const user = authContext?.user;
  const logout = authContext?.logout;

  // Funzione per ottenere le iniziali del nome e cognome
  const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return 'NN';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  return (
    <Navbar bg="primary" expand="lg" variant="dark" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold text-light">
          Blog
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Link to="/" className="nav-link text-light">Home</Link>
          </Nav>

          {/* Profilo a destra */}
          <div className="d-flex align-items-center gap-3 ms-auto">
            {user ? (
              <>
                <NavDropdown
                  title={`Benvenuto/a, ${user.firstName}`}
                  id="user-dropdown"
                  align="end"
                  className="text-light"
                >
                  <NavDropdown.Item as={Link} to="/posts/create">
                    Crea Post
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/my-posts">
                    I Miei Post
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item as={Link} to="/profile">
                   Gestisci Profilo
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>

                {/* Immagine profilo a destra */}
                {user.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profilo"
                    className="rounded-circle"
                    style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                  />
                ) : (
                  <div
                    className="rounded-circle bg-light text-primary d-flex align-items-center justify-content-center"
                    style={{ width: '40px', height: '40px', fontSize: '1rem', fontWeight: 'bold' }}
                  >
                    {getInitials(user.firstName, user.lastName)}
                  </div>
                )}
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-light px-3">Login</Link>
                <Link to="/register" className="btn btn-light text-primary px-3">Register</Link>
              </>
            )}
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;






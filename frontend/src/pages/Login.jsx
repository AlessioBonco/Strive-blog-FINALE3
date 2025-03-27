import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthorContext";
import axios from "axios";
import { Button, Form, Container, Row, Col, Alert, Spinner } from "react-bootstrap";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const API_URL = "http://localhost:3003/auth";

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/login/local`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            console.log("Login effettuato con successo:", data);
            // Salva il token e reindirizza
            localStorage.setItem("token", data.token);
            navigate("/");
        } else {
            console.error("Errore durante il login:", data.message);
            setError(data.message);
        }
    } catch (err) {
        console.error("Errore del server:", err);
        setError("Errore del server");
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/google`;
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h2 className="text-center mb-4">Login</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formEmail" className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Inserisci la tua email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="formPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Inserisci la tua password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : "Login"}
            </Button>
            <Button variant="secondary" onClick={handleGoogleLogin} className="w-100 mt-3">
              Login con Google
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default Login;



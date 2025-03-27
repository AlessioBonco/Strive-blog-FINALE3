import { useState, useEffect } from 'react';
import { Button, Form, Container, Row, Col, Alert } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthorContext';
import axios from 'axios';

const Profile = () => {
    const { user, logout } = useAuth();
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        // Verifica che l'utente sia disponibile prima di impostare i dati del form
        if (user) {
            setFormData({
                firstname: user.firstName,
                lastname: user.lastName,
                email: user.email,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        }
    }, [user]); // Esegui questo effetto ogni volta che "user" cambia

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        try {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                setError('Le password non corrispondono');
                return;
            }

            const res = await axios.put(`http://localhost:3003/api/users/${user._id}`, {
                firstname: formData.firstname,
                lastname: formData.lastname,
                currentPassword: formData.currentPassword,
                newPassword: formData.newPassword,
            });

            setSuccess('Profilo aggiornato con successo');
            setError('');

            // Reset campi password
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            }));
        } catch (e) {
            setError('Aggiornamento del profilo fallito. Riprova più tardi.');
        }
    };

    if (!user) {
        // Puoi restituire un messaggio di caricamento se "user" è ancora null
        return <div>Caricamento profilo...</div>;
    }

    return (
        <Container>
            <h2>Gestisci il tuo profilo</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}
            <Row className="justify-content-center">
                <Col md={6}>
                    <Form onSubmit={handleProfileUpdate}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstname"
                                value={formData.firstname}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                            />
                        </Form.Group>

                        <h4>Modifica Password</h4>
                        <Form.Group className="mb-3">
                            <Form.Label>Password Attuale</Form.Label>
                            <Form.Control
                                type="password"
                                name="currentPassword"
                                value={formData.currentPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Nuova Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Conferma Nuova Password</Form.Label>
                            <Form.Control
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </Form.Group>

                        <Button type="submit">Aggiorna Profilo</Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default Profile;


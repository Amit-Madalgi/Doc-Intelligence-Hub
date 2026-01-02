import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap'; 
// REMOVED: import authService from '../services/authService'; 
import { useAuth } from '../context/AuthContext'; // ⬅️ UNCOMMENTED and now USED

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 

    const { email, password } = formData;
    const navigate = useNavigate();
    const { login } = useAuth(); // ⬅️ USING the login function from context

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            // Call the context login function (this internally calls authService.login)
            await login({ email, password });
            
            setLoading(false);
            navigate('/dashboard'); // Redirect to the dashboard
        } catch (err) {
            setLoading(false);
            const errorMessage = err.response?.data?.message || 'Login failed: Invalid credentials or server error.';
            console.error('Login Error:', err);
            setError(errorMessage);
        }
    };

    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '20px'
            }}
        >
            <Card
                style={{
                    width: '25rem',
                    borderRadius: '15px',
                    boxShadow: '0 15px 35px rgba(0, 0, 0, 0.3)',
                    backdropFilter: 'blur(10px)',
                    background: 'rgba(255, 255, 255, 0.95)',
                    border: 'none'
                }}
                className="p-4"
            >
                <Card.Body>
                    <h2
                        className="text-center mb-4"
                        style={{
                            color: '#333',
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            fontFamily: "'Poppins', sans-serif",
                            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        User Login
                    </h2>

                    {error && (
                        <Alert
                            variant="danger"
                            style={{
                                borderRadius: '10px',
                                border: 'none',
                                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
                                color: 'white'
                            }}
                        >
                            {error}
                        </Alert>
                    )}

                    <Form onSubmit={onSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                name="email"
                                value={email}
                                onChange={onChange}
                                placeholder="Enter your email"
                                required
                                style={{
                                    borderRadius: '10px',
                                    border: '2px solid #e1e5e9',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'rgba(255, 255, 255, 0.8)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                name="password"
                                value={password}
                                onChange={onChange}
                                placeholder="Enter password"
                                required
                                style={{
                                    borderRadius: '10px',
                                    border: '2px solid #e1e5e9',
                                    padding: '12px',
                                    fontSize: '1rem',
                                    transition: 'all 0.3s ease',
                                    background: 'rgba(255, 255, 255, 0.8)'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                onBlur={(e) => e.target.style.borderColor = '#e1e5e9'}
                            />
                        </Form.Group>

                        <Button
                            type="submit"
                            className="w-100"
                            disabled={loading}
                            style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                border: 'none',
                                borderRadius: '25px',
                                padding: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 'bold',
                                color: 'white',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                            }}
                            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                        >
                            {loading ? 'Logging In...' : 'Login'}
                        </Button>
                    </Form>

                    <p
                        className="mt-3 text-center"
                        style={{
                            color: '#666',
                            fontSize: '0.95rem'
                        }}
                    >
                        Don't have an account?
                        <span
                            onClick={() => navigate('/register')}
                            style={{
                                cursor: 'pointer',
                                color: '#667eea',
                                marginLeft: '5px',
                                fontWeight: 'bold',
                                transition: 'color 0.3s ease'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                            onMouseLeave={(e) => e.target.style.color = '#667eea'}
                        >
                            Register
                        </span>
                    </p>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
import React, { useState, useEffect} from 'react';
import { Container, Alert } from 'react-bootstrap';
import HistoryList from '../components/HistoryList';
import documentService from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchHistory = async () => {
      if (!user || !user.token) {
        setError('You must be logged in to view history.');
        setLoading(false);
        return;
      }
      try {
        const data = await documentService.getHistory(user.token);
        setHistory(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch query history.');
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  return (
    <Container>
      <h1>Query History</h1>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : history.length === 0 ? (
        <Alert variant="info">No query history found.</Alert>
      ) : (
        <HistoryList history={history} />
      )}
    </Container>
  );
};

export default HistoryPage;
import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import DocumentList from '../components/DocumentList';
import UploadForm from '../components/UploadForm';
import documentService from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const [documents, setDocuments] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const data = await documentService.getDocuments(user.token);
        setDocuments(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (user) {
      fetchDocuments();
    }
  }, [user]);

  const addDocument = (document) => {
    setDocuments((prevDocuments) => [...prevDocuments, document]);
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2>My Documents</h2>
          <DocumentList documents={documents} />
        </Col>
        <Col md={4}>
          <h2>Upload Document</h2>
          <UploadForm addDocument={addDocument} />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;

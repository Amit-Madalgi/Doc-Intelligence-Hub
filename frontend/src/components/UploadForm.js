import React, { useState} from 'react';
import { Form, Button } from 'react-bootstrap';
import documentService from '../services/documentService';
import { useAuth } from '../context/AuthContext';

const UploadForm = ({ addDocument }) => {
  const [file, setFile] = useState(null);
  const { user } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('document', file);

    try {
      const data = await documentService.uploadDocument(formData, user.token);
      addDocument(data);
      setFile(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Form onSubmit={submitHandler}>
      <Form.Group>
        <Form.Control
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-2">
        Upload
      </Button>
    </Form>
  );
};

export default UploadForm;

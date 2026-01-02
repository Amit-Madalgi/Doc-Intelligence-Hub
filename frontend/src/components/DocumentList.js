import React from 'react';
import { ListGroup } from 'react-bootstrap';

const DocumentList = ({ documents }) => {
  return (
    <ListGroup>
      {documents.map((doc) => (
        <ListGroup.Item key={doc._id}>
          {doc.fileName} - {doc.status}
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default DocumentList;

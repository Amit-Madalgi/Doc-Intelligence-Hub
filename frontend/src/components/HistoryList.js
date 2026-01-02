import React from 'react';
import { ListGroup, Card } from 'react-bootstrap';

const HistoryList = ({ history }) => {
  return (
    <ListGroup className="mt-3">
      {history.map((item) => (
        <ListGroup.Item key={item._id} className="mb-3">
          <Card>
            <Card.Header as="h6" className="bg-light">
              **Query:** {item.query}
            </Card.Header>
            <Card.Body>
              <Card.Title>Answer:</Card.Title>
              <Card.Text>{item.answer}</Card.Text>
              
              {item.references && item.references.length > 0 && (
                <div className="source">
                  <small className="text-muted d-block mt-2">
                    **Sources:** 
                    {item.references.map((ref, index) => (
                      <span key={index} style={{ display: 'block' }}>
                        *{ref.fileName}*
                      </span>
                    ))}
                  </small>
                </div>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              {new Date(item.createdAt).toLocaleString()}
            </Card.Footer>
          </Card>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default HistoryList;
import React from 'react';
import { Container } from 'react-bootstrap';
import ChatBox from '../components/ChatBox';

const ChatPage = () => {
  return (
    <Container>
      <h1>Chat with your Documents</h1>
      <ChatBox />
    </Container>
  );
};

export default ChatPage;

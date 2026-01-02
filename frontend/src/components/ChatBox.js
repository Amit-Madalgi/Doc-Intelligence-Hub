import React, { useState, useContext } from 'react';
import { Form, Button, InputGroup } from 'react-bootstrap';
import Message from './Message';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState('');
  const { user } = useAuth();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMessage = { sender: 'user', text: query };
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    try {
      const data = await chatService.search(query, user?.token);
      const botMessage = {
        sender: 'bot',
        text: data.answer,
        source: data.source,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (error) {
      console.error(error);
      const botMessage = {
        sender: 'bot',
        text: 'Sorry, I encountered an error.',
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    }

    setQuery('');
  };

  return (
    <div>
      <div className="chat-messages">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>
      <Form onSubmit={submitHandler}>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Ask a question..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <Button type="submit" variant="primary">
            Send
          </Button>
        </InputGroup>
      </Form>
    </div>
  );
};

export default ChatBox;

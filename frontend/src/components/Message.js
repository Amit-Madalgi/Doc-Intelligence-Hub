import React from 'react';

const Message = ({ message }) => {
  const { sender, text, source } = message;
  const isUser = sender === 'user';

  return (
    <div className={`message ${isUser ? 'user-message' : 'bot-message'}`}>
      <div className="message-content">
        <p>{text}</p>
        {/* Updated to handle 'source' as an array of reference objects */}
        {source && Array.isArray(source) && source.length > 0 && ( 
          <div className="source">
            <h6>Sources:</h6>
            {source.map((ref, index) => (
              <small key={index} style={{ display: 'block' }}>
                **{ref.fileName}** - *"{ref.excerpt}"*
              </small>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Message;
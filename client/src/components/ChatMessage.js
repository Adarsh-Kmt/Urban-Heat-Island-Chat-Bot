import React from 'react';
import styled from 'styled-components';
import ReactMarkdown from 'react-markdown';

const MessageWrapper = styled.div`
  display: flex;
  justify-content: ${props => props.isUser ? 'flex-end' : 'flex-start'};
  margin-bottom: 16px;
`;

const MessageBubble = styled.div`
  max-width: 70%;
  min-width: 200px;
  padding: 16px 20px;
  border-radius: 20px;
  background: ${props => props.isUser ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.isUser ? 'white' : '#333'};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
  
  ${props => props.isLoading && `
    opacity: 0.7;
    &::after {
      content: '';
      display: inline-block;
      width: 20px;
      height: 20px;
      border: 2px solid #333;
      border-radius: 50%;
      border-top-color: transparent;
      animation: spin 1s linear infinite;
      margin-left: 10px;
    }
  `}

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const MessageText = styled.div`
  line-height: 1.6;
  word-wrap: break-word;
  
  p {
    margin-bottom: 12px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  strong {
    font-weight: 600;
  }
  
  ul, ol {
    margin: 8px 0;
    padding-left: 20px;
  }
  
  li {
    margin-bottom: 4px;
  }
`;

const Timestamp = styled.div`
  font-size: 12px;
  color: ${props => props.isUser ? 'rgba(255, 255, 255, 0.7)' : '#666'};
  margin-top: 8px;
  text-align: ${props => props.isUser ? 'right' : 'left'};
`;

const LocationButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-top: 12px;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
  font-size: 14px;
`;

function ChatMessage({ message, onLocationClick }) {
  const isUser = message.sender === 'user';
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <MessageWrapper isUser={isUser}>
      <MessageBubble isUser={isUser} isLoading={message.isLoading}>
        <MessageText>
          {isUser ? (
            message.text
          ) : (
            <ReactMarkdown>{message.text}</ReactMarkdown>
          )}
        </MessageText>
        
        {message.location && !isUser && (
          <LocationButton onClick={onLocationClick}>
            📍 View {message.location.name} Details
          </LocationButton>
        )}
        
        {message.isError && (
          <ErrorMessage>
            There was an error processing your request. Please try again.
          </ErrorMessage>
        )}
        
        <Timestamp isUser={isUser}>
          {formatTime(message.timestamp)}
        </Timestamp>
      </MessageBubble>
    </MessageWrapper>
  );
}

export default ChatMessage;

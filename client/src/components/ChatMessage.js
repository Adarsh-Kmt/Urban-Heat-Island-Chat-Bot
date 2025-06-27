import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

const MessageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
  animation: slideInUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  @keyframes slideInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const MessageBubble = styled.div`
  max-width: 80%;
  padding: 18px 22px;
  border-radius: 20px;
  font-size: 15px;
  line-height: 1.6;
  word-wrap: break-word;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.sender === 'user' 
      ? props.theme.colors.gradient 
      : props.theme.colors.gradientAccent};
    opacity: ${props => props.sender === 'user' ? 1 : 0.5};
    z-index: -1;
  }
  
  ${props => props.sender === 'user' ? `
    background: transparent;
    color: white;
    align-self: flex-end;
    border-bottom-right-radius: 8px;
    box-shadow: ${props.theme.colors.shadowLg};
    font-weight: 500;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      right: -8px;
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-top: 12px solid ${props.theme.colors.accent};
    }
  ` : `
    background: ${props.theme.colors.card};
    color: ${props.theme.colors.textPrimary};
    align-self: flex-start;
    border-bottom-left-radius: 8px;
    border: 1px solid ${props.theme.colors.border};
    box-shadow: ${props.theme.colors.shadowLg};
    backdrop-filter: blur(10px);
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: -8px;
      width: 0;
      height: 0;
      border-right: 8px solid ${props.theme.colors.card};
      border-top: 12px solid transparent;
      border-bottom: 12px solid transparent;
    }
  `}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowXl};
  }
  
  ${props => props.isLoading && `
    &::before {
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
      background-size: 200px 100%;
      animation: shimmer 1.5s infinite;
    }
    
    @keyframes shimmer {
      0% { background-position: -200px 0; }
      100% { background-position: calc(200px + 100%) 0; }
    }
  `}
  
  ${props => props.isError && `
    background: ${props.theme.colors.error};
    color: white;
    border-color: ${props.theme.colors.error};
    animation: shake 0.5s ease-in-out;
    
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px); }
      75% { transform: translateX(4px); }
    }
  `}
`;

const MessageMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: ${props => props.theme.colors.textMuted};
  ${props => props.sender === 'user' ? 'align-self: flex-end;' : 'align-self: flex-start;'}
  margin-bottom: 4px;
`;

const LocationChip = styled.button`
  background: ${props => props.theme.colors.info};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.theme.colors.accent};
    transform: translateY(-1px);
  }
`;

const MessageContent = styled.div`
  white-space: pre-wrap;
  
  strong {
    font-weight: 600;
    color: ${props => props.sender === 'user' ? 'rgba(255, 255, 255, 0.95)' : props.theme.colors.textPrimary};
  }
  
  em {
    font-style: italic;
    color: ${props => props.sender === 'user' ? 'rgba(255, 255, 255, 0.9)' : props.theme.colors.textSecondary};
  }
  
  /* Style markdown-like formatting */
  h3 {
    font-weight: 600;
    margin: 12px 0 8px 0;
    color: ${props => props.sender === 'user' ? 'white' : props.theme.colors.textPrimary};
    font-size: 16px;
  }
  
  ul {
    margin: 8px 0;
    padding-left: 20px;
    
    li {
      margin: 4px 0;
      color: ${props => props.sender === 'user' ? 'rgba(255, 255, 255, 0.9)' : props.theme.colors.textSecondary};
    }
  }
`;

function ChatMessage({ message, onLocationClick }) {
  const { colors } = useTheme();
  
  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <MessageContainer>
      <MessageMeta sender={message.sender}>
        <span>{message.sender === 'user' ? 'You' : 'AI Assistant'}</span>
        <span>•</span>
        <span>{formatTime(message.timestamp)}</span>
        {message.location && (
          <>
            <span>•</span>
            <LocationChip onClick={onLocationClick}>
              📍 {message.location.city || message.location.name}
            </LocationChip>
          </>
        )}
      </MessageMeta>
      
      <MessageBubble 
        sender={message.sender}
        isLoading={message.isLoading}
        isError={message.isError}
      >
        <MessageContent sender={message.sender}>
          {message.text}
        </MessageContent>
      </MessageBubble>
    </MessageContainer>
  );
}

export default ChatMessage;

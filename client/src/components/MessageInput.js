import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const InputContainer = styled.div`
  padding: 24px;
  border-top: 1px solid ${props => props.theme.colors.border};
  background: ${props => props.theme.colors.card};
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.gradientAccent};
    opacity: 0.3;
    z-index: -1;
  }
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  max-width: 800px;
  margin: 0 auto;
  position: relative;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 48px;
  max-height: 120px;
  padding: 14px 20px;
  border: 2px solid ${props => props.theme.colors.border};
  border-radius: 24px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 400;
  resize: none;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.textPrimary};
  box-shadow: ${props => props.theme.colors.shadowInset};
  
  &:focus {
    border-color: ${props => props.theme.colors.accent};
    box-shadow: 0 0 0 4px ${props => props.theme.colors.accent}20, ${props => props.theme.colors.glow};
    transform: translateY(-2px);
  }
  
  &:disabled {
    background: ${props => props.theme.colors.tertiary};
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  &::placeholder {
    color: ${props => props.theme.colors.textMuted};
    font-style: italic;
  }
`;

const SendButton = styled.button`
  background: ${props => props.theme.colors.gradient};
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  flex-shrink: 0;
  box-shadow: ${props => props.theme.colors.shadowLg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.5s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px) scale(1.05);
    box-shadow: ${props => props.theme.colors.glow};
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(-1px) scale(0.98);
  }
  
  &:disabled {
    background: ${props => props.theme.colors.border};
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    opacity: 0.6;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
  animation: slideInUp 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const SuggestionChip = styled.button`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  color: ${props => props.theme.colors.textSecondary};
  padding: 10px 18px;
  border-radius: 24px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.colors.gradient};
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    border-color: ${props => props.theme.colors.accent};
    color: ${props => props.theme.colors.textPrimary};
    box-shadow: ${props => props.theme.colors.shadowLg};
    
    &::before {
      opacity: 0.1;
    }
    color: ${props => props.theme.colors.accent};
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const suggestions = [
  "What can reduce heat in Phoenix?",
  "Cool down downtown Tokyo",
  "Heat solutions for Miami",
  "Barcelona urban cooling"
];

function MessageInput({ onSendMessage, disabled }) {
  const [message, setMessage] = useState('');
  const { colors } = useTheme();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (!disabled) {
      onSendMessage(suggestion);
    }
  };

  const adjustTextareaHeight = (e) => {
    const textarea = e.target;
    textarea.style.height = 'auto';
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px';
  };

  return (
    <InputContainer>
      {message === '' && (
        <SuggestionChips>
          {suggestions.map((suggestion, index) => (
            <SuggestionChip
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={disabled}
            >
              {suggestion}
            </SuggestionChip>
          ))}
        </SuggestionChips>
      )}
      
      <form onSubmit={handleSubmit}>
        <InputWrapper>
          <TextArea
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              adjustTextareaHeight(e);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Ask about urban heat solutions for any city..."
            disabled={disabled}
            rows={1}
          />
          <SendButton type="submit" disabled={disabled || !message.trim()}>
            {disabled ? '⏳' : '➤'}
          </SendButton>
        </InputWrapper>
      </form>
    </InputContainer>
  );
}

export default MessageInput;

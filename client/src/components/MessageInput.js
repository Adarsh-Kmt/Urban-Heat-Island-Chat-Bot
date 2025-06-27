import React, { useState } from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
  padding: 20px;
  border-top: 1px solid #e1e5e9;
  background: white;
`;

const InputWrapper = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-end;
  max-width: 800px;
  margin: 0 auto;
`;

const TextArea = styled.textarea`
  flex: 1;
  min-height: 44px;
  max-height: 120px;
  padding: 12px 16px;
  border: 2px solid #e1e5e9;
  border-radius: 22px;
  font-family: inherit;
  font-size: 16px;
  resize: none;
  outline: none;
  transition: border-color 0.2s ease;
  
  &:focus {
    border-color: #667eea;
  }
  
  &:disabled {
    background: #f5f5f5;
    cursor: not-allowed;
  }
  
  &::placeholder {
    color: #999;
  }
`;

const SendButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 50%;
  width: 44px;
  height: 44px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const SuggestionChips = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const SuggestionChip = styled.button`
  background: #f0f0f0;
  border: 1px solid #ddd;
  color: #666;
  padding: 8px 16px;
  border-radius: 20px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
  
  &:hover {
    background: #e0e0e0;
    border-color: #ccc;
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

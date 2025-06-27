import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounceIn = keyframes`
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.05); }
  70% { transform: scale(0.9); }
  100% { transform: scale(1); opacity: 1; }
`;

const ToggleContainer = styled.div`
  position: relative;
  width: 60px;
  height: 30px;
  border-radius: 15px;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #2c1810 0%, #1a1a2e 100%)' 
    : 'linear-gradient(135deg, #87ceeb 0%, #98d8e8 100%)'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.colors.shadowInset};
  
  &:hover {
    transform: scale(1.05);
    box-shadow: ${props => props.theme.colors.glow};
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ToggleSlider = styled.div`
  position: absolute;
  top: 2px;
  left: ${props => props.isDark ? '32px' : '2px'};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.isDark 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffed4a 100%)' 
    : 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-shadow: ${props => props.theme.colors.shadow};
  border: 1px solid ${props => props.isDark ? '#ffd700' : '#e2e8f0'};
  
  &::before {
    content: '${props => props.isDark ? '☀️' : '🌙'}';
    animation: ${bounceIn} 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  }
`;

const StarIcon = styled.div`
  position: absolute;
  color: #ffd700;
  font-size: 8px;
  opacity: ${props => props.isDark ? 1 : 0};
  transition: opacity 0.3s ease;
  
  &:nth-child(1) { top: 3px; left: 8px; animation-delay: 0ms; }
  &:nth-child(2) { top: 8px; left: 45px; animation-delay: 200ms; }
  &:nth-child(3) { top: 18px; left: 12px; animation-delay: 400ms; }
  
  ${props => props.isDark && `animation: ${rotate} 2s linear infinite;`}
`;

const CloudIcon = styled.div`
  position: absolute;
  color: #ffffff;
  font-size: 10px;
  opacity: ${props => props.isDark ? 0 : 1};
  transition: opacity 0.3s ease;
  
  &:nth-child(4) { top: 5px; right: 8px; }
  &:nth-child(5) { top: 12px; right: 18px; }
`;

function DarkModeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <ToggleContainer 
      isDark={isDarkMode} 
      onClick={toggleTheme}
      title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
    >
      <StarIcon isDark={isDarkMode}>⭐</StarIcon>
      <StarIcon isDark={isDarkMode}>✨</StarIcon>
      <StarIcon isDark={isDarkMode}>⭐</StarIcon>
      <CloudIcon isDark={isDarkMode}>☁️</CloudIcon>
      <CloudIcon isDark={isDarkMode}>☁️</CloudIcon>
      <ToggleSlider isDark={isDarkMode} />
    </ToggleContainer>
  );
}

export default DarkModeToggle;

import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';
import DarkModeToggle from './DarkModeToggle';

const HeaderContainer = styled.header`
  background: ${props => props.theme.colors.card};
  backdrop-filter: blur(20px);
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: ${props => props.theme.colors.shadowLg};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  z-index: 10;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.theme.colors.gradientAccent};
    opacity: 0.5;
    z-index: -1;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  
  .emoji {
    font-size: 28px;
    transition: transform 0.3s ease;
    filter: drop-shadow(0 2px 4px ${props => props.theme.colors.shadow});
  }
  
  &:hover .emoji {
    transform: scale(1.1) rotate(5deg);
  }
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  margin: 4px 0 0 40px;
  font-weight: 400;
  transition: color 0.3s ease;
  opacity: 0.9;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const ThemeToggle = styled.button`
  background: ${props => props.theme.colors.card};
  color: ${props => props.theme.colors.textPrimary};
  border: 1px solid ${props => props.theme.colors.border};
  padding: 12px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 18px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.colors.gradient};
    opacity: 0;
    transition: opacity 0.2s ease;
    border-radius: 12px;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.05);
    box-shadow: ${props => props.theme.colors.glow};
    border-color: ${props => props.theme.colors.accent};
    
    &::before {
      opacity: 0.1;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  span {
    position: relative;
    z-index: 1;
    transition: transform 0.3s ease;
  }
  
  &:hover span {
    transform: rotate(180deg);
  }
`;

const PanelButton = styled.button`
  background: ${props => props.active ? props.theme.colors.gradient : props.theme.colors.card};
  color: ${props => props.active ? 'white' : props.theme.colors.textPrimary};
  border: 1px solid ${props => props.active ? 'transparent' : props.theme.colors.border};
  padding: 12px 18px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${props => props.theme.colors.gradient};
    opacity: ${props => props.active ? 1 : 0};
    transition: opacity 0.2s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.colors.shadowLg};
    border-color: ${props => props.theme.colors.accent};
    
    &:not([data-active="true"])::before {
      opacity: 0.1;
    }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  span, .badge {
    position: relative;
    z-index: 1;
  }
`;

const Badge = styled.span`
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 4px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  animation: ${props => props.isNew ? 'pulse 2s infinite' : 'none'};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TitleSection = styled.div`
  flex: 1;
  animation: slideInDown 0.6s cubic-bezier(0.4, 0, 0.2, 1);
`;

function Header({ onTogglePanel, hasRecommendations }) {
  const { colors } = useTheme();
  
  return (
    <HeaderContainer>
      <TitleSection>
        <Title>
          <span className="emoji">🌡️</span>
          Urban Heat Island Assistant
        </Title>
        <Subtitle>
          AI-powered location-specific cooling recommendations for government policy
        </Subtitle>
      </TitleSection>
      
      <HeaderButtons>
        <DarkModeToggle />
        
        <PanelButton 
          onClick={onTogglePanel}
          active={hasRecommendations}
          disabled={!hasRecommendations}
          title={hasRecommendations ? "View analysis results" : "No analysis available"}
          data-active={hasRecommendations}
        >
          <span>📊 Analysis</span>
          {hasRecommendations && (
            <Badge isNew={hasRecommendations} className="badge">
              New
            </Badge>
          )}
        </PanelButton>
      </HeaderButtons>
    </HeaderContainer>
  );
}

export default Header;

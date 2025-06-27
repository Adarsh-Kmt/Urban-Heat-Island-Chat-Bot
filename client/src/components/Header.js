import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
`;

const Title = styled.h1`
  color: #333;
  font-size: 24px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
  
  .emoji {
    font-size: 28px;
  }
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 14px;
  margin: 4px 0 0 40px;
  font-weight: 400;
`;

const PanelButton = styled.button`
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  border: 1px solid ${props => props.active ? 'transparent' : '#e1e5e9'};
  padding: 10px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TitleSection = styled.div`
  flex: 1;
`;

function Header({ onTogglePanel, hasRecommendations }) {
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
      
      <PanelButton 
        onClick={onTogglePanel}
        active={hasRecommendations}
        disabled={!hasRecommendations}
        title={hasRecommendations ? "View analysis results" : "No analysis available"}
      >
        📊 Analysis
        {hasRecommendations && (
          <span style={{ 
            background: 'rgba(255, 255, 255, 0.3)', 
            padding: '2px 6px', 
            borderRadius: '10px', 
            fontSize: '12px' 
          }}>
            New
          </span>
        )}
      </PanelButton>
    </HeaderContainer>
  );
}

export default Header;

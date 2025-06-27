import React, { useState } from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Card = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: ${props => props.theme.colors.shadowLg};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${props => getEffectivenessGradient(props.score)};
  }
  
  &:hover {
    box-shadow: ${props => props.theme.colors.shadowXl}, ${props => props.theme.colors.glowSoft};
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.accent};
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  animation: slideInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const Title = styled.h4`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 18px;
  font-weight: 700;
  margin: 0;
  flex: 1;
  transition: all 0.3s ease;
  line-height: 1.4;
`;

const EffectivenessScore = styled.div`
  background: ${props => getEffectivenessGradient(props.score)};
  color: white;
  padding: 8px 16px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 700;
  min-width: 70px;
  text-align: center;
  box-shadow: ${props => props.theme.colors.shadowLg};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.3s ease;
  }
  
  &:hover::before {
    width: 100px;
    height: 100px;
  }
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 16px;
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
`;

const MetaValue = styled.span`
  font-size: 13px;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
  transition: color 0.3s ease;
`;

const Methods = styled.div`
  margin-bottom: 16px;
`;

const MethodsTitle = styled.h5`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
  transition: color 0.3s ease;
`;

const MethodsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const MethodTag = styled.span`
  background: ${props => props.theme.colors.secondary};
  color: ${props => props.theme.colors.textSecondary};
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

const Reasoning = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

const ReasoningText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
  transition: color 0.3s ease;
`;

const LocationSpecific = styled.div`
  margin-top: 12px;
`;

const LocationSpecificTitle = styled.h6`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 6px 0;
  transition: color 0.3s ease;
`;

const LocationSpecificList = styled.ul`
  margin: 0;
  padding-left: 16px;
  
  li {
    color: ${props => props.theme.colors.textSecondary};
    font-size: 12px;
    margin-bottom: 4px;
    transition: color 0.3s ease;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.accent};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 0;
  transition: all 0.2s ease;
  
  &:hover {
    text-decoration: underline;
    color: ${props => props.theme.colors.accentHover};
  }
`;

function getEffectivenessColor(score) {
  if (score >= 90) return '#4caf50';
  if (score >= 80) return '#8bc34a';
  if (score >= 70) return '#ffc107';
  if (score >= 60) return '#ff9800';
  return '#f44336';
}

function getEffectivenessGradient(score) {
  if (score >= 90) return 'linear-gradient(135deg, #4caf50 0%, #66bb6a 100%)';
  if (score >= 80) return 'linear-gradient(135deg, #8bc34a 0%, #9ccc65 100%)';
  if (score >= 70) return 'linear-gradient(135deg, #ffc107 0%, #ffcc02 100%)';
  if (score >= 60) return 'linear-gradient(135deg, #ff9800 0%, #ffb74d 100%)';
  return 'linear-gradient(135deg, #f44336 0%, #e57373 100%)';
}

function RecommendationCard({ recommendation }) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  return (
    <Card>
      <Header>
        <Title>{recommendation.strategy}</Title>
        <EffectivenessScore score={recommendation.effectiveness}>
          {recommendation.effectiveness}%
        </EffectivenessScore>
      </Header>
      
      <MetaInfo>
        <MetaItem>
          <MetaLabel>Cost Range</MetaLabel>
          <MetaValue>{recommendation.cost}</MetaValue>
        </MetaItem>
        
        <MetaItem>
          <MetaLabel>Timeframe</MetaLabel>
          <MetaValue>{recommendation.timeframe}</MetaValue>
        </MetaItem>
        
        <MetaItem>
          <MetaLabel>Overall Score</MetaLabel>
          <MetaValue>{recommendation.score}/100</MetaValue>
        </MetaItem>
      </MetaInfo>
      
      <Methods>
        <MethodsTitle>Implementation Methods</MethodsTitle>
        <MethodsList>
          {recommendation.methods.map((method, index) => (
            <MethodTag key={index}>{method}</MethodTag>
          ))}
        </MethodsList>
      </Methods>
      
      {expanded && (
        <>
          <Reasoning>
            <ReasoningText>{recommendation.reasoning}</ReasoningText>
          </Reasoning>
          
          {recommendation.locationSpecific && recommendation.locationSpecific.length > 0 && (
            <LocationSpecific>
              <LocationSpecificTitle>Location-Specific Considerations</LocationSpecificTitle>
              <LocationSpecificList>
                {recommendation.locationSpecific.map((note, index) => (
                  <li key={index}>{note}</li>
                ))}
              </LocationSpecificList>
            </LocationSpecific>
          )}
        </>
      )}
      
      <ExpandButton onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show less' : 'Show details & reasoning'}
      </ExpandButton>
    </Card>
  );
}

export default RecommendationCard;

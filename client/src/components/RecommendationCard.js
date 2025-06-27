import React, { useState } from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const Title = styled.h4`
  color: #333;
  font-size: 16px;
  font-weight: 600;
  margin: 0;
  flex: 1;
`;

const EffectivenessScore = styled.div`
  background: ${props => getEffectivenessColor(props.score)};
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 600;
  min-width: 60px;
  text-align: center;
`;

const MetaInfo = styled.div`
  display: flex;
  gap: 16px;
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
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const MetaValue = styled.span`
  font-size: 13px;
  color: #333;
  font-weight: 500;
`;

const Methods = styled.div`
  margin-bottom: 16px;
`;

const MethodsTitle = styled.h5`
  color: #333;
  font-size: 14px;
  font-weight: 600;
  margin: 0 0 8px 0;
`;

const MethodsList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`;

const MethodTag = styled.span`
  background: #f0f0f0;
  color: #666;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
`;

const Reasoning = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 12px;
`;

const ReasoningText = styled.p`
  color: #555;
  font-size: 13px;
  line-height: 1.5;
  margin: 0;
`;

const LocationSpecific = styled.div`
  margin-top: 12px;
`;

const LocationSpecificTitle = styled.h6`
  color: #333;
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 6px 0;
`;

const LocationSpecificList = styled.ul`
  margin: 0;
  padding-left: 16px;
  
  li {
    color: #666;
    font-size: 12px;
    margin-bottom: 4px;
  }
`;

const ExpandButton = styled.button`
  background: none;
  border: none;
  color: #667eea;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 0;
  
  &:hover {
    text-decoration: underline;
  }
`;

function getEffectivenessColor(score) {
  if (score >= 90) return '#4caf50';
  if (score >= 80) return '#8bc34a';
  if (score >= 70) return '#ffc107';
  if (score >= 60) return '#ff9800';
  return '#f44336';
}

function RecommendationCard({ recommendation }) {
  const [expanded, setExpanded] = useState(false);

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

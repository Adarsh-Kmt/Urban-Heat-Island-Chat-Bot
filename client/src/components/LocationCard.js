import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const Card = styled.div`
  background: ${props => props.theme.colors.card};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 24px;
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
    background: ${props => props.theme.colors.gradient};
  }
  
  &:hover {
    box-shadow: ${props => props.theme.colors.shadowXl}, ${props => props.theme.colors.glow};
    transform: translateY(-4px);
    border-color: ${props => props.theme.colors.accent};
  }
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  animation: slideInDown 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const LocationName = styled.h3`
  color: ${props => props.theme.colors.textPrimary};
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  transition: all 0.3s ease;
  background: ${props => props.theme.colors.gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LocationIcon = styled.span`
  font-size: 24px;
  filter: drop-shadow(0 2px 4px ${props => props.theme.colors.shadow});
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  animation: fadeIn 0.6s ease 0.2s both;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 12px;
  background: ${props => props.theme.colors.gradientAccent};
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    background: ${props => props.theme.colors.hover};
  }
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: ${props => props.theme.colors.textMuted};
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: ${props => props.theme.colors.textPrimary};
  font-weight: 500;
  transition: color 0.3s ease;
`;

const CoordinatesContainer = styled.div`
  background: ${props => props.theme.colors.secondary};
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
  border: 1px solid ${props => props.theme.colors.border};
  transition: all 0.3s ease;
`;

const Coordinates = styled.div`
  font-size: 13px;
  color: ${props => props.theme.colors.textSecondary};
  font-family: monospace;
  transition: color 0.3s ease;
`;

const ClimateTag = styled.span`
  display: inline-block;
  background: ${props => getClimateColor(props.climate)};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

const UrbanizationTag = styled.span`
  display: inline-block;
  background: ${props => getUrbanizationColor(props.level)};
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
`;

function getClimateColor(climate) {
  switch (climate) {
    case 'tropical': return '#ff6b6b';
    case 'subtropical': return '#ffa726';
    case 'temperate': return '#42a5f5';
    case 'polar': return '#78909c';
    default: return '#9e9e9e';
  }
}

function getUrbanizationColor(level) {
  switch (level) {
    case 'high': return '#d32f2f';
    case 'medium': return '#f57c00';
    case 'low': return '#388e3c';
    default: return '#9e9e9e';
  }
}

function LocationCard({ location }) {
  const { colors } = useTheme();
  
  if (!location) return null;

  return (
    <Card>
      <LocationHeader>
        <LocationIcon>📍</LocationIcon>
        <LocationName>{location.name}</LocationName>
      </LocationHeader>
      
      <InfoGrid>
        <InfoItem>
          <InfoLabel>Climate Zone</InfoLabel>
          <InfoValue>
            <ClimateTag climate={location.climate}>
              {location.climate}
            </ClimateTag>
          </InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Urbanization</InfoLabel>
          <InfoValue>
            <UrbanizationTag level={location.urbanization}>
              {location.urbanization}
            </UrbanizationTag>
          </InfoValue>
        </InfoItem>
        
        {location.city && (
          <InfoItem>
            <InfoLabel>City</InfoLabel>
            <InfoValue>{location.city}</InfoValue>
          </InfoItem>
        )}
        
        {location.state && (
          <InfoItem>
            <InfoLabel>State/Region</InfoLabel>
            <InfoValue>{location.state}</InfoValue>
          </InfoItem>
        )}
        
        <InfoItem>
          <InfoLabel>Country</InfoLabel>
          <InfoValue>{location.country}</InfoValue>
        </InfoItem>
        
        <InfoItem>
          <InfoLabel>Geography</InfoLabel>
          <InfoValue>
            {location.geography?.coastal ? '🌊 Coastal' : '🏔️ Inland'}
            {location.geography?.elevation && ` • ${location.geography.elevation} elevation`}
          </InfoValue>
        </InfoItem>
      </InfoGrid>
      
      <CoordinatesContainer>
        <InfoLabel>Coordinates</InfoLabel>
        <Coordinates>
          {location.coordinates?.latitude?.toFixed(4)}°N, {location.coordinates?.longitude?.toFixed(4)}°W
        </Coordinates>
      </CoordinatesContainer>
    </Card>
  );
}

export default LocationCard;

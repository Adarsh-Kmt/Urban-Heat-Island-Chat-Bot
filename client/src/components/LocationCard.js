import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const LocationHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
`;

const LocationName = styled.h3`
  color: #333;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const LocationIcon = styled.span`
  font-size: 20px;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const InfoLabel = styled.span`
  font-size: 12px;
  color: #666;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.span`
  font-size: 14px;
  color: #333;
  font-weight: 500;
`;

const CoordinatesContainer = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 8px;
  margin-top: 12px;
`;

const Coordinates = styled.div`
  font-size: 13px;
  color: #666;
  font-family: monospace;
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

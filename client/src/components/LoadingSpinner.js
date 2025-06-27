import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
`;

const wave = keyframes`
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-10px); }
`;

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  gap: 16px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid ${props => props.theme.colors.border};
  border-top: 3px solid ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid transparent;
    border-top: 2px solid ${props => props.theme.colors.accentLight};
    border-radius: 50%;
    animation: ${spin} 2s linear infinite reverse;
  }
`;

const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
`;

const Dot = styled.div`
  width: 8px;
  height: 8px;
  background: ${props => props.theme.colors.accent};
  border-radius: 50%;
  animation: ${wave} 1.4s ease-in-out infinite;
  animation-delay: ${props => props.delay}ms;
`;

const LoadingText = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  font-size: 14px;
  font-weight: 500;
  margin: 0;
  animation: ${pulse} 2s ease-in-out infinite;
`;

const ThinkingAnimation = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: ${props => props.theme.colors.card};
  border-radius: 20px;
  border: 1px solid ${props => props.theme.colors.border};
  box-shadow: ${props => props.theme.colors.shadow};
`;

const BrainIcon = styled.span`
  font-size: 16px;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

function LoadingSpinner({ text = "Loading...", variant = "default" }) {
  const theme = useTheme();

  if (variant === "thinking") {
    return (
      <ThinkingAnimation>
        <BrainIcon>🧠</BrainIcon>
        <LoadingText>{text}</LoadingText>
        <DotsContainer>
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </DotsContainer>
      </ThinkingAnimation>
    );
  }

  if (variant === "dots") {
    return (
      <SpinnerContainer>
        <DotsContainer>
          <Dot delay={0} />
          <Dot delay={200} />
          <Dot delay={400} />
        </DotsContainer>
        <LoadingText>{text}</LoadingText>
      </SpinnerContainer>
    );
  }

  return (
    <SpinnerContainer>
      <Spinner />
      <LoadingText>{text}</LoadingText>
    </SpinnerContainer>
  );
}

export default LoadingSpinner;

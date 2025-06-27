import React from 'react';
import styled, { keyframes } from 'styled-components';
import { useTheme } from '../contexts/ThemeContext';

const gradientShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(120deg); }
  66% { transform: translateY(5px) rotate(240deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 0.1; }
  50% { opacity: 0.3; }
`;

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  background: ${props => props.theme.colors.primary};
  transition: background 0.3s ease;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 200%;
  height: 200%;
  background: ${props => props.isDark 
    ? `radial-gradient(circle at 20% 80%, rgba(120, 0, 120, 0.1) 0%, transparent 50%),
       radial-gradient(circle at 80% 20%, rgba(0, 120, 200, 0.1) 0%, transparent 50%),
       radial-gradient(circle at 40% 40%, rgba(200, 0, 80, 0.1) 0%, transparent 50%),
       linear-gradient(135deg, #0f0f23 0%, #1a1a2e 25%, #16213e 50%, #0f0f23 75%, #1a1a2e 100%)`
    : `radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
       radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 50%),
       radial-gradient(circle at 40% 40%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
       linear-gradient(135deg, #ffffff 0%, #f8fafc 25%, #f1f5f9 50%, #ffffff 75%, #f8fafc 100%)`
  };
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
`;

const FloatingShape = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  border-radius: 50%;
  background: ${props => props.color};
  animation: ${float} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
  opacity: 0.1;
  filter: blur(1px);
`;

const PulsatingOrb = styled.div`
  position: absolute;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: ${props => props.isDark 
    ? 'radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 40%, transparent 70%)'
    : 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 40%, transparent 70%)'
  };
  top: ${props => props.top}%;
  left: ${props => props.left}%;
  animation: ${pulse} ${props => props.duration}s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

function AnimatedBackgroundComponent() {
  const { isDarkMode } = useTheme();

  const shapes = [
    { size: 60, color: isDarkMode ? 'rgba(139, 92, 246, 0.1)' : 'rgba(139, 92, 246, 0.05)', top: 10, left: 10, duration: 20, delay: 0 },
    { size: 80, color: isDarkMode ? 'rgba(99, 102, 241, 0.1)' : 'rgba(99, 102, 241, 0.05)', top: 70, left: 80, duration: 25, delay: 5 },
    { size: 40, color: isDarkMode ? 'rgba(59, 130, 246, 0.1)' : 'rgba(59, 130, 246, 0.05)', top: 30, left: 70, duration: 18, delay: 10 },
    { size: 100, color: isDarkMode ? 'rgba(168, 85, 247, 0.1)' : 'rgba(168, 85, 247, 0.05)', top: 60, left: 20, duration: 30, delay: 8 },
  ];

  const orbs = [
    { top: 20, left: 80, duration: 8, delay: 0 },
    { top: 80, left: 10, duration: 12, delay: 4 },
    { top: 50, left: 50, duration: 10, delay: 2 },
  ];

  return (
    <BackgroundContainer>
      <AnimatedBackground isDark={isDarkMode} />
      
      {shapes.map((shape, index) => (
        <FloatingShape
          key={`shape-${index}`}
          size={shape.size}
          color={shape.color}
          style={{ top: `${shape.top}%`, left: `${shape.left}%` }}
          duration={shape.duration}
          delay={shape.delay}
        />
      ))}
      
      {orbs.map((orb, index) => (
        <PulsatingOrb
          key={`orb-${index}`}
          isDark={isDarkMode}
          top={orb.top}
          left={orb.left}
          duration={orb.duration}
          delay={orb.delay}
        />
      ))}
    </BackgroundContainer>
  );
}

export default AnimatedBackgroundComponent;

import React, { useState, useRef, useEffect } from 'react';
import styled, { ThemeProvider as StyledThemeProvider } from 'styled-components';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import LocationCard from './components/LocationCard';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import AnimatedBackground from './components/AnimatedBackground';
import { sendMessage } from './services/api';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: ${props => props.theme.colors.primary};
  box-shadow: ${props => props.theme.colors.shadowXl};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 0;
  
  @media (min-width: 768px) {
    border-radius: 12px;
    margin: 20px auto;
    height: calc(100vh - 40px);
  }
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: ${props => props.theme.colors.primary};
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: ${props => props.theme.colors.gradientSubtle};
  
  /* Enhanced scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.tertiary};
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.theme.colors.accent};
      width: 8px;
    }
  }
  
  /* Smooth scroll behavior */
  scroll-behavior: smooth;
`;

const SidePanel = styled.div`
  position: fixed;
  right: ${props => props.isOpen ? '0' : '-420px'};
  top: 0;
  width: 420px;
  height: 100vh;
  background: ${props => props.theme.colors.card};
  backdrop-filter: blur(20px);
  border-left: 1px solid ${props => props.theme.colors.border};
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
  overflow-y: auto;
  padding: 24px;
  box-shadow: ${props => props.theme.colors.shadowXl};

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
  
  /* Enhanced scrollbar styling */
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.tertiary};
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 6px;
    transition: all 0.2s ease;
    
    &:hover {
      background: ${props => props.theme.colors.accent};
      width: 8px;
    }
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
  backdrop-filter: blur(4px);
  transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${props => props.theme.colors.textSecondary};
  
  h2 {
    color: ${props => props.theme.colors.textPrimary};
    margin-bottom: 16px;
    font-weight: 600;
    font-size: 28px;
    background: ${props => props.theme.colors.gradient};
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 12px;
    font-size: 16px;
  }
  
  .examples {
    margin-top: 30px;
    text-align: left;
    background: ${props => props.theme.colors.card};
    padding: 24px;
    border-radius: 16px;
    border: 1px solid ${props => props.theme.colors.border};
    box-shadow: ${props => props.theme.colors.shadow};
    
    h3 {
      color: ${props => props.theme.colors.textPrimary};
      margin-bottom: 16px;
      font-size: 18px;
      font-weight: 600;
    }
    
    ul {
      list-style: none;
      
      li {
        padding: 12px 0;
        padding-left: 28px;
        position: relative;
        color: ${props => props.theme.colors.textSecondary};
        font-size: 15px;
        line-height: 1.5;
        border-radius: 8px;
        transition: all 0.2s ease;
        
        &:hover {
          background: ${props => props.theme.colors.hover};
          padding-left: 32px;
        }
        
        &:before {
          content: "💡";
          position: absolute;
          left: 0;
          font-size: 16px;
        }
      }
    }
  }
`;

function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [currentRecommendations, setCurrentRecommendations] = useState([]);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    const userMessage = {
      id: Date.now(),
      text: message,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await sendMessage(message, messages);
      
      const botMessage = {
        id: Date.now() + 1,
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
        location: response.location,
        recommendations: response.recommendations,
        reasoning: response.reasoning,
        priorityActions: response.priorityActions
      };

      setMessages(prev => [...prev, botMessage]);
      
      if (response.location) {
        setCurrentLocation(response.location);
      }
      
      if (response.recommendations && response.recommendations.length > 0) {
        setCurrentRecommendations(response.recommendations);
        setSidePanelOpen(true);
      }

    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I encountered an error while processing your request. Please try again.",
        sender: 'bot',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const closeSidePanel = () => {
    setSidePanelOpen(false);
  };

  return (
    <ThemeProvider>
      <ThemedApp 
        messages={messages}
        isLoading={isLoading}
        currentLocation={currentLocation}
        currentRecommendations={currentRecommendations}
        sidePanelOpen={sidePanelOpen}
        messagesEndRef={messagesEndRef}
        handleSendMessage={handleSendMessage}
        closeSidePanel={closeSidePanel}
        setSidePanelOpen={setSidePanelOpen}
        setCurrentLocation={setCurrentLocation}
      />
    </ThemeProvider>
  );
}

function ThemedApp({ 
  messages, 
  isLoading, 
  currentLocation, 
  currentRecommendations, 
  sidePanelOpen, 
  messagesEndRef, 
  handleSendMessage, 
  closeSidePanel, 
  setSidePanelOpen,
  setCurrentLocation 
}) {
  const theme = useTheme();

  return (
    <StyledThemeProvider theme={theme}>
      <AppContent 
        messages={messages}
        isLoading={isLoading}
        currentLocation={currentLocation}
        currentRecommendations={currentRecommendations}
        sidePanelOpen={sidePanelOpen}
        messagesEndRef={messagesEndRef}
        handleSendMessage={handleSendMessage}
        closeSidePanel={closeSidePanel}
        setSidePanelOpen={setSidePanelOpen}
        setCurrentLocation={setCurrentLocation}
      />
    </StyledThemeProvider>
  );
}

function AppContent({ 
  messages, 
  isLoading, 
  currentLocation, 
  currentRecommendations, 
  sidePanelOpen, 
  messagesEndRef, 
  handleSendMessage, 
  closeSidePanel, 
  setSidePanelOpen,
  setCurrentLocation 
}) {

  return (
    <>
      <AnimatedBackground />
      <AppContainer>
      <Header 
        onTogglePanel={() => setSidePanelOpen(!sidePanelOpen)}
        hasRecommendations={currentRecommendations.length > 0}
      />
      
      <ChatContainer>
        <MessagesContainer>
          {messages.length === 0 && (
            <WelcomeMessage>
              <h2>🌡️ Urban Heat Island Assistant</h2>
              <p>I help governments and city planners identify the most effective strategies to reduce urban heat based on specific locations and environmental conditions.</p>
              <p>Ask me about any city or area, and I'll provide tailored recommendations that work best for that region's unique characteristics.</p>
              
              <div className="examples">
                <h3>Try asking me:</h3>
                <ul>
                  <li>"What can the government do to reduce heat in Phoenix, Arizona?"</li>
                  <li>"How can we cool down downtown Mumbai during summer?"</li>
                  <li>"What are the best strategies for reducing heat in coastal Miami?"</li>
                  <li>"How should Barcelona address urban heat islands?"</li>
                </ul>
              </div>
            </WelcomeMessage>
          )}
          
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              onLocationClick={() => message.location && setCurrentLocation(message.location)}
            />
          ))}
          
          {isLoading && (
            <ChatMessage 
              message={{
                id: 'loading',
                text: 'Analyzing location and generating recommendations...',
                sender: 'bot',
                timestamp: new Date(),
                isLoading: true
              }}
            />
          )}
          
          <div ref={messagesEndRef} />
        </MessagesContainer>
        
        <MessageInput onSendMessage={handleSendMessage} disabled={isLoading} />
      </ChatContainer>

      <Overlay show={sidePanelOpen} onClick={closeSidePanel} />
      
      <SidePanel isOpen={sidePanelOpen}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '20px' 
        }}>
          <h2 style={{ color: 'var(--text-primary, #333)', margin: 0 }}>Analysis Results</h2>
          <button 
            onClick={closeSidePanel}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: 'var(--text-muted, #666)',
              padding: '4px',
              borderRadius: '4px',
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => e.target.style.background = 'var(--hover, #f1f3f4)'}
            onMouseOut={(e) => e.target.style.background = 'none'}
          >
            ×
          </button>
        </div>
        
        {currentLocation && (
          <LocationCard location={currentLocation} />
        )}
        
        {currentRecommendations.length > 0 && (
          <div>
            <h3 style={{ 
              marginTop: '30px', 
              marginBottom: '15px', 
              color: 'var(--text-primary, #333)',
              fontSize: '18px',
              fontWeight: '600'
            }}>
              Recommendations
            </h3>
            {currentRecommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        )}
      </SidePanel>
      </AppContainer>
    </>
  );
}

export default App;

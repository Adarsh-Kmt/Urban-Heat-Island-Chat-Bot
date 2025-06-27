import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';
import ChatMessage from './components/ChatMessage';
import MessageInput from './components/MessageInput';
import LocationCard from './components/LocationCard';
import RecommendationCard from './components/RecommendationCard';
import Header from './components/Header';
import { sendMessage } from './services/api';

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  box-shadow: 0 0 50px rgba(0, 0, 0, 0.1);
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const MessagesContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SidePanel = styled.div`
  position: fixed;
  right: ${props => props.isOpen ? '0' : '-400px'};
  top: 0;
  width: 400px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e1e5e9;
  transition: right 0.3s ease;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;

  @media (max-width: 768px) {
    width: 100%;
    right: ${props => props.isOpen ? '0' : '-100%'};
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: ${props => props.show ? 'block' : 'none'};
`;

const WelcomeMessage = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: #666;
  
  h2 {
    color: #333;
    margin-bottom: 16px;
    font-weight: 600;
  }
  
  p {
    line-height: 1.6;
    margin-bottom: 12px;
  }
  
  .examples {
    margin-top: 30px;
    text-align: left;
    background: #f8f9fa;
    padding: 20px;
    border-radius: 12px;
    
    h3 {
      color: #333;
      margin-bottom: 12px;
      font-size: 16px;
    }
    
    ul {
      list-style: none;
      
      li {
        padding: 8px 0;
        padding-left: 20px;
        position: relative;
        
        &:before {
          content: "💡";
          position: absolute;
          left: 0;
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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Analysis Results</h2>
          <button 
            onClick={closeSidePanel}
            style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '24px', 
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ×
          </button>
        </div>
        
        {currentLocation && (
          <LocationCard location={currentLocation} />
        )}
        
        {currentRecommendations.length > 0 && (
          <div>
            <h3 style={{ marginTop: '30px', marginBottom: '15px', color: '#333' }}>
              Recommendations
            </h3>
            {currentRecommendations.map((rec, index) => (
              <RecommendationCard key={index} recommendation={rec} />
            ))}
          </div>
        )}
      </SidePanel>
    </AppContainer>
  );
}

export default App;

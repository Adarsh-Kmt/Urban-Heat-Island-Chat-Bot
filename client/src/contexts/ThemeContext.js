import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : true; // Default to dark mode
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    // Update CSS custom properties for smooth transitions
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? darkTheme : lightTheme
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

const darkTheme = {
  // Background colors
  primary: '#0a0a0a',
  secondary: '#111111',
  tertiary: '#1a1a1a',
  card: '#161616',
  hover: '#242424',
  cardHover: '#1e1e1e',
  
  // Text colors
  textPrimary: '#ffffff',
  textSecondary: '#d1d5db',
  textMuted: '#9ca3af',
  textInverse: '#000000',
  
  // Accent colors
  accent: '#8b5cf6',
  accentHover: '#7c3aed',
  accentLight: '#a78bfa',
  success: '#10b981',
  successLight: '#34d399',
  warning: '#f59e0b',
  warningLight: '#fbbf24',
  error: '#ef4444',
  errorLight: '#f87171',
  info: '#3b82f6',
  infoLight: '#60a5fa',
  
  // Border colors
  border: '#262626',
  borderLight: '#404040',
  borderAccent: '#4c1d95',
  
  // Message colors
  userMessage: '#8b5cf6',
  userMessageBg: '#2d1b69',
  botMessage: '#374151',
  botMessageBg: '#1f2937',
  
  // Status colors
  online: '#10b981',
  away: '#f59e0b',
  busy: '#ef4444',
  
  // Gradients
  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  gradientDark: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  gradientSubtle: 'linear-gradient(135deg, #111111 0%, #1a1a1a 100%)',
  gradientAccent: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(99, 102, 241, 0.1) 100%)',
  
  // Shadows and glows
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.4)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
  shadowInset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.3)',
  glow: '0 0 20px rgba(139, 92, 246, 0.3)',
  glowSoft: '0 0 10px rgba(139, 92, 246, 0.2)'
};

const lightTheme = {
  // Background colors
  primary: '#ffffff',
  secondary: '#f8fafc',
  tertiary: '#f1f5f9',
  card: '#ffffff',
  hover: '#f8fafc',
  cardHover: '#f1f5f9',
  
  // Text colors
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  textInverse: '#ffffff',
  
  // Accent colors
  accent: '#8b5cf6',
  accentHover: '#7c3aed',
  accentLight: '#a78bfa',
  success: '#059669',
  successLight: '#10b981',
  warning: '#d97706',
  warningLight: '#f59e0b',
  error: '#dc2626',
  errorLight: '#ef4444',
  info: '#2563eb',
  infoLight: '#3b82f6',
  
  // Border colors
  border: '#e2e8f0',
  borderLight: '#f1f5f9',
  borderAccent: '#ddd6fe',
  
  // Message colors
  userMessage: '#8b5cf6',
  userMessageBg: '#f3f4f6',
  botMessage: '#f8fafc',
  botMessageBg: '#ffffff',
  
  // Status colors
  online: '#059669',
  away: '#d97706',
  busy: '#dc2626',
  
  // Gradients
  gradient: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
  gradientDark: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  gradientSubtle: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
  gradientAccent: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(99, 102, 241, 0.05) 100%)',
  
  // Shadows and glows
  shadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowXl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  shadowInset: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  glow: '0 0 20px rgba(139, 92, 246, 0.1)',
  glowSoft: '0 0 10px rgba(139, 92, 246, 0.05)'
};

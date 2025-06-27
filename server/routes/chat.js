const express = require('express');
const router = express.Router();
const analysisEngine = require('../services/analysisEngine');
const geocodingService = require('../services/geocodingService');

// Main chat endpoint
router.post('/message', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Valid message is required' });
    }

    // Extract location from message
    const location = await geocodingService.extractLocation(message);
    
    if (!location) {
      return res.json({
        response: "I couldn't identify a specific location in your message. Please provide a city name, address, or specific area you'd like me to analyze for urban heat island effects. For example: 'What can the government do to reduce heat in Phoenix, Arizona?' or 'How can we cool down downtown Mumbai?'",
        location: null,
        recommendations: []
      });
    }

    // Get location details and environmental data
    const locationData = await geocodingService.getLocationDetails(location);
    
    // Generate AI-powered recommendations
    const analysis = await analysisEngine.analyzeLocation(locationData, message, conversationHistory);

    res.json({
      response: analysis.response,
      location: locationData,
      recommendations: analysis.recommendations,
      reasoning: analysis.reasoning,
      priorityActions: analysis.priorityActions
    });

  } catch (error) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your request. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Location analysis endpoint
router.post('/analyze-location', async (req, res) => {
  try {
    const { locationName } = req.body;

    if (!locationName) {
      return res.status(400).json({ error: 'Location name is required' });
    }

    const locationData = await geocodingService.getLocationDetails(locationName);
    const quickAnalysis = await analysisEngine.getQuickLocationAnalysis(locationData);

    res.json({
      location: locationData,
      analysis: quickAnalysis
    });

  } catch (error) {
    console.error('Location analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze location',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;

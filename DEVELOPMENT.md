# Urban Heat Island Chatbot - Development Guide

## Architecture Overview

### Backend Components

1. **Analysis Engine** (`server/services/analysisEngine.js`)
   - Core logic for evaluating urban heat mitigation strategies
   - Location-specific effectiveness scoring
   - Optional OpenAI integration for enhanced responses
   - Strategy database with climate-specific effectiveness ratings

2. **Geocoding Service** (`server/services/geocodingService.js`)
   - Location extraction from natural language
   - Geographic data enrichment (climate, urbanization, coastal status)
   - OpenStreetMap integration for reliable geocoding

3. **API Routes** (`server/routes/chat.js`)
   - Chat message processing
   - Location analysis endpoints
   - Error handling and validation

### Frontend Components

1. **Chat Interface** (`client/src/App.js`)
   - Real-time messaging with the chatbot
   - Conversation history management
   - Side panel for analysis results

2. **UI Components**
   - `ChatMessage`: Individual message bubbles with markdown support
   - `LocationCard`: Geographic and climatic information display
   - `RecommendationCard`: Detailed strategy cards with effectiveness scores
   - `MessageInput`: Smart input with suggestions and auto-resize

## Key Features

### 1. Location Intelligence
- Automatic location extraction from natural language
- Geographic context analysis (coastal vs inland, elevation)
- Climate zone classification (tropical, subtropical, temperate, polar)
- Urbanization level assessment

### 2. Strategy Evaluation
The system evaluates six main categories of urban heat mitigation:

```javascript
const strategies = {
  'green-infrastructure': {
    effectiveness: { tropical: 0.9, subtropical: 0.8, temperate: 0.7, polar: 0.4 },
    methods: ['urban forests', 'green roofs', 'green walls', 'parks'],
    costRange: 'medium-high',
    implementationTime: 'long-term'
  },
  // ... other strategies
};
```

### 3. Contextual Recommendations
- Climate-appropriate solutions
- Geography-specific considerations
- Urbanization-level adjustments
- Cost and timeframe analysis

## Development Workflow

### Adding New Strategies
1. Add strategy to `strategies` object in `analysisEngine.js`
2. Define climate-specific effectiveness ratings
3. Add location-specific reasoning logic
4. Update the scoring algorithm if needed

### Enhancing Location Detection
1. Modify regex patterns in `geocodingService.js`
2. Add new geographic inference rules
3. Update climate zone boundaries
4. Enhance urbanization detection

### Improving UI
1. Add new components in `client/src/components/`
2. Update styling with styled-components
3. Add new API endpoints if needed
4. Test responsive design

## Configuration Options

### Environment Variables
```bash
NODE_ENV=development          # Environment mode
PORT=5001                    # Server port
CLIENT_URL=http://localhost:3000  # Frontend URL for CORS
OPENAI_API_KEY=sk-...        # Optional OpenAI API key
RATE_LIMIT_WINDOW_MS=900000  # Rate limiting window
RATE_LIMIT_MAX_REQUESTS=100  # Rate limiting max requests
```

### Customizing Strategy Database
The strategies can be customized by modifying the `strategies` object in `analysisEngine.js`:

```javascript
'new-strategy': {
  name: 'New Cooling Strategy',
  methods: ['method1', 'method2'],
  effectiveness: {
    tropical: 0.8,
    subtropical: 0.7,
    temperate: 0.6,
    polar: 0.3
  },
  costRange: 'medium',
  implementationTime: 'medium-term'
}
```

## API Reference

### POST `/api/chat/message`
Send a message to the chatbot.

**Request:**
```json
{
  "message": "What can reduce heat in Tokyo?",
  "conversationHistory": []
}
```

**Response:**
```json
{
  "response": "Detailed government recommendations...",
  "location": { "name": "Tokyo", "climate": "temperate", ... },
  "recommendations": [...],
  "reasoning": [...],
  "priorityActions": [...]
}
```

### POST `/api/chat/analyze-location`
Get quick analysis for a specific location.

**Request:**
```json
{
  "locationName": "Tokyo, Japan"
}
```

### GET `/health`
Health check endpoint.

## Testing

### Manual Testing Examples
```bash
# Test health endpoint
curl http://localhost:5001/health

# Test chat with different locations
curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "How to cool Phoenix?"}'

curl -X POST http://localhost:5001/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"message": "What works for Mumbai heat?"}'
```

### Frontend Testing
1. Open http://localhost:3000
2. Try example queries:
   - "What can the government do to reduce heat in Phoenix, Arizona?"
   - "How can we cool down downtown Mumbai?"
   - "What are the best strategies for reducing heat in coastal Miami?"

## Deployment Considerations

### Production Setup
1. Set `NODE_ENV=production`
2. Build the React app: `cd client && npm run build`
3. Serve static files from the build directory
4. Use a reverse proxy (nginx) for better performance
5. Set up SSL/TLS certificates
6. Configure proper logging and monitoring

### Scaling
- Add Redis for session management
- Implement request caching
- Use a CDN for static assets
- Consider horizontal scaling with load balancers

## Future Enhancements

### Data Sources
- Integrate real climate data APIs
- Add real-time weather information
- Connect to urban planning databases
- Include local government policy databases

### AI Enhancements
- Fine-tune models on urban planning data
- Add image analysis for satellite imagery
- Implement predictive modeling for heat island effects
- Add multilingual support

### User Experience
- Add user accounts and saved queries
- Implement voice input/output
- Add interactive maps
- Create mobile app versions

### Analytics
- Track common queries and locations
- Monitor recommendation effectiveness
- A/B test different response formats
- Collect user feedback

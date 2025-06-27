# Urban Heat Island Chatbot 🌡️

An AI-powered chatbot that provides location-specific government recommendations for reducing urban heat islands. The chatbot analyzes geographic, climatic, and urban characteristics to suggest the most effective cooling strategies for any given location.

## Features

- 📍 **Location-aware Analysis**: Automatically extracts and analyzes locations from user queries
- 🌡️ **Climate-specific Recommendations**: Tailors suggestions based on climate zones (tropical, subtropical, temperate, polar)
- 🏙️ **Urban Context Consideration**: Factors in urbanization level and geographic features
- 🎯 **Government-focused**: Provides actionable policy recommendations rather than generic advice
- 💡 **Reasoning Explanations**: Explains why certain strategies work better in specific locations
- 📊 **Visual Analysis Dashboard**: Interactive sidebar showing location details and recommendations

## How It Works

1. **User Input**: Ask about any city or location (e.g., "What can the government do to reduce heat in Phoenix, Arizona?")
2. **Location Processing**: The system identifies and geocodes the location
3. **Environmental Analysis**: Analyzes climate, geography, and urban characteristics
4. **Strategy Evaluation**: Scores different cooling strategies based on location-specific effectiveness
5. **Recommendation Generation**: Provides prioritized, actionable government recommendations with reasoning

## Architecture

### Backend (Node.js/Express)
- **Analysis Engine**: Core logic for evaluating cooling strategies
- **Geocoding Service**: Location identification and environmental data inference
- **API Routes**: RESTful endpoints for chat and location analysis
- **Optional AI Enhancement**: OpenAI integration for enhanced responses

### Frontend (React)
- **Chat Interface**: Real-time conversation with the chatbot
- **Analysis Dashboard**: Visual display of location data and recommendations
- **Responsive Design**: Works on desktop and mobile devices

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup

1. **Clone and install dependencies**:
```bash
# Install server dependencies
npm install

# Install client dependencies
cd client && npm install
```

2. **Environment Configuration**:
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Optional: Add OpenAI API key for enhanced AI responses
```

3. **Start the application**:
```bash
# Development mode (runs both server and client)
npm run dev

# Or run separately:
npm run server  # Starts backend on port 5000
npm run client  # Starts frontend on port 3000
```

## Usage Examples

### Basic Queries
- "What can the government do to reduce heat in Phoenix, Arizona?"
- "How can we cool down downtown Mumbai during summer?"
- "What are the best strategies for reducing heat in coastal Miami?"
- "How should Barcelona address urban heat islands?"

### Expected Response Features
- **Location-specific strategies** prioritized by effectiveness
- **Reasoning** for why certain methods work better
- **Implementation details** including costs and timeframes
- **Geographic considerations** (coastal vs inland, elevation, etc.)
- **Climate-appropriate solutions** (tropical vs temperate strategies)

## Cooling Strategies Database

The system evaluates six main strategy categories:

1. **Green Infrastructure**: Urban forests, green roofs, parks
2. **Cool Pavements & Surfaces**: Reflective materials, permeable surfaces
3. **Water Features**: Fountains, retention ponds, misting systems
4. **Building Design Standards**: Cool roofs, energy efficiency
5. **Urban Planning Reforms**: Zoning, density management, wind corridors
6. **Transportation Solutions**: Public transit, bike lanes, traffic reduction

Each strategy is scored based on:
- Climate zone effectiveness
- Geographic compatibility
- Urbanization level appropriateness
- Implementation feasibility

## API Endpoints

### POST `/api/chat/message`
Send a message to the chatbot
```json
{
  "message": "What can reduce heat in Tokyo?",
  "conversationHistory": []
}
```

### POST `/api/chat/analyze-location`
Get quick analysis for a specific location
```json
{
  "locationName": "Tokyo, Japan"
}
```

### GET `/health`
Health check endpoint

## Configuration

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 5000)
- `CLIENT_URL`: Frontend URL for CORS
- `OPENAI_API_KEY`: Optional OpenAI API key for enhanced responses

### Customization
- Modify strategy database in `server/services/analysisEngine.js`
- Add new location detection patterns in `server/services/geocodingService.js`
- Customize UI components in `client/src/components/`

## Deployment

### Production Build
```bash
# Build client
cd client && npm run build

# Start production server
NODE_ENV=production npm start
```

### Docker (Optional)
```bash
# Build and run with Docker
docker build -t urban-heat-chatbot .
docker run -p 5000:5000 urban-heat-chatbot
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - feel free to use this project for research, government initiatives, or commercial applications.

## Acknowledgments

- Inspired by the urban heat island research at [urbanheat.app](http://urbanheat.app/)
- Built to support evidence-based urban climate policy decisions
- Designed for government planners, researchers, and climate adaptation professionals
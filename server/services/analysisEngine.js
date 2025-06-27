const OpenAI = require('openai');

class AnalysisEngine {
  constructor() {
    this.openai = process.env.OPENAI_API_KEY ? new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    }) : null;
    
    // Heat mitigation strategies database
    this.strategies = {
      'green-infrastructure': {
        name: 'Green Infrastructure',
        methods: ['urban forests', 'green roofs', 'green walls', 'parks', 'urban gardens'],
        effectiveness: {
          tropical: 0.9,
          subtropical: 0.8,
          temperate: 0.7,
          polar: 0.4
        },
        costRange: 'medium-high',
        implementationTime: 'long-term'
      },
      'cool-pavements': {
        name: 'Cool Pavements & Surfaces',
        methods: ['reflective pavements', 'permeable surfaces', 'light-colored materials'],
        effectiveness: {
          tropical: 0.8,
          subtropical: 0.9,
          temperate: 0.7,
          polar: 0.3
        },
        costRange: 'medium',
        implementationTime: 'medium-term'
      },
      'water-features': {
        name: 'Water Features & Management',
        methods: ['fountains', 'water bodies', 'misting systems', 'retention ponds'],
        effectiveness: {
          tropical: 0.7,
          subtropical: 0.8,
          temperate: 0.6,
          polar: 0.2
        },
        costRange: 'high',
        implementationTime: 'medium-term'
      },
      'building-design': {
        name: 'Building Design Standards',
        methods: ['cool roofs', 'energy-efficient buildings', 'building orientation', 'shading'],
        effectiveness: {
          tropical: 0.8,
          subtropical: 0.8,
          temperate: 0.6,
          polar: 0.5
        },
        costRange: 'medium',
        implementationTime: 'long-term'
      },
      'urban-planning': {
        name: 'Urban Planning Reforms',
        methods: ['zoning changes', 'density management', 'wind corridors', 'mixed-use development'],
        effectiveness: {
          tropical: 0.7,
          subtropical: 0.7,
          temperate: 0.8,
          polar: 0.6
        },
        costRange: 'low-medium',
        implementationTime: 'long-term'
      },
      'transportation': {
        name: 'Transportation Solutions',
        methods: ['public transit', 'bike lanes', 'electric vehicles', 'traffic reduction'],
        effectiveness: {
          tropical: 0.6,
          subtropical: 0.6,
          temperate: 0.7,
          polar: 0.5
        },
        costRange: 'high',
        implementationTime: 'long-term'
      }
    };
  }

  async analyzeLocation(locationData, userMessage, conversationHistory = []) {
    try {
      // Get base recommendations based on location characteristics
      const baseRecommendations = this.getLocationSpecificRecommendations(locationData);
      
      // Generate AI-enhanced response if OpenAI is available
      let aiResponse = null;
      if (this.openai) {
        aiResponse = await this.generateAIResponse(locationData, userMessage, baseRecommendations, conversationHistory);
      }

      return {
        response: aiResponse || this.generateFallbackResponse(locationData, baseRecommendations),
        recommendations: baseRecommendations.recommendations,
        reasoning: baseRecommendations.reasoning,
        priorityActions: baseRecommendations.priorityActions
      };
    } catch (error) {
      console.error('Analysis engine error:', error);
      throw error;
    }
  }

  getLocationSpecificRecommendations(locationData) {
    const climate = locationData.climate;
    const urbanization = locationData.urbanization;
    const geography = locationData.geography;
    
    const recommendations = [];
    const reasoning = [];
    const priorityActions = [];

    // Analyze each strategy based on location characteristics
    Object.entries(this.strategies).forEach(([key, strategy]) => {
      const effectiveness = strategy.effectiveness[climate] || 0.5;
      const score = this.calculateStrategyScore(strategy, locationData);
      
      if (score > 0.6) {
        const recommendation = {
          strategy: strategy.name,
          methods: strategy.methods,
          effectiveness: Math.round(effectiveness * 100),
          score: Math.round(score * 100),
          cost: strategy.costRange,
          timeframe: strategy.implementationTime,
          reasoning: this.getStrategyReasoning(key, locationData),
          locationSpecific: this.getLocationSpecificNotes(key, locationData)
        };
        
        recommendations.push(recommendation);
        
        if (score > 0.8) {
          priorityActions.push({
            action: strategy.name,
            reason: `Highly effective for ${climate} climate${geography.coastal ? ' coastal' : ''} areas`,
            urgency: 'high'
          });
        }
      }
    });

    // Sort recommendations by score
    recommendations.sort((a, b) => b.score - a.score);

    return {
      recommendations: recommendations.slice(0, 6), // Top 6 recommendations
      reasoning: this.generateLocationReasoning(locationData),
      priorityActions: priorityActions.slice(0, 3) // Top 3 priority actions
    };
  }

  calculateStrategyScore(strategy, locationData) {
    let score = strategy.effectiveness[locationData.climate] || 0.5;
    
    // Adjust for geography
    if (locationData.geography.coastal && strategy.name.includes('Water')) {
      score += 0.2;
    }
    
    if (locationData.geography.elevation === 'high' && strategy.name.includes('Green')) {
      score -= 0.1; // Slightly less effective at high elevation
    }
    
    // Adjust for urbanization level
    if (locationData.urbanization === 'high') {
      if (strategy.name.includes('Building') || strategy.name.includes('Planning')) {
        score += 0.15;
      }
    }
    
    return Math.min(score, 1.0);
  }

  getStrategyReasoning(strategyKey, locationData) {
    const climate = locationData.climate;
    const geography = locationData.geography;
    const urbanization = locationData.urbanization;
    
    const reasoningMap = {
      'green-infrastructure': `Green infrastructure is ${climate === 'tropical' ? 'extremely' : climate === 'subtropical' ? 'highly' : 'moderately'} effective in ${climate} climates due to evapotranspiration cooling effects. ${urbanization === 'high' ? 'Dense urban areas particularly benefit from increased vegetation.' : ''}`,
      
      'cool-pavements': `Cool pavements work exceptionally well in ${climate} regions where surface temperatures are a major heat contributor. ${geography.coastal ? 'Coastal locations benefit from additional ocean breeze interaction with cooler surfaces.' : 'Inland areas see maximum benefit from reflective surfaces.'}`,
      
      'water-features': `Water features provide evaporative cooling, most effective in ${climate} climates. ${geography.coastal ? 'Being coastal, this area already has some humidity, but strategic water placement can enhance cooling.' : 'In this inland location, water features can significantly improve local humidity and cooling.'}`,
      
      'building-design': `Building design modifications are universally beneficial but particularly important in ${urbanization === 'high' ? 'densely developed' : 'developing'} areas. Cool roofs are essential in ${climate} climates to reduce heat absorption.`,
      
      'urban-planning': `Urban planning interventions are crucial for ${urbanization === 'high' ? 'already dense' : 'growing'} urban areas. ${geography.coastal ? 'Coastal wind patterns should be incorporated into planning.' : 'Inland areas need careful consideration of heat island formation.'}`,
      
      'transportation': `Transportation solutions reduce heat generation from vehicles and infrastructure. ${urbanization === 'high' ? 'High-density areas see maximum benefit from transit improvements.' : 'Growing areas can prevent future heat island intensification.'}`
    };
    
    return reasoningMap[strategyKey] || 'This strategy provides general urban heat reduction benefits.';
  }

  getLocationSpecificNotes(strategyKey, locationData) {
    const notes = [];
    
    if (locationData.geography.coastal) {
      notes.push('Consider salt-tolerance for coastal installations');
      if (strategyKey === 'green-infrastructure') {
        notes.push('Select native coastal vegetation for best results');
      }
    }
    
    if (locationData.climate === 'tropical') {
      if (strategyKey === 'green-infrastructure') {
        notes.push('Focus on dense canopy trees for maximum shade');
      }
      if (strategyKey === 'water-features') {
        notes.push('Design for high humidity management');
      }
    }
    
    if (locationData.urbanization === 'high') {
      notes.push('Prioritize space-efficient implementations');
      if (strategyKey === 'green-infrastructure') {
        notes.push('Emphasize vertical green solutions (walls, roofs)');
      }
    }
    
    return notes;
  }

  generateLocationReasoning(locationData) {
    return [
      `${locationData.name} has a ${locationData.climate} climate, which affects the effectiveness of different cooling strategies.`,
      `As a ${locationData.urbanization}-urbanization area, certain implementation approaches will be more practical.`,
      locationData.geography.coastal ? 'The coastal location provides opportunities for ocean breeze utilization and presents salt-air considerations.' : 'The inland location requires strategies that don\'t rely on ocean effects.',
      `Regional factors in ${locationData.country} may influence policy implementation and available resources.`
    ];
  }

  async generateAIResponse(locationData, userMessage, baseRecommendations, conversationHistory) {
    try {
      const systemPrompt = `You are an expert urban climatologist and policy advisor specializing in urban heat island mitigation. Provide specific, actionable government recommendations for reducing urban heat based on the location's unique characteristics.

Key principles:
- Be location-specific, not generic
- Explain WHY certain methods work better in this location
- Consider local climate, geography, and urban development
- Provide practical government actions and policies
- Address why some common methods might NOT work well here`;

      const userPrompt = `Location: ${locationData.name}
Climate: ${locationData.climate}
Urbanization Level: ${locationData.urbanization}
Geography: ${locationData.geography.coastal ? 'Coastal' : 'Inland'}, ${locationData.geography.elevation} elevation
Country: ${locationData.country}

User asked: "${userMessage}"

Based on the analysis, here are the top recommendations:
${baseRecommendations.recommendations.slice(0, 3).map(rec => 
  `- ${rec.strategy}: ${rec.effectiveness}% effective (${rec.reasoning})`
).join('\n')}

Please provide a comprehensive response explaining what the government should do to reduce urban heat in this specific location, with clear reasoning for why these approaches work best here and why others might be less effective.`;

      const response = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemPrompt },
          ...conversationHistory.slice(-6), // Last 3 exchanges
          { role: "user", content: userPrompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API error:', error);
      return null;
    }
  }

  generateFallbackResponse(locationData, baseRecommendations) {
    const topRec = baseRecommendations.recommendations[0];
    const climate = locationData.climate;
    const isCoastal = locationData.geography.coastal;
    
    return `Based on my analysis of ${locationData.name}, here are the most effective government actions to reduce urban heat:

**Priority #1: ${topRec.strategy}** (${topRec.effectiveness}% effectiveness)
${topRec.reasoning}

**Why this works specifically for ${locationData.name}:**
- ${climate.charAt(0).toUpperCase() + climate.slice(1)} climate makes this approach highly effective
- ${isCoastal ? 'Coastal location provides additional benefits' : 'Inland location requires focused implementation'}
- ${locationData.urbanization === 'high' ? 'High urban density requires strategic placement' : 'Growing urban area can implement preventive measures'}

**Recommended Government Actions:**
${topRec.methods.slice(0, 3).map(method => `• Implement ${method} through zoning requirements and incentives`).join('\n')}

**Additional Considerations:**
${topRec.locationSpecific.map(note => `• ${note}`).join('\n')}

The government should focus on these location-specific strategies rather than generic approaches, as they're tailored to ${locationData.name}'s unique environmental conditions.`;
  }

  async getQuickLocationAnalysis(locationData) {
    const topStrategies = this.getLocationSpecificRecommendations(locationData);
    
    return {
      climate: locationData.climate,
      heatRisk: this.assessHeatRisk(locationData),
      topStrategies: topStrategies.recommendations.slice(0, 3),
      challenges: this.identifyImplementationChallenges(locationData),
      opportunities: this.identifyOpportunities(locationData)
    };
  }

  assessHeatRisk(locationData) {
    let risk = 'medium';
    
    if (locationData.climate === 'tropical' || locationData.climate === 'subtropical') {
      risk = 'high';
    }
    
    if (locationData.urbanization === 'high') {
      risk = risk === 'high' ? 'very-high' : 'high';
    }
    
    if (!locationData.geography.coastal && locationData.geography.elevation === 'low-medium') {
      risk = risk === 'very-high' ? 'extreme' : 'high';
    }
    
    return risk;
  }

  identifyImplementationChallenges(locationData) {
    const challenges = [];
    
    if (locationData.urbanization === 'high') {
      challenges.push('Limited space for new green infrastructure');
      challenges.push('High cost of retrofitting existing buildings');
    }
    
    if (locationData.geography.coastal) {
      challenges.push('Salt air corrosion concerns');
      challenges.push('Hurricane/storm resilience requirements');
    }
    
    if (locationData.climate === 'tropical') {
      challenges.push('High maintenance needs for vegetation');
      challenges.push('Drainage considerations for water features');
    }
    
    return challenges;
  }

  identifyOpportunities(locationData) {
    const opportunities = [];
    
    if (locationData.geography.coastal) {
      opportunities.push('Utilize ocean breezes for natural cooling');
      opportunities.push('Implement seawater-based cooling systems');
    }
    
    if (locationData.urbanization === 'medium') {
      opportunities.push('Prevent heat island formation through proactive planning');
      opportunities.push('Integrate cooling strategies into new development');
    }
    
    if (locationData.climate === 'temperate') {
      opportunities.push('Seasonal strategies for maximum year-round effectiveness');
    }
    
    return opportunities;
  }
}

module.exports = new AnalysisEngine();

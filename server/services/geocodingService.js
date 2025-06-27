const NodeGeocoder = require('node-geocoder');

class GeocodingService {
  constructor() {
    this.geocoder = NodeGeocoder({
      provider: 'openstreetmap',
      httpAdapter: 'https',
      formatter: null
    });
  }

  // Extract location from user message
  async extractLocation(message) {
    // Simple regex patterns to identify locations
    const locationPatterns = [
      /in\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)*)/gi,
      /at\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)*)/gi,
      /for\s+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][a-z]+)*)/gi,
      /([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*(?:,\s*[A-Z][A-Z]|,\s*[A-Z][a-z]+)+)/g
    ];

    for (const pattern of locationPatterns) {
      const matches = message.match(pattern);
      if (matches && matches.length > 0) {
        let location = matches[0].replace(/^(in|at|for)\s+/i, '').trim();
        
        // Try to geocode this location
        try {
          const geocodeResult = await this.geocoder.geocode(location);
          if (geocodeResult && geocodeResult.length > 0) {
            return location;
          }
        } catch (error) {
          console.warn(`Failed to geocode extracted location: ${location}`);
        }
      }
    }

    return null;
  }

  // Get detailed location information
  async getLocationDetails(locationName) {
    try {
      const results = await this.geocoder.geocode(locationName);
      
      if (!results || results.length === 0) {
        throw new Error(`Location "${locationName}" not found`);
      }

      const location = results[0];
      
      return {
        name: location.formattedAddress || locationName,
        coordinates: {
          latitude: location.latitude,
          longitude: location.longitude
        },
        city: location.city,
        state: location.administrativeLevels?.level1short || location.state,
        country: location.country,
        countryCode: location.countryCode,
        zipcode: location.zipcode,
        streetName: location.streetName,
        neighborhood: location.extra?.neighborhood,
        climate: this.inferClimateZone(location.latitude, location.longitude, location.country),
        urbanization: this.inferUrbanizationLevel(location.city, location.country),
        geography: this.inferGeography(location.latitude, location.longitude)
      };
    } catch (error) {
      console.error('Geocoding error:', error);
      throw new Error(`Failed to get location details for "${locationName}"`);
    }
  }

  // Infer climate zone based on coordinates
  inferClimateZone(latitude, longitude, country) {
    const lat = Math.abs(latitude);
    
    if (lat <= 23.5) {
      return 'tropical';
    } else if (lat <= 35) {
      return 'subtropical';
    } else if (lat <= 60) {
      return 'temperate';
    } else {
      return 'polar';
    }
  }

  // Infer urbanization level
  inferUrbanizationLevel(city, country) {
    // Major metropolitan areas (simplified)
    const majorCities = [
      'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
      'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
      'London', 'Berlin', 'Paris', 'Madrid', 'Rome', 'Amsterdam', 'Vienna',
      'Tokyo', 'Seoul', 'Shanghai', 'Beijing', 'Mumbai', 'Delhi', 'Bangalore',
      'Sydney', 'Melbourne', 'Toronto', 'Vancouver', 'Montreal',
      'São Paulo', 'Rio de Janeiro', 'Mexico City', 'Cairo', 'Lagos'
    ];

    if (!city) return 'unknown';
    
    const cityLower = city.toLowerCase();
    const isMajorCity = majorCities.some(major => 
      cityLower.includes(major.toLowerCase()) || major.toLowerCase().includes(cityLower)
    );

    return isMajorCity ? 'high' : 'medium';
  }

  // Infer geographical features
  inferGeography(latitude, longitude) {
    const geography = {
      coastal: this.isCoastal(latitude, longitude),
      elevation: this.inferElevation(latitude, longitude),
      region: this.getRegion(latitude, longitude)
    };

    return geography;
  }

  // Simple coastal detection (very basic)
  isCoastal(latitude, longitude) {
    // This is a simplified approach - in production, you'd use actual coastal data
    const coastalRegions = [
      { name: 'US West Coast', latRange: [32, 49], lonRange: [-125, -117] },
      { name: 'US East Coast', latRange: [25, 45], lonRange: [-80, -67] },
      { name: 'US Gulf Coast', latRange: [25, 31], lonRange: [-98, -80] },
      { name: 'Mediterranean', latRange: [30, 46], lonRange: [-6, 36] },
      { name: 'North Sea', latRange: [51, 61], lonRange: [-3, 12] }
    ];

    return coastalRegions.some(region => 
      latitude >= region.latRange[0] && latitude <= region.latRange[1] &&
      longitude >= region.lonRange[0] && longitude <= region.lonRange[1]
    );
  }

  // Infer elevation (very basic)
  inferElevation(latitude, longitude) {
    // Simplified elevation inference
    if (latitude > 35 && latitude < 50 && longitude > -125 && longitude < -100) {
      return 'high'; // Rocky Mountains region
    }
    if (latitude > 25 && latitude < 35 && longitude > -110 && longitude < -100) {
      return 'high'; // Desert Southwest
    }
    return 'low-medium';
  }

  // Get geographical region
  getRegion(latitude, longitude) {
    if (latitude >= 25 && latitude <= 49 && longitude >= -125 && longitude <= -66) {
      return 'North America';
    } else if (latitude >= 35 && latitude <= 71 && longitude >= -10 && longitude <= 40) {
      return 'Europe';
    } else if (latitude >= -35 && latitude <= 37 && longitude >= 60 && longitude <= 180) {
      return 'Asia';
    } else if (latitude >= -35 && latitude <= 37 && longitude >= -20 && longitude <= 51) {
      return 'Africa';
    } else if (latitude >= -47 && latitude <= -10 && longitude >= -82 && longitude <= -35) {
      return 'South America';
    } else if (latitude >= -47 && latitude <= -10 && longitude >= 113 && longitude <= 154) {
      return 'Australia';
    }
    return 'Unknown';
  }
}

module.exports = new GeocodingService();

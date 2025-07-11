// prospect-analyzer.js - Intelligent Prospect Analysis
class ProspectAnalyzer {
  constructor() {
    this.scoringWeights = {
      daysInStatus: 0.3,
      prospectType: 0.25,
      timeOfDay: 0.2,
      historicalSuccess: 0.15,
      prospectProfile: 0.1
    };
  }

  analyzeProspect(prospectData) {
    const score = this.calculateAIScore(prospectData);
    const callTiming = this.predictOptimalCallTime(prospectData);
    const successProbability = this.predictCallSuccess(prospectData);
    
    return {
      score,
      callTiming,
      successProbability,
      priority: this.determinePriority(score, successProbability),
      recommendedApproach: this.generateCallStrategy(prospectData)
    };
  }

  calculateAIScore(prospect) {
    let score = 0;
    
    // Days in status scoring (sweet spot analysis)
    const daysScore = this.scoreDaysInStatus(prospect.daysInStatus);
    score += daysScore * this.scoringWeights.daysInStatus;
    
    // Prospect type scoring
    const typeScore = this.scoreProspectType(prospect.status);
    score += typeScore * this.scoringWeights.prospectType;
    
    // Time-based scoring
    const timeScore = this.scoreCallTiming(new Date());
    score += timeScore * this.scoringWeights.timeOfDay;
    
    // Historical success rate for similar prospects
    const historyScore = this.getHistoricalSuccessRate(prospect);
    score += historyScore * this.scoringWeights.historicalSuccess;
    
    return Math.round(score * 100);
  }

  scoreDaysInStatus(days) {
    // AI-optimized sweet spot for calling
    if (days >= 2 && days <= 5) return 1.0;      // Perfect window
    if (days >= 1 && days <= 7) return 0.8;      // Good window
    if (days >= 8 && days <= 14) return 0.6;     // Okay window
    if (days > 14) return 0.3;                   // Lower priority
    return 0.1;                                   // Too fresh
  }

  scoreProspectType(status) {
    const statusScores = {
      'Prospect': 0.9,     // High priority
      'New': 1.0,          // Highest priority
      'Callback': 0.8,     // Good priority
      'Follow-up': 0.7,    // Medium priority
      'Cold': 0.5          // Lower priority
    };
    return statusScores[status] || 0.3;
  }

  scoreCallTiming(currentTime) {
    const hour = currentTime.getHours();
    
    // Optimal calling hours based on industry data
    if (hour >= 9 && hour <= 11) return 1.0;     // Morning peak
    if (hour >= 14 && hour <= 16) return 0.9;    // Afternoon peak
    if (hour >= 12 && hour <= 13) return 0.6;    // Lunch time
    if (hour >= 17 && hour <= 18) return 0.7;    // End of day
    return 0.3;                                   // Off-peak hours
  }

  predictOptimalCallTime(prospect) {
    // AI predicts best time to call based on prospect profile
    const preferences = this.analyzeProspectProfile(prospect);
    const currentHour = new Date().getHours();
    
    return {
      recommendedTime: this.findNextOptimalSlot(currentHour, preferences),
      confidence: this.calculateTimeConfidence(prospect),
      reasoning: this.generateTimeReasoning(prospect, preferences)
    };
  }

  generateCallStrategy(prospect) {
    const strategies = {
      'New': {
        approach: 'Warm introduction, focus on immediate value',
        talkingPoints: ['Welcome call', 'Service overview', 'Quick win'],
        duration: '5-7 minutes'
      },
      'Prospect': {
        approach: 'Consultative, needs discovery',
        talkingPoints: ['Pain points', 'Current situation', 'Solutions'],
        duration: '10-15 minutes'
      },
      'Callback': {
        approach: 'Follow through on previous conversation',
        talkingPoints: ['Previous discussion recap', 'Next steps', 'Timeline'],
        duration: '5-10 minutes'
      }
    };
    
    return strategies[prospect.status] || strategies['Prospect'];
  }
  getHistoricalSuccessRate(prospect) {
    // Placeholder - in production, query actual historical data
    return 0.15 + (Math.random() * 0.1);
}

analyzeProspectProfile(prospect) {
    // Analyze prospect characteristics
    return {
        preferredTime: 'morning',
        communicationStyle: 'direct',
        decisionTimeframe: 'medium'
    };
}

findNextOptimalSlot(currentHour, preferences) {
    if (preferences.preferredTime === 'morning' && currentHour >= 12) {
        return 10; // Next day 10 AM
    }
    if (currentHour < 9) return 9;
    if (currentHour >= 11 && currentHour < 14) return 14;
    return currentHour + 1;
}

calculateTimeConfidence(prospect) {
    return 0.7 + (Math.random() * 0.3);
}

generateTimeReasoning(prospect, preferences) {
    return `Based on ${prospect.status} status and ${preferences.preferredTime} preference`;
}

predictCallSuccess(prospectData) {
    // Simple prediction model
    let probability = 0.5;
    if (prospectData.daysInStatus >= 2 && prospectData.daysInStatus <= 5) {
        probability += 0.2;
    }
    if (prospectData.status === 'New') {
        probability += 0.1;
    }
    return Math.min(probability, 0.9);
}

determinePriority(score, successProbability) {
    const combined = (score + successProbability * 100) / 2;
    if (combined > 80) return 'high';
    if (combined > 60) return 'medium';
    return 'low';
}
}

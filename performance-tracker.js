// performance-tracker.js - Real-time Analytics
class PerformanceTracker {
  constructor() {
    this.metrics = {
      callsPerHour: [],
      successRateByHour: {},
      prospectTypePerformance: {},
      timeToAnswer: [],
      callDuration: [],
      conversionFunnel: {
        dialed: 0,
        answered: 0,
        interested: 0,
        qualified: 0,
        closed: 0
      }
    };
  }

  trackCall(callData) {
    // Real-time performance tracking
    this.updateMetrics(callData);
    this.generateRealTimeInsights();
    this.updateDashboard();
  }

  generateRealTimeInsights() {
    const insights = {
      currentPerformance: this.getCurrentPerformanceLevel(),
      targetProgress: this.calculateTargetProgress(),
      optimizationSuggestions: this.getOptimizationSuggestions(),
      predictedEndOfDay: this.predictEndOfDayResults()
    };
    
    return insights;
  }

  updateDashboard() {
    // Update visual dashboard with real-time data
    const dashboard = document.getElementById('ai-dashboard');
    if (dashboard) {
      dashboard.innerHTML = this.generateDashboardHTML();
    }
  }

  generateDashboardHTML() {
    const insights = this.generateRealTimeInsights();
    
    return `
      <div class="ai-dashboard">
        <div class="metric-card">
          <h3>📞 Calls Today</h3>
          <div class="metric-value">${this.metrics.conversionFunnel.dialed}</div>
          <div class="metric-target">Target: 200</div>
        </div>
        
        <div class="metric-card">
          <h3>📈 Success Rate</h3>
          <div class="metric-value">${insights.currentPerformance.successRate}%</div>
          <div class="metric-target">Target: 15%</div>
        </div>
        
        <div class="metric-card">
          <h3>⏰ Progress</h3>
          <div class="metric-value">${insights.targetProgress}%</div>
          <div class="progress-bar">
            <div class="progress-fill" style="width: ${insights.targetProgress}%"></div>
          </div>
        </div>
        
        <div class="insights-panel">
          <h3>🤖 AI Insights</h3>
          <ul>
            ${insights.optimizationSuggestions.map(suggestion => 
              `<li>${suggestion}</li>`
            ).join('')}
          </ul>
        </div>
      </div>
    `;
  }
  exportSessionReport() {
    console.log('Exporting session report...');
    // Return the metrics so the console log in content.js works
    return this.metrics;
  }
  updateMetrics(callData) {
    const hour = new Date().getHours();
    
    // Track calls per hour
    if (!this.metrics.callsPerHour[hour]) {
        this.metrics.callsPerHour[hour] = 0;
    }
    this.metrics.callsPerHour[hour]++;
    
    // Update funnel
    this.metrics.conversionFunnel.dialed++;
    if (callData.answered) this.metrics.conversionFunnel.answered++;
    if (callData.interested) this.metrics.conversionFunnel.interested++;
}

getCurrentPerformanceLevel() {
    const totalCalls = this.metrics.conversionFunnel.dialed || 1;
    const successRate = (this.metrics.conversionFunnel.interested / totalCalls * 100).toFixed(1);
    
    return {
        successRate,
        performance: successRate > 15 ? 'excellent' : successRate > 10 ? 'good' : 'needs improvement'
    };
}

calculateTargetProgress() {
    const target = 200;
    const current = this.metrics.conversionFunnel.dialed;
    return Math.min((current / target * 100).toFixed(1), 100);
}

getOptimizationSuggestions() {
    const suggestions = [];
    const currentHour = new Date().getHours();
    const performance = this.getCurrentPerformanceLevel();
    
    if (performance.successRate < 10) {
        suggestions.push("Try adjusting your call script");
    }
    
    if (currentHour < 9 || currentHour > 17) {
        suggestions.push("Consider calling during business hours");
    }
    
    if (this.metrics.conversionFunnel.dialed < 50 && currentHour > 12) {
        suggestions.push("Increase call pace to meet daily target");
    }
    
    return suggestions;
}

predictEndOfDayResults() {
    const currentCalls = this.metrics.conversionFunnel.dialed;
    const hoursLeft = Math.max(17 - new Date().getHours(), 0);
    const avgCallsPerHour = currentCalls / (new Date().getHours() - 9 + 1);
    const predictedTotal = currentCalls + (avgCallsPerHour * hoursLeft);
    
    return {
        predictedCalls: Math.round(predictedTotal),
        willMeetTarget: predictedTotal >= 200
    };
}
}


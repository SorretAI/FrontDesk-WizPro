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
}


// ai-engine.js - Core AI Intelligence Module
class FrontDeskAI {
  constructor() {
    // 1. Create modules that don't depend on others
    this.prospectAnalyzer = new ProspectAnalyzer();
    this.performanceTracker = new PerformanceTracker();
   // this.voiceAssistant = new VoiceAssistant();
    
    // 2. Create modules that DO have dependencies, and give them the tools they need.
    this.callOptimizer = new CallOptimizer(this.prospectAnalyzer); // Pass analyzer to optimizer
    // Define the functions that AutomationEngine needs from content.js
const automationCallbacks = {
  highlightProspect: window.frontDeskWizAI.highlightProspect,
  initiateCall: window.frontDeskWizAI.initiateCall,
};

// Pass them into the constructor
this.automationEngine = new AutomationEngine(this.callOptimizer, this.performanceTracker, automationCallbacks);

  }

  get isRunning() {
    return this.automationEngine.isRunning;
  }
  async initialize() {
    console.log('🤖 FrontDesk AI Engine Initializing...');
    await this.loadAIModels();
    // This method is in content.js, so we pass a reference to this AI instance.
    this.startIntelligentAutomation();
  }

  async loadTinyModel(modelName) {
    console.log(`Loading model: ${modelName}`);
    // Placeholder - in production, load actual TensorFlow.js models
    return { predict: () => Math.random() };
}

showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `frontdesk-notification frontdesk-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        border-radius: 6px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 4000);
}

  async loadAIModels() {
    // This is a placeholder as the implementation is not provided.
    console.log("Loading AI models...");
    this.localAI = {
      // prospectScorer: await this.loadTinyModel('prospect-scoring'),
      // callTimingPredictor: await this.loadTinyModel('call-timing'),
      // outcomePredictor: await this.loadTinyModel('outcome-prediction')
    };
  }

  // --- BRIDGE METHODS ---
  // These methods allow content.js to talk to the correct module.

  start() {
    this.automationEngine.startIntelligentAutomation();
  }

  stop() {
    this.automationEngine.stopIntelligentAutomation(); // You'll need to create this method in automation-engine.js
  }

  async makeCall() {
    await this.automationEngine.executeAutomatedCycle();
  }

  findNextOptimalProspect() {
    const prospect = this.callOptimizer.getNextOptimalProspect();
    if (prospect && prospect.row) {
        highlightProspect(prospect); // Assuming highlightProspect is available globally from content.js
    }
  }

  async analyzeAllProspects() {
    const prospects = scanProspects(); // Assuming scanProspects is available globally
    await this.callOptimizer.optimizeCallQueue(prospects);
  }
  
  startIntelligentAutomation() {
    // This is now handled by the start() method
    console.log("AI automation can be started with the 'start()' method.");
  }
}
// content.js - Enhanced FrontDesk-Wiz with AI
// This replaces your original content.js with AI-powered features

// Enhanced rules with AI optimization
const rules = {
  daysMin: 2,
  statuses: ['Prospect', 'New', 'Callback', 'Follow-up'],
  maxAttempts: 3,
  aiOptimization: true
};

// Global state
let frontDeskAI = null;
let isActive = false;
let currentProspectIndex = 0;
let highlightedRow = null;

// Initialize AI engine when page loads
async function initializeAI() {
  try {
    console.log('🚀 Initializing FrontDesk-Wiz AI Pro...');
    // Create the container for our dashboard first
    createDashboardContainer();
    
    // Create AI instance
    frontDeskAI = new FrontDeskAI();
    await frontDeskAI.initialize();
    
    // Make it globally accessible
    window.frontDeskAI = frontDeskAI;
    
    // Setup enhanced event listeners
    setupEnhancedEventListeners();
    
    // Show initialization success
    frontDeskAI.showNotification('🤖 FrontDesk-Wiz AI Pro ready!', 'success');
    
    console.log('✅ AI initialization complete');
    
  } catch (error) {
    console.error('❌ AI initialization failed:', error);
    showFallbackNotification('AI initialization failed, running in basic mode');
  }
}

function setupEnhancedEventListeners() {
  // Enhanced keyboard shortcuts
  document.addEventListener('keydown', handleKeyPress);
  
  // Listen for messages from popup
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    handleChromeMessage(request, sender, sendResponse);
  });
  
  // Monitor for page changes
  observePageChanges();
  
  // Auto-analyze prospects on page load
  setTimeout(() => {
    if (frontDeskAI) {
      frontDeskAI.analyzeAllProspects();
    }
  }, 2000);
}

async function handleKeyPress(event) {
  // Don't interfere with input fields
  if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
    return;
  }
  
  const key = event.key.toLowerCase();
  
  switch (key) {
    case 'c':
      event.preventDefault();
      await handleIntelligentCall();
      break;
      
    case 'n':
      event.preventDefault();
      await handleNextProspect();
      break;
      
    case 'a':
      event.preventDefault();
      if (frontDeskAI) {
        await frontDeskAI.analyzeAllProspects();
      }
      break;
      
    case 'p':
      event.preventDefault();
      toggleAutomation();
      break;
      
    case 's':
      event.preventDefault();
      if (frontDeskAI) {
        const report = frontDeskAI.performanceTracker.exportSessionReport();
        console.log('Session Report:', report);
        frontDeskAI.showNotification('📊 Session report logged to console', 'info');
      }
      break;
  }
}

async function handleIntelligentCall() {
  try {
    if (frontDeskAI) {
      // AI-powered call handling
      await frontDeskAI.makeCall();
    } else {
      // Fallback to original functionality
      await legacyCallHandler();
    }
  } catch (error) {
    console.error('Call handling error:', error);
    showFallbackNotification('Call error: ' + error.message);
  }
}

async function handleNextProspect() {
  try {
    if (frontDeskAI) {
      // AI finds next optimal prospect
      frontDeskAI.findNextOptimalProspect();
    } else {
      // Fallback to original next logic
      await legacyNextHandler();
    }
  } catch (error) {
    console.error('Next prospect error:', error);
    showFallbackNotification('Navigation error: ' + error.message);
  }
}

function toggleAutomation() {
  if (frontDeskAI) {
    if (frontDeskAI.isRunning) {
      frontDeskAI.stop();
    } else {
      frontDeskAI.start();
    }
  }
}

function handleChromeMessage(request, sender, sendResponse) {
  switch (request.action) {
    case 'startAI':
      if (frontDeskAI) {
        frontDeskAI.start();
        sendResponse({ status: 'started' });
      }
      break;
      
    case 'pauseAI':
      if (frontDeskAI) {
        frontDeskAI.stop();
        sendResponse({ status: 'paused' });
      }
      break;
      
    case 'getStats':
      if (frontDeskAI) {
        sendResponse(frontDeskAI.callStats);
      }
      break;
      
    case 'analyzeProspects':
      if (frontDeskAI) {
        frontDeskAI.analyzeAllProspects();
        sendResponse({ status: 'analyzing' });
      }
      break;
  }
}

function observePageChanges() {
  // Watch for dynamic content changes
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
        // Re-analyze prospects if table content changes
        setTimeout(() => {
          if (frontDeskAI && frontDeskAI.isInitialized) {
            frontDeskAI.analyzeAllProspects();
          }
        }, 1000);
      }
    });
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
}

// Legacy functions for fallback compatibility
async function legacyCallHandler() {
  const prospects = scanProspects();
  const prospect = prospects[currentProspectIndex];
  
  if (prospect) {
    highlightProspect(prospect);
    await initiateCall(prospect);
    await recordCallAttempt(prospect);
  } else {
    showFallbackNotification('No prospects available for calling');
  }
}

async function legacyNextHandler() {
  const prospects = scanProspects();
  currentProspectIndex = (currentProspectIndex + 1) % prospects.length;
  
  const nextProspect = prospects[currentProspectIndex];
  if (nextProspect) {
    highlightProspect(nextProspect);
    showFallbackNotification(`Next prospect: ${nextProspect.phone}`);
  }
}

function scanProspects() {
  const prospects = [];
  const tables = document.querySelectorAll('table');
  
  tables.forEach(table => {
    const rows = table.querySelectorAll('tbody tr');
    
    rows.forEach((row, index) => {
      const cells = row.querySelectorAll('td');
      
      if (cells.length >= 6) {
        const daysInStatus = parseInt(cells[4]?.textContent?.trim()) || 0;
        const status = cells[5]?.textContent?.trim() || '';
        const phone = cells[2]?.textContent?.trim() || '';
        
        // Apply original rules
        if (daysInStatus >= rules.daysMin && rules.statuses.includes(status)) {
          prospects.push({
            row: row,
            phone: phone,
            daysInStatus: daysInStatus,
            status: status,
            index: index
          });
        }
      }
    });
  });
  
  return prospects;
}

function highlightProspect(prospect) {
  // Remove previous highlights
  document.querySelectorAll('.fdz-highlight').forEach(el => {
    el.classList.remove('fdz-highlight');
  });
  
  // Highlight new prospect
  if (prospect && prospect.row) {
    prospect.row.classList.add('fdz-highlight');
    prospect.row.scrollIntoView({ behavior: 'smooth', block: 'center' });
    highlightedRow = prospect.row;
  }
}

async function initiateCall(prospect) {
  // Simulate mouseover on phone icon to trigger RingCentral
  const phoneIcon = prospect.row.querySelector('svg, .phone-icon, [title*="call"]');
  
  if (phoneIcon) {
    // Create and dispatch mouseover event
    const mouseoverEvent = new MouseEvent('mouseover', {
      view: window,
      bubbles: true,
      cancelable: true
    });
    
    phoneIcon.dispatchEvent(mouseoverEvent);
    
    // Also try click as fallback
    setTimeout(() => {
      phoneIcon.click();
    }, 500);
    
    console.log(`📞 Initiated call to ${prospect.phone}`);
  } else {
    console.warn('⚠️ Phone icon not found for prospect');
  }
}

async function recordCallAttempt(prospect) {
  const callData = {
    prospectId: `legacy_${prospect.index}`,
    phone: prospect.phone,
    status: prospect.status,
    daysInStatus: prospect.daysInStatus,
    timestamp: new Date().toISOString(),
    outcome: 'attempted'
  };
  
  try {
    await chrome.storage.local.set({
      [`call_${Date.now()}`]: callData
    });
  } catch (error) {
    console.error('Failed to record call attempt:', error);
  }
}

function showFallbackNotification(message, type = 'info') {
  // Simple notification system for fallback mode
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === 'error' ? '#ff4444' : '#2568FB'};
    color: white;
    padding: 10px 15px;
    border-radius: 6px;
    z-index: 10000;
    font-family: Arial, sans-serif;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
  `;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 4000);
}

// Utility functions
function createQuickAccessPanel() {
  const panel = document.createElement('div');
  panel.id = 'fdz-quick-access';
  panel.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 20px;
    background: rgba(10, 14, 23, 0.95);
    color: white;
    padding: 15px;
    border-radius: 8px;
    border: 1px solid #2568FB;
    font-family: Arial, sans-serif;
    z-index: 9999;
    min-width: 200px;
  `;
  
  panel.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 10px;">🚀 Quick Access</div>
    <div style="font-size: 12px; line-height: 1.4;">
      <div><kbd>C</kbd> - Intelligent Call</div>
      <div><kbd>N</kbd> - Next Optimal</div>
      <div><kbd>A</kbd> - Analyze Prospects</div>
      <div><kbd>P</kbd> - Toggle AI Automation</div>
      <div><kbd>S</kbd> - Session Report</div>
    </div>
  `;
  
  document.body.appendChild(panel);
  
  // Auto-hide after 10 seconds
  setTimeout(() => {
    panel.style.opacity = '0.3';
  }, 10000);
}

// Enhanced initialization
function initialize() {
  console.log('🎯 FrontDesk-Wiz loading...');
  
  // Check if we're on the right page
  if (!window.location.hostname.includes('irslogics.com')) {
    console.log('Not on IRSL Logics site, skipping initialization');
    return;
  }
  
  // Wait for page to be fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAI);
  } else {
    initializeAI();
  }
  
  // Create quick access panel
  setTimeout(createQuickAccessPanel, 2000);
}
function createDashboardContainer() {
  // Check if the dashboard already exists
  if (document.getElementById('ai-dashboard')) {
    return;
  }

  const dashboard = document.createElement('div');
  dashboard.id = 'ai-dashboard';
  dashboard.style.position = 'fixed';
  dashboard.style.top = '100px';
  dashboard.style.right = '20px';
  dashboard.style.width = '300px';
  dashboard.style.zIndex = '10001';
  dashboard.style.backgroundColor = 'white';
  dashboard.style.border = '1px solid #ccc';
  dashboard.style.borderRadius = '8px';
  dashboard.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
  
  document.body.appendChild(dashboard);
}

// ---- The Important Change is Here ----

// 1. First, export the functions needed by other scripts to the window object.
window.frontDeskWizAI = {
  scanProspects,
  highlightProspect,
  initiateCall,
  recordCallAttempt,
  rules
};

// Start the application
initialize();

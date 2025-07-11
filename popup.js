// Popup script for FrontDesk-WizPro

document.addEventListener('DOMContentLoaded', function() {
    // Get current status
    chrome.storage.local.get(['automationEnabled'], function(result) {
        updateStatus(result.automationEnabled !== false);
    });
    
    // Toggle automation
    document.getElementById('toggleAutomation').addEventListener('click', function() {
        chrome.storage.local.get(['automationEnabled'], function(result) {
            const newState = !(result.automationEnabled !== false);
            chrome.storage.local.set({automationEnabled: newState}, function() {
                updateStatus(newState);
                // Send message to content script
                chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                    chrome.tabs.sendMessage(tabs[0].id, {
                        action: 'toggleAutomation',
                        enabled: newState
                    });
                });
            });
        });
    });
    
    // View analytics
    document.getElementById('viewAnalytics').addEventListener('click', function() {
        chrome.tabs.create({url: 'analytics.html'});
    });
    
    // Settings
    document.getElementById('settings').addEventListener('click', function() {
        chrome.tabs.create({url: 'settings.html'});
    });
});

function updateStatus(enabled) {
    const statusEl = document.getElementById('status');
    statusEl.textContent = enabled ? 'Active' : 'Inactive';
    statusEl.style.color = enabled ? '#4CAF50' : '#f44336';
}

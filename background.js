// background.js

// This runs when the extension is installed or updated
chrome.runtime.onInstalled.addListener(() => {
    console.log("Cybersecurity Helper Extension Installed or Updated.");
    
    // Set default settings for the extension if needed
    chrome.storage.sync.set({ privacyModeEnabled: true }, () => {
      console.log("Privacy Mode enabled by default.");
    });
  });
  
  // Listen for tab updates to check and enforce HTTPS
  chrome.webNavigation.onCompleted.addListener((details) => {
    const url = details.url;
  
    // Enforce HTTPS for pages that support it
    if (url.startsWith("http://")) {
      const httpsUrl = url.replace("http://", "https://");
      chrome.tabs.update(details.tabId, { url: httpsUrl });
    }
  }, { url: [{ hostContains: '.' }] });  // Will apply to all websites
  
  // Listen for phishing alerts from content.js
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'phishingAlert') {
      console.log("Phishing site detected:", message.url);
      // You can log this, store it, or show a notification
      sendResponse({ status: "Alert received" });
  
      // Optionally, show a Chrome notification for phishing alerts
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/alert.png",
        title: "Phishing Site Detected",
        message: `Warning! You are visiting a potentially phishing site: ${message.url}`
      });
    }
  
    // Handle malware site detection
    if (message.type === 'malwareAlert') {
      console.log("Malware site detected:", message.url);
      sendResponse({ status: "Alert received" });
  
      // Show a notification for malware sites
      chrome.notifications.create({
        type: "basic",
        iconUrl: "icons/malware.png",
        title: "Malware Site Detected",
        message: `Warning! You are visiting a known malware site: ${message.url}`
      });
    }
  
    // Handle enabling/disabling Privacy Mode
    if (message.type === 'setPrivacyMode') {
      chrome.storage.sync.set({ privacyModeEnabled: message.enabled }, () => {
        console.log(`Privacy Mode ${message.enabled ? "enabled" : "disabled"}.`);
        sendResponse({ status: "Privacy mode updated" });
      });
      return true;  // To indicate that we are sending a response asynchronously
    }
  });
  
  // Listen for when the user switches tabs
  chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("Active tab changed:", activeInfo);
    
    // Optionally, you can perform checks for things like privacy settings
    chrome.storage.sync.get("privacyModeEnabled", (data) => {
      if (data.privacyModeEnabled) {
        // If Privacy Mode is enabled, block trackers on the current tab
        chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          func: blockTrackers
        });
      }
    });
  });
  
  // Block trackers or unwanted scripts on a page (Privacy Mode)
  function blockTrackers() {
    const blockedTrackers = [
      "google-analytics.com",
      "facebook.com",
      "doubleclick.net",
      "trackerscript.js",
      "adtracking.js"
    ];
  
    const allScripts = document.querySelectorAll("script, iframe, img");
  
    allScripts.forEach(request => {
      const src = request.src || request.href;
      if (blockedTrackers.some(tracker => src.includes(tracker))) {
        request.remove();  // Block the tracking scripts
        console.log(`Blocked tracker/script: ${src}`);
      }
    });
  }
  
  // Enforce HTTPS on every page load (with content.js)
  chrome.webNavigation.onCommitted.addListener((details) => {
    const currentUrl = details.url;
  
    // If the site is using HTTP, force it to use HTTPS
    if (currentUrl.startsWith("http://")) {
      const secureUrl = currentUrl.replace("http://", "https://");
      chrome.tabs.update(details.tabId, { url: secureUrl });
    }
  }, { url: [{ hostContains: '.' }] });  // Applies to all websites
  
  // Listen for new tab creation
  chrome.tabs.onCreated.addListener((tab) => {
    console.log("New tab created:", tab);
  });
  
  // Listen for any tab updates (including switching tabs)
  chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete') {
      console.log(`Tab ${tabId} loaded: ${tab.url}`);
    }
  });
  
  // Add any other global features or listeners as needed
  
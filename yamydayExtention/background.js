function onRequest(request, sender, sendResponse) {
  console.log('detect ad');
  sendResponse({});
};

chrome.browserAction.onClicked.addListener(function(tab) {
  chrome.tabs.create({'url': "http://127.0.0.1:3000/"}, function(tab) {
    // Tab opened.
  });
});

chrome.extension.onRequest.addListener(onRequest);
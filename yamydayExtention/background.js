function onRequest(request, sender, sendResponse) {
  console.log('detect ad');
  sendResponse({});
};

chrome.extension.onRequest.addListener(onRequest);
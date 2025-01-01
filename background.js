let settings = {
  removeSpacesBeforeLineBreaks: true,
  insertNewlineAtEnd: true,
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getSettings") {
    sendResponse(settings);
  } else if (request.action === "setSetting") {
    settings[request.key] = request.value;
    sendResponse({ success: true });
  }
});

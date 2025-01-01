document.addEventListener("DOMContentLoaded", () => {
  const toggleRemoveSpaces = document.getElementById("toggleRemoveSpaces");
  const toggleInsertNewline = document.getElementById("toggleInsertNewline");

  // init
  chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
    toggleRemoveSpaces.checked = response.removeSpacesBeforeLineBreaks;
    toggleInsertNewline.checked = response.insertNewlineAtEnd;
  });

  toggleRemoveSpaces.addEventListener("change", (event) => {
    chrome.runtime.sendMessage({
      action: "setSetting",
      key: "removeSpacesBeforeLineBreaks",
      value: event.target.checked,
    });
  });

  toggleInsertNewline.addEventListener("change", (event) => {
    chrome.runtime.sendMessage({
      action: "setSetting",
      key: "insertNewlineAtEnd",
      value: event.target.checked,
    });
  });
});

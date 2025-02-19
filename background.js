chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "downloadFile") {
    chrome.downloads.download(
      {
        url: request.fileUrl,
        filename: "SWEA-samples/" + request.filename, // 자동 저장할 폴더 경로 (Chrome의 기본 다운로드 폴더 내)
        saveAs: false, // 저장 대화 상자 없이 자동 다운로드
        conflictAction: "overwrite", // 덮어쓰기
      },
      () => {
        if (chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError.message);
        }
      }
    );
  }
});

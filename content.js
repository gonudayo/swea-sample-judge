let outputSample = ""; // 샘플 출력 결과
let removeSpacesBeforeLineBreaks = true; // 개행 앞 공백 제거 옵션
let insertNewlineAtEnd = true; // 개행 추가 옵션

// background.js에서 설정 가져오기
async function fetchSettings() {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage({ action: "getSettings" }, (response) => {
      removeSpacesBeforeLineBreaks = response.removeSpacesBeforeLineBreaks;
      insertNewlineAtEnd = response.insertNewlineAtEnd;
      resolve();
    });
  });
}

// 출력 파일을 가져와서 변수에 저장
async function fetchAndStoreOutput() {
  const link = document.querySelector(".down_area a[href*='downType=out']");
  if (link) {
    const response = await fetch(link.href);
    outputSample = await response.text();
  }
}

// 출력 결과를 비교
async function compareOutput() {
  await fetchSettings(); // 설정 동기화

  // 최초 실행시 출력 파일 저장
  if (!outputSample) {
    await fetchAndStoreOutput();
  }

  const outputElement = document.querySelector(
    "#scs_output > li:nth-child(2) > span.text"
  );

  const outputText = outputElement.innerHTML
    .replace(/&nbsp;/g, " ")
    .replace(/<br>/g, "\r\n");

  const resultMessage = document.createElement("div");
  resultMessage.classList.add("result-message", "fade-in");

  // 샘플에 개행 앞에 공백이 있는 경우 제거
  if (removeSpacesBeforeLineBreaks) {
    outputSample = outputSample.replace(/ \r\n/g, "\r\n");
  } else {
    await fetchAndStoreOutput();
  }

  // 샘플의 끝이 개행이 아닌 경우 추가
  if (insertNewlineAtEnd && !outputSample.endsWith("\r\n")) {
    outputSample += "\r\n";
  } else if (!insertNewlineAtEnd) {
    outputSample = outputSample.trimEnd();
  }

  // 디버깅용 코드
  /*
  console.log(removeSpacesBeforeLineBreaks);
  console.log(insertNewlineAtEnd);

  console.log(outputText.length);
  console.log(outputText);

  console.log(outputSample.length);
  console.log(outputSample);

  // const maxLength = Math.max(outputText.length, outputSample.length);
  // for (let i = 0; i < maxLength; i++) {
  //   const outputChar = outputText[i] || " ";
  //   const sampleChar = outputSample[i] || " ";
  //   console.log(
  //     outputChar + ": " + (outputText.charCodeAt(i) || " "),
  //     sampleChar + ": " + (outputSample.charCodeAt(i) || " ")
  //   );
  // }
  */

  if (outputText === outputSample) {
    resultMessage.innerText = "Correct!";
    resultMessage.style.borderColor = "green";
    resultMessage.style.color = "green";
  } else {
    resultMessage.innerText = "Wrong!";
    resultMessage.style.borderColor = "red";
    resultMessage.style.color = "red";
  }

  // 이전 결과 메시지 제거
  const previousMessage = document.querySelector(".result-message");
  if (previousMessage) {
    previousMessage.remove();
  }

  document.body.appendChild(resultMessage);

  // 10초 후 결과 메시지 제거
  setTimeout(() => {
    resultMessage.remove();
  }, 10000);
}

// Run 버튼 클릭 시 실행되는 함수
function onRun() {
  const observer = new MutationObserver(() => {
    observer.disconnect();
    compareOutput();
  });

  observer.observe(document.querySelector("#scs_output"), {
    childList: true,
    subtree: true,
  });
}

// Run 버튼에 onRun 함수 연결
const runButton = document.querySelector(
  '.btn_right .btn[onclick="return onRun(); return false;"]'
);
if (runButton) {
  runButton.addEventListener("click", onRun);
}

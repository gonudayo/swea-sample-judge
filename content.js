let outputAnswer = "";

// 출력 파일을 가져와서 변수에 저장
async function fetchAndStoreOutput() {
  const link = document.querySelector(".down_area a[href*='downType=out']");
  if (link) {
    const response = await fetch(link.href);
    outputAnswer = await response.text();
  }
}

// 출력 결과를 비교
async function compareOutput() {
  // 최초 실행시 출력 파일 저장
  if (!outputAnswer) {
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

  if (!outputAnswer.endsWith("\r\n")) {
    outputAnswer += "\r\n";
  }

  if (outputText === outputAnswer) {
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

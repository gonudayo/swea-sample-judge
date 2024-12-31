let outputAnswer = "";

// 입력 파일을 가져와서 textarea에 삽입
async function fetchAndInsertInput() {
  const link = document.querySelector(".down_area a[href*='downType=in']");
  if (link) {
    const response = await fetch(link.href);
    const text = await response.text();
    const textarea = document.querySelector("#scs_input");
    if (textarea) {
      textarea.value = text;
    }
  }
}

// 출력 파일을 가져와서 변수에 저장
async function fetchAndStoreOutput() {
  const link = document.querySelector(".down_area a[href*='downType=out']");
  if (link) {
    const response = await fetch(link.href);
    outputAnswer = await response.text();
  }
}

// 샘플 삽입 버튼
function addButton() {
  const button = document.createElement("button");
  button.innerText = "Insert Sample";
  button.classList.add("insert-sample-button");
  button.addEventListener("click", async () => {
    await fetchAndInsertInput();
    await fetchAndStoreOutput();
  });
  document.body.appendChild(button);
}

// 출력 결과를 비교
async function compareOutput() {
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

  // 디버깅용 코드
  /*
  console.log(typeof outputText);
  console.log(outputText.length);
  console.log(outputText);
  
  console.log(typeof outputAnswer);
  console.log(outputAnswer.length);
  console.log(outputAnswer);

  for (let i = 0; i < outputText.length; i++) {
    console.log(outputText.charCodeAt(i), outputAnswer.charCodeAt(i));
  }
  */

  if (outputText === outputAnswer) {
    resultMessage.innerText = "Correct!";
    resultMessage.style.borderColor = "green";
  } else {
    resultMessage.innerText = "Wrong!";
    resultMessage.style.borderColor = "red";
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
  const initialLength = document.querySelectorAll(
    "#scs_output > li.print_msg"
  ).length;

  const observer = new MutationObserver(() => {
    const currentLength = document.querySelectorAll(
      "#scs_output > li.print_msg"
    ).length;
    if (currentLength > initialLength) {
      observer.disconnect();
      compareOutput();
    }
  });

  observer.observe(document.querySelector("#scs_output"), {
    childList: true,
    subtree: true,
  });
}

window.addEventListener("load", addButton);

// Run 버튼에 onRun 함수 연결
const runButton = document.querySelector(
  '.btn_right .btn[onclick="return onRun(); return false;"]'
);
if (runButton) {
  runButton.addEventListener("click", onRun);
}

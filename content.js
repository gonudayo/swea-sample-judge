let sampleOutput = ""; // 샘플 아웃풋

// 샘플 아웃풋 저장
async function fetchAndStoreOutput() {
  const link = document.querySelector(".down_area a[href*='downType=out']");
  if (link) {
    const response = await fetch(link.href);
    sampleOutput = await response.text();
  }
}

// 출력 결과를 비교
async function compareOutput() {
  // 최초 실행시 샘플 아웃풋 저장
  if (!sampleOutput) {
    await fetchAndStoreOutput();
  }

  // 유저 아웃풋 가져오기
  const outputElement = document.querySelector(
    "#scs_output > li:nth-child(2) > span.text"
  );

  // 유저 아웃풋 형식을 샘플과 동일하게 변환
  let userOutput = outputElement.innerHTML
    .replace(/&nbsp;/g, " ")
    .replace(/<br>/g, "\n");

  // 샘플, 유저 아웃풋 개행 앞에 공백이 있는 경우 제거
  sampleOutput = sampleOutput.replace(/\s+\n/g, "\n");
  userOutput = userOutput.replace(/\s+\n/g, "\n");

  // 샘플, 유저 아웃풋 끝에 위치한 공백과 개행을 모두 제거
  sampleOutput = sampleOutput.replace(/[\s\r\n]+$/, "");
  userOutput = userOutput.replace(/[\s\r\n]+$/, "");

  // 디버깅용 코드
  /*
  console.log(userOutput.length);
  console.log(userOutput);
  console.log(sampleOutput.length);
  console.log(sampleOutput);
  const maxLength = Math.max(userOutput.length, sampleOutput.length);
  for (let i = 0; i < maxLength; i++) {
    const outputChar = userOutput[i] || " ";
    const sampleChar = sampleOutput[i] || " ";
    console.log(
      "User = " + outputChar + ": " + (userOutput.charCodeAt(i) || " "),
      "Sample = " + sampleChar + ": " + (sampleOutput.charCodeAt(i) || " ")
    );
  }
  */
  // 디버깅용 코드 끝

  // 결과 메시지 생성
  const resultMessage = document.createElement("div");
  resultMessage.classList.add("result-message", "fade-in");

  if (userOutput === sampleOutput) {
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

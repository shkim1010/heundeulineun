const body = document.body;
let startY = 0;
let isSliding = false;

const lockScreen = document.getElementById("lock-screen");

lockScreen.addEventListener("touchstart", (e) => {
  startY = e.touches[0].clientY;
});

lockScreen.addEventListener("touchmove", (e) => {
  const moveY = e.touches[0].clientY;
  const diff = startY - moveY;

  if (diff > 100 && !isSliding) {
    body.classList.add("slide-up");
    isSliding = true;
  }
});

// PC용 마우스 드래그
let mouseDownY = 0;
let isMouseDown = false;

lockScreen.addEventListener("mousedown", (e) => {
  isMouseDown = true;
  mouseDownY = e.clientY;
});

document.addEventListener("mousemove", (e) => {
  if (!isMouseDown || isSliding) return;
  const diff = mouseDownY - e.clientY;
  if (diff > 100) {
    body.classList.add("slide-up");
    isSliding = true;
  }
});

document.addEventListener("mouseup", () => {
  isMouseDown = false;
});

// 채팅 로직
const chatWindow = document.getElementById("chat-window");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");

const TOP_NOTES = ["라벤더", "레몬", "자몽", "로즈마리", "페퍼민트"];
const MIDDLE_NOTES = ["라일락", "피오니", "자스민", "클린코튼", "일랑일랑"];
const BASE_NOTES = ["샌달우드", "시더우드", "바닐라", "화이트머스크", "블랙머스크"];

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function addBubble(text, sender) {
  const bubble = document.createElement("div");
  bubble.classList.add("bubble", sender);
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const userText = userInput.value.trim();
  if (!userText) return;

  addBubble(userText, "user");
  userInput.value = "";

  const top = getRandomElement(TOP_NOTES);
  const middle = getRandomElement(MIDDLE_NOTES);
  const base = getRandomElement(BASE_NOTES);

  const reply = `추천 향입니다:\n탑 노트: ${top}\n미들 노트: ${middle}\n베이스 노트: ${base}`;
  setTimeout(() => {
    addBubble(reply, "bot");
  }, 800);
});

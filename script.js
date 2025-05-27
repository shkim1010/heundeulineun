import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const body = document.body;
const lockScreen = document.getElementById("lock-screen");
const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");

let startY = 0;
let isSliding = false;

lockScreen.addEventListener("touchstart", e => startY = e.touches[0].clientY);
lockScreen.addEventListener("touchmove", e => {
  const moveY = e.touches[0].clientY;
  if (startY - moveY > 100 && !isSliding) {
    body.classList.add("slide-up");
    isSliding = true;
  }
});

let mouseDownY = 0, isMouseDown = false;
lockScreen.addEventListener("mousedown", e => {
  isMouseDown = true;
  mouseDownY = e.clientY;
});
document.addEventListener("mousemove", e => {
  if (!isMouseDown || isSliding) return;
  if (mouseDownY - e.clientY > 100) {
    body.classList.add("slide-up");
    isSliding = true;
  }
});
document.addEventListener("mouseup", () => isMouseDown = false);

function addBubble(text, sender) {
  const bubble = document.createElement("div");
  bubble.className = "bubble " + sender;
  bubble.textContent = text;
  chatWindow.appendChild(bubble);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const music = userInput.value.trim();
  if (!music) return;

  addBubble(music, "user");
  userInput.value = "";

  try {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song: music })
    });
    const { top, middle, base } = await res.json();

    const resultText = `추천 향입니다:\n탑 노트: ${top}\n미들 노트: ${middle}\n베이스 노트: ${base}`;
    addBubble(resultText, "bot");

    await addDoc(collection(window.db, "recommendations"), {
      song: music, top, middle, base, timestamp: Date.now()
    });

  } catch (err) {
    console.error(err);
    addBubble("추천에 실패했어요. 다시 시도해주세요.", "bot");
  }
});

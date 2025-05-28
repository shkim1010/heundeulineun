// script.js

import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const chatForm = document.getElementById("chat-form");
const chatWindow = document.getElementById("chat-window");
const userInput = document.getElementById("user-input");

// Firestore 인스턴스 (index.html에서 window.db로 연결해뒀음)
const db = window.db;

// 사용자 메시지 입력 이벤트 처리
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const message = userInput.value.trim();
  if (!message) return;

  // 사용자 메시지 화면에 출력
  const userMsg = document.createElement("div");
  userMsg.className = "user-msg";
  userMsg.innerText = message;
  chatWindow.appendChild(userMsg);

  userInput.value = "";

  // Firestore에 저장
  try {
    await addDoc(collection(db, "messages"), {
      text: message,
      timestamp: new Date()
    });
  } catch (error) {
    console.error("Firestore 저장 실패:", error);
  }

  // 향수 추천 API 호출 예시
  try {
    const res = await fetch("/api/recommend", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song: message })
    });
    const data = await res.json();

    const botMsg = document.createElement("div");
    botMsg.className = "bot-msg";
    botMsg.innerText = `추천 향수: ${data.result}`;
    chatWindow.appendChild(botMsg);
  } catch (err) {
    console.error("추천 실패:", err);
  }
});

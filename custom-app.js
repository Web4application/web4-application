window.initCustomApp = function () {
  console.log("🚀 Kubu Hai Web Overlay Initialized");

  // Navbar
  const nav = document.createElement("div");
  nav.id = "kubu-nav";
  nav.innerHTML = `
    <div class="nav-title">⚡ Kubu Hai</div>
    <div class="nav-links">
      <button id="aiBtn">🤖 AI</button>
      <button id="statsBtn">📊 Stats</button>
      <button id="logoutBtn">🚪 Exit</button>
    </div>`;
  document.body.appendChild(nav);

  // AI Overlay
  const ai = document.createElement("div");
  ai.id = "aiOverlay";
  ai.innerHTML = `
    <h3>💬 AI Assistant</h3>
    <div id="chatBox"></div>
    <textarea id="aiInput" placeholder="Type or speak your question..."></textarea>
    <button id="micBtn">🎙️ Speak</button>
    <button id="sendAI">Send</button>`;
  document.body.appendChild(ai);

  const chatBox = document.getElementById("chatBox");
  const chatHistory = JSON.parse(localStorage.getItem("kubuChat") || "[]");
  chatHistory.forEach((m) => addMsg(m.text, m.role));

  function addMsg(text, role) {
    const div = document.createElement("div");
    div.className = "msg " + role;
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  async function sendToAI(msg) {
    addMsg(msg, "user");
    chatHistory.push({ text: msg, role: "user" });
    localStorage.setItem("kubuChat", JSON.stringify(chatHistory));
    connectSocket(msg);
  }

  // 🧠 WebSocket connection for real-time streaming
  let ws;
  function connectSocket(message) {
    ws = new WebSocket("wss://api.kubu-hai.com/ws/ai");
    ws.onopen = () => ws.send(JSON.stringify({ message }));
    let buffer = "";
    ws.onmessage = (e) => {
      buffer += e.data;
      if (buffer.endsWith("[END]")) {
        const text = buffer.replace("[END]", "");
        addMsg(text, "ai");
        chatHistory.push({ text, role: "ai" });
        localStorage.setItem("kubuChat", JSON.stringify(chatHistory));
        speak(text);
        buffer = "";
      }
    };
    ws.onerror = () => addMsg("⚠️ AI connection error", "ai");
  }

  // Voice recognition
  const micBtn = document.getElementById("micBtn");
  let recognition;
  if ("webkitSpeechRecognition" in window) {
    const R = window.webkitSpeechRecognition;
    recognition = new R();
    recognition.lang = "en-US";
    recognition.onresult = (e) => {
      const t = e.results[0][0].transcript;
      document.getElementById("aiInput").value = t;
      sendToAI(t);
    };
  }
  micBtn.onclick = () => recognition && recognition.start();

  // Send message
  document.getElementById("sendAI").onclick = () => {
    const msg = document.getElementById("aiInput").value.trim();
    if (msg) sendToAI(msg);
    document.getElementById("aiInput").value = "";
  };

  // TTS
  function speak(text) {
    if (!window.speechSynthesis) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.volume = 1;
    utter.voice = speechSynthesis.getVoices().find(v => /en/i.test(v.lang));
    speechSynthesis.speak(utter);
  }

  // Nav events
  document.getElementById("aiBtn").onclick = () => {
    ai.style.display = ai.style.display === "flex" ? "none" : "flex";
    ai.style.flexDirection = "column";
  };
  document.getElementById("statsBtn").onclick = () => alert("📈 Analytics Coming Soon");
  document.getElementById("logoutBtn").onclick = () => alert("👋 Logged Out");
};

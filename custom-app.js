// custom-app.js
console.log("✨ Kubu-Hai Custom Layer Loaded");

window.initCustomApp = function () {
  console.log("🚀 Initializing Kubu-Hai Web Overlay...");

  /* =====================
     1. CREATE NAVBAR
  ===================== */
  const nav = document.createElement("div");
  nav.id = "kubuNav";
  nav.innerHTML = `
    <div class="nav-content">
      <div class="brand">
        <img src="logo.png" alt="Kubu Hai Logo" id="logo"/>
        <span>Kubu Hai</span>
      </div>
      <div class="nav-actions">
        <button id="aiBtn">🤖 AI</button>
        <button id="voiceBtn">🎤 Voice</button>
        <button id="statsBtn">📊 Stats</button>
        <button id="logoutBtn">🚪 Exit</button>
      </div>
    </div>
  `;
  document.body.appendChild(nav);

  /* =====================
     2. CREATE AI OVERLAY
  ===================== */
  const overlay = document.createElement("div");
  overlay.id = "aiOverlay";
  overlay.innerHTML = `
    <div class="ai-header">
      <h2>💬 Kubu AI Assistant</h2>
      <button id="closeAI">✖</button>
    </div>
    <div id="chatArea"></div>
    <div class="ai-input">
      <textarea id="aiInput" placeholder="Ask me anything..."></textarea>
      <button id="sendAI">Send</button>
    </div>
  `;
  document.body.appendChild(overlay);

  /* =====================
     3. CSS: Unique + Glassy
  ===================== */
  const style = document.createElement("style");
  style.innerHTML = `
    :root {
      --glass-bg: rgba(255, 255, 255, 0.15);
      --blur: 12px;
      --accent: #00e0ff;
      --text: #fff;
      --dark-bg: rgba(20, 20, 20, 0.85);
    }

    body {
      font-family: 'Inter', sans-serif;
      margin: 0;
      overflow: hidden;
    }

    #kubuNav {
      position: fixed;
      top: 0;
      width: 100%;
      backdrop-filter: blur(var(--blur));
      background: var(--glass-bg);
      border-bottom: 1px solid rgba(255,255,255,0.1);
      z-index: 9999;
    }

    .nav-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 30px;
      color: var(--text);
    }

    .brand {
      display: flex;
      align-items: center;
      font-size: 1.2rem;
      font-weight: bold;
      letter-spacing: 0.5px;
    }

    .brand img {
      height: 40px;
      margin-right: 10px;
      border-radius: 10px;
    }

    .nav-actions button {
      background: var(--accent);
      color: #000;
      border: none;
      border-radius: 6px;
      padding: 8px 12px;
      margin-left: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s, box-shadow 0.3s;
    }

    .nav-actions button:hover {
      transform: translateY(-2px);
      box-shadow: 0 2px 10px rgba(0,224,255,0.4);
    }

    #aiOverlay {
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 340px;
      height: 460px;
      display: none;
      flex-direction: column;
      background: var(--dark-bg);
      color: var(--text);
      border-radius: 16px;
      box-shadow: 0 0 30px rgba(0,0,0,0.5);
      overflow: hidden;
      z-index: 10000;
      backdrop-filter: blur(var(--blur));
    }

    .ai-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      background: rgba(255,255,255,0.05);
      border-bottom: 1px solid rgba(255,255,255,0.1);
    }

    #chatArea {
      flex: 1;
      overflow-y: auto;
      padding: 10px;
      display: flex;
      flex-direction: column;
    }

    .ai-message {
      margin: 6px 0;
      padding: 8px 10px;
      border-radius: 10px;
      max-width: 80%;
    }

    .user-msg {
      align-self: flex-end;
      background: var(--accent);
      color: #000;
    }

    .bot-msg {
      align-self: flex-start;
      background: rgba(255,255,255,0.1);
    }

    .ai-input {
      display: flex;
      border-top: 1px solid rgba(255,255,255,0.1);
      background: rgba(255,255,255,0.05);
      padding: 8px;
    }

    #aiInput {
      flex: 1;
      background: transparent;
      color: var(--text);
      border: none;
      resize: none;
      outline: none;
      font-size: 0.9rem;
    }

    #sendAI {
      background: var(--accent);
      border: none;
      color: #000;
      font-weight: bold;
      padding: 6px 10px;
      border-radius: 8px;
      cursor: pointer;
    }

    @media (max-width: 500px) {
      #aiOverlay {
        width: 90%;
        right: 5%;
        bottom: 10px;
        height: 400px;
      }
    }
  `;
  document.head.appendChild(style);

  /* =====================
     4. LOGIC + AI + VOICE
  ===================== */
  const chatArea = overlay.querySelector("#chatArea");

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  };

  const addMessage = (text, sender) => {
    const msg = document.createElement("div");
    msg.className = `ai-message ${sender}-msg`;
    msg.textContent = text;
    chatArea.appendChild(msg);
    chatArea.scrollTop = chatArea.scrollHeight;
  };

  async function sendAI() {
    const input = document.getElementById("aiInput");
    const query = input.value.trim();
    if (!query) return;
    input.value = "";
    addMessage(query, "user");

    try {
      const res = await fetch("https://api.kubu-hai.com/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query }),
      });
      const data = await res.json();
      addMessage(data.reply || "🤖 No response", "bot");
      speak(data.reply || "I have no answer for that.");
      localStorage.setItem("lastChat", chatArea.innerHTML);
    } catch (err) {
      console.error(err);
      addMessage("⚠️ Network error.", "bot");
    }
  }

  // Restore old chat
  chatArea.innerHTML = localStorage.getItem("lastChat") || "";

  document.getElementById("sendAI").onclick = sendAI;
  document.getElementById("closeAI").onclick = () => (overlay.style.display = "none");
  document.getElementById("aiBtn").onclick = () =>
    (overlay.style.display =
      overlay.style.display === "flex" ? "none" : "flex");

  // 🎙️ Voice Input
  document.getElementById("voiceBtn").onclick = () => {
    const rec = new webkitSpeechRecognition() || new SpeechRecognition();
    rec.lang = "en-US";
    rec.start();
    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      document.getElementById("aiInput").value = text;
      sendAI();
    };
  };

  document.getElementById("statsBtn").onclick = () =>
    alert("📈 Analytics coming soon!");
  document.getElementById("logoutBtn").onclick = () =>
    alert("👋 Logging out..."));

  console.log("✅ Kubu-Hai Hybrid UI Ready!");
};

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

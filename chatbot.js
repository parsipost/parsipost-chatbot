(function () {
  const webhookURL = "https://hossexxnx.app.n8n.cloud/webhook/f699dc8f-9fd7-4049-a287-b501e33bad52/chat";

  // ساخت عناصر HTML چت‌بات
  const html = `
    <style>
      /* استایل مشابه نسخه قبل (میتونی به فایل CSS جداگانه منتقلش کنی) */
      #chatbot-button {
        position: fixed;
        right: 20px;
        bottom: 20px;
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background-color: #e22a22;
        border: none;
        cursor: pointer;
        z-index: 1000;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      #chatbot-button img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 50%;
      }
      #chat-tooltip {
        position: fixed;
        right: 90px;
        bottom: 45px;
        background-color: #f7f3f3;
        color: #1c1c1c;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 15px;
        display: none;
        z-index: 1000;
      }
      #chat-window {
        display: none;
        position: fixed;
        bottom: 90px;
        right: 20px;
        width: 350px;
        height: 500px;
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        font-size: 16px;
        overflow: hidden;
        z-index: 999;
        display: flex;
        flex-direction: column;
      }
      #chat-header {
        background-color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        gap: 10px;
        border-bottom: 1px solid #ddd;
        flex-direction: row-reverse;
      }
      #chat-header-left {
        display: flex;
        align-items: center;
        gap: 10px;
      }
      #chat-header img {
        width: 38px;
        height: 38px;
        border-radius: 50%;
      }
      #chat-header span {
        font-weight: bold;
      }
      #chat-header-buttons {
        display: flex;
        gap: 5px;
      }
      #chat-header-buttons button {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 18px;
        color: #666;
      }
      #quick-replies {
        display: flex;
        gap: 10px;
        padding: 8px;
        border-bottom: 1px solid #ddd;
        justify-content: flex-end;
      }
      #quick-replies button {
        padding: 6px 10px;
        font-size: 14px;
        background-color: #f1f1f1;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      #chat-messages {
        flex: 1;
        overflow-y: auto;
        padding: 10px;
      }
      .message-container {
        display: flex;
        margin-bottom: 10px;
        align-items: flex-start;
      }
      .message-container.bot {
        flex-direction: row-reverse;
      }
      .message-container.user {
        flex-direction: row;
      }
      .message {
        max-width: 85%;
        padding: 8px 12px;
        border-radius: 7px;
        line-height: 1.5;
      }
      .bot .message {
        background-color: #e22a22;
        color: #fafafa;
      }
      .user .message {
        background-color: #fff6f3;
        color: #050505;
      }
      .avatar {
        width: 28px;
        height: 28px;
        margin: 0 6px;
        border-radius: 50%;
      }
      #chat-input {
        display: flex;
        padding: 10px;
        border-top: 1px solid #ddd;
        background-color: #ffffff;
      }
      #chat-input input {
        flex: 1;
        padding: 8px;
        border-radius: 6px;
        border: 1px solid #ccc;
        outline: none;
        font-size: 14px;
        color: #1e1e1f;
      }
      #chat-input button {
        margin-right: 8px;
        background-color: #e22a22;
        border: none;
        border-radius: 15px;
        padding: 8px 14px;
        color: white;
        cursor: pointer;
      }
    </style>
    <div id="chat-tooltip">سوالی دارید؟</div>
    <button id="chatbot-button">
      <img src="https://parsipost.ir/wp-content/uploads/2025/07/parsipost-chatbot-icon.png" alt="chat-icon" />
    </button>
    <div id="chat-window">
      <div id="chat-header">
        <div id="chat-header-buttons">
          <button id="refresh-chat" title="پاک کردن چت">↻</button>
          <button id="close-chat" title="بستن چت">✖️</button>
        </div>
        <div id="chat-header-left">
          <img src="https://parsipost.ir/wp-content/uploads/2025/07/robot-scaled.webp" />
          <span>پارسی گو</span>
        </div>
      </div>
      <div id="quick-replies">
        <button onclick="quickReply('کد تحویل')">کد تحویل</button>
        <button onclick="quickReply('آدرس دفاتر پارسی پست')">آدرس دفاتر پارسی پست</button>
      </div>
      <div id="chat-messages"></div>
      <div id="chat-input">
        <input type="text" id="message-input" placeholder="سوال خود را بپرسید" maxlength="100" />
        <button id="send-btn">ارسال</button>
      </div>
    </div>
  `;

  document.body.insertAdjacentHTML("beforeend", html);

  const chatBtn = document.getElementById("chatbot-button");
  const chatTooltip = document.getElementById("chat-tooltip");
  const chatWindow = document.getElementById("chat-window");
  const sendBtn = document.getElementById("send-btn");
  const messageInput = document.getElementById("message-input");
  const chatMessages = document.getElementById("chat-messages");
  const closeChat = document.getElementById("close-chat");
  const refreshChat = document.getElementById("refresh-chat");

  let chatOpen = false;
  let chatInitialized = false;

  function appendMessage(content, sender) {
    const msgContainer = document.createElement("div");
    msgContainer.className = `message-container ${sender}`;

    const avatar = document.createElement("img");
    avatar.className = "avatar";
    avatar.src = sender === "bot"
      ? "https://parsipost.ir/wp-content/uploads/2025/07/robot-scaled.webp"
      : "https://parsipost.ir/wp-content/uploads/2025/07/user-svgrepo-com.svg";

    const msgDiv = document.createElement("div");
    msgDiv.className = "message";
    msgDiv.textContent = content;

    msgContainer.appendChild(avatar);
    msgContainer.appendChild(msgDiv);

    chatMessages.appendChild(msgContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function showWelcome() {
    chatMessages.innerHTML = "";
    appendMessage("سلام، من پارسی‌گو هستم دستیار هوشمند پارسی پست، خوشحال میشم کمک‌تون کنم.", "bot");
  }

  window.quickReply = function (text) {
    messageInput.value = text;
    sendMessage();
  };

  chatBtn.addEventListener("mouseenter", () => {
    if (!chatOpen) chatTooltip.style.display = "block";
  });

  chatBtn.addEventListener("mouseleave", () => {
    chatTooltip.style.display = "none";
  });

  chatBtn.addEventListener("click", () => {
    chatOpen = !chatOpen;
    chatWindow.style.display = chatOpen ? "flex" : "none";
    if (chatOpen && !chatInitialized) {
      setTimeout(showWelcome, 100);
      chatInitialized = true;
    }
    chatTooltip.style.display = "none";
  });

  closeChat.addEventListener("click", () => {
    chatOpen = false;
    chatWindow.style.display = "none";
  });

  refreshChat.addEventListener("click", showWelcome);

  function sendMessage() {
    const text = messageInput.value.trim();
    if (!text) return;
    if (text.length > 100) {
      alert("متن وارد شده نباید بیشتر از 100 کاراکتر باشد.");
      return;
    }
    appendMessage(text, "user");
    messageInput.value = "";

    fetch(webhookURL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text, metadata: {} })
    })
      .then(res => res.json())
      .then(data => {
        if (data.reply) {
          appendMessage(data.reply, "bot");
        } else {
          appendMessage("پاسخی دریافت نشد.", "bot");
        }
      })
      .catch(() => {
        appendMessage("خطا در ارتباط با سرور.", "bot");
      });
  }

  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
})();

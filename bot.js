// Interactive Chat Widget for n8n - Persian RTL Support & Enhanced UI
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource - Vazir (Persian font)
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css';
    document.head.appendChild(fontElement);

    // Apply widget styles with the user-specified red/gray theme
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #e22a22);      /* Custom Red */
            --chat-color-secondary: var(--chat-widget-secondary, #b81e1e);   /* Darker Custom Red */
            --chat-color-light: var(--chat-widget-light, #f9d6d6);          /* Lighter Custom Red */
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #2d3748);            /* Dark Gray */
            --chat-color-text-light: var(--chat-widget-text-light, #718096);/* Medium Gray */
            --chat-color-border: var(--chat-widget-border, #e2e8f0);        /* Light Gray */
            --chat-shadow-sm: 0 1px 3px rgba(60, 64, 72, 0.1);
            --chat-shadow-md: 0 4px 8px rgba(60, 64, 72, 0.15);
            --chat-shadow-lg: 0 10px 20px rgba(60, 64, 72, 0.2);
            --chat-radius-sm: 6px;
            --chat-radius-md: 10px;
            --chat-radius-lg: 16px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: Vazir, 'Poppins', sans-serif;
            direction: rtl;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            height: 580px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        .chat-assist-widget .chat-window.right-side { right: 90px; margin: 10px }
        .chat-assist-widget .chat-window.left-side { left: 20px; }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .chat-assist-widget .chat-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            position: relative;
        }

        .chat-assist-widget .chat-header-logo {
            width: 32px;
            height: 32px;
            border-radius: var(--chat-radius-sm);
            object-fit: contain;
            background: rgba(255, 255, 255, 0.9);
            padding: 4px;
        }

        .chat-assist-widget .chat-header-title {
            font-size: 16px;
            font-weight: 600;
            color: white;
        }

        .chat-assist-widget .chat-close-btn {
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            font-size: 18px;
            border-radius: var(--chat-radius-full);
            width: 28px;
            height: 28px;
        }

        .chat-assist-widget .chat-close-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: translateY(-50%) scale(1.1);
        }

        .chat-assist-widget .chat-welcome {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            padding: 24px;
            text-align: center;
            width: 100%;
            max-width: 320px;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 22px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 24px;
            line-height: 1.3;
        }

        .chat-assist-widget .chat-start-btn {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            width: 100%;
            padding: 14px 20px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            cursor: pointer;
            font-size: 15px;
            transition: var(--chat-transition);
            font-weight: 600;
            font-family: inherit;
            margin-bottom: 16px;
            box-shadow: var(--chat-shadow-md);
        }

        .chat-assist-widget .chat-start-btn:hover {
            transform: translateY(-2px);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-response-time {
            font-size: 14px;
            color: var(--chat-color-text-light);
            margin: 0;
        }

        .chat-assist-widget .chat-body {
            display: none;
            flex-direction: column;
            height: 100%;
        }

        .chat-assist-widget .chat-body.active {
            display: flex;
        }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: #edf2f7;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        
        .chat-assist-widget .chat-bubble {
            padding: 14px 18px;
            border-radius: var(--chat-radius-md);
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-border);
        }
        
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-right-radius: 4px;
            width: fit-content;
            align-self: flex-end;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-border);
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-text-light);
            border-radius: var(--chat-radius-full);
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        .chat-assist-widget .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .chat-assist-widget .typing-dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes typingAnimation {
            0%, 60%, 100% { transform: scale(0.8); opacity: 0.5; }
            30% { transform: scale(1); opacity: 1; }
        }

        .chat-assist-widget .chat-controls {
            padding: 16px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-border);
            display: flex;
            gap: 10px;
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 14px 16px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            background: #edf2f7;
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            max-height: 120px;
            min-height: 48px;
            transition: var(--chat-transition);
            direction: rtl;
            text-align: right;
        }

        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px var(--chat-color-light);
            background: var(--chat-color-surface);
        }
        
        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-radius: var(--chat-radius-md);
            width: 48px;
            height: 48px;
            cursor: pointer;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-submit:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-md);
        }
        
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 56px;
            border-radius: var(--chat-radius-full);
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            cursor: pointer;
            box-shadow: var(--chat-shadow-md);
            z-index: 999;
            transition: var(--chat-transition);
            display: flex;
            align-items: center;
            padding: 0 20px;
            gap: 10px;
        }

        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side { left: 80px;bottom: 40px }

        .chat-assist-widget .chat-launcher:hover {
            transform: scale(1.05);
            box-shadow: var(--chat-shadow-lg);
        }

        .chat-assist-widget .chat-launcher svg { width: 26px; height: 26px; }
        .chat-assist-widget .chat-launcher-text { font-weight: 600; font-size: 15px; }
        
        .chat-assist-widget .suggested-questions { 
            display: flex; 
            flex-direction: column; 
            gap: 8px; 
            margin: 12px 0; 
            align-self: flex-end; 
            max-width: 85%; 
        }
        
        .chat-assist-widget .suggested-question-btn { 
            background: #f3f4f6; 
            border: 1px solid var(--chat-color-border); 
            border-radius: var(--chat-radius-md); 
            padding: 10px 14px; 
            text-align: right; 
            font-size: 13px; 
            color: var(--chat-color-text); 
            cursor: pointer; 
            transition: var(--chat-transition); 
            direction: rtl;
        }
        
        .chat-assist-widget .suggested-question-btn:hover { 
            background: var(--chat-color-light); 
            border-color: var(--chat-color-primary); 
        }
        
        .chat-assist-widget .chat-link { 
            color: var(--chat-color-primary); 
            text-decoration: underline; 
        }
        
        .chat-assist-widget .chat-link:hover { 
            color: var(--chat-color-secondary); 
        }
        
        /* Scrollbar styling */
        .chat-assist-widget ::-webkit-scrollbar {
            width: 8px;
        }
        
        .chat-assist-widget ::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .chat-assist-widget ::-webkit-scrollbar-thumb {
            background: #c1c1c1;
            border-radius: 10px;
        }
        
        .chat-assist-widget ::-webkit-scrollbar-thumb:hover {
            background: #a8a8a8;
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default configuration with Persian text
    const defaultSettings = {
        webhook: {
            url: '',
            route: ''
        },
        branding: {
            logo: '',
            name: 'پشتیبانی آنلاین',
            welcomeText: 'سلام! چطور می‌توانم به شما کمک کنم؟',
            responseTimeText: 'باسخگویی بدون وقفه',
        },
        style: {
            primaryColor: '#e22a22',     // Custom Red
            secondaryColor: '#b81e1e',   // Darker Custom Red
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#2d3748'
        },
        suggestedQuestions: [
            'چگونه می‌توانم حساب کاربری ایجاد کنم؟',
            'قیمت‌های شما چگونه است؟',
            'آیا راهنمای استفاده دارید؟'
        ]
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ?
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultSettings.style, ...window.ChatWidgetConfig.style },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions
        } : defaultSettings;

    // Session tracking
    let conversationId = '';
    let isWaitingForResponse = false;

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors from settings
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    // HTML structure with Persian text
    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                شروع گفتگو
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="پیام خود را بنویسید..." rows="1"></textarea>
                <button class="chat-submit">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24" style="transform: scaleX(-1);">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create toggle button with Persian text
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `<img width="28" height="28" src='https://parsipost.ir/wp-content/uploads/2025/08/icon.webp'>`;
    
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Get references to elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    function createSessionId() { return crypto.randomUUID(); }

    function createTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        return indicator;
    }

    function linkifyText(text) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`);
    }
    
    // Function to start the chat
    async function startChat() {
        chatWelcome.style.display = 'none';
        chatBody.classList.add('active');
        conversationId = createSessionId();
        isWaitingForResponse = true;

        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Send an initial event to the webhook to get the welcome message
            const initialData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: "START_CHAT_SESSION",
                metadata: { isInitialMessage: true }
            };
            const response = await fetch(settings.webhook.url, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': 'fa-IR' // Indicate Persian language preference
                }, 
                body: JSON.stringify(initialData) 
            });
            const responseData = await response.json();

            messagesContainer.removeChild(typingIndicator);

            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const messageText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            botMessage.innerHTML = linkifyText(messageText);
            messagesContainer.appendChild(botMessage);

            if (settings.suggestedQuestions && Array.isArray(settings.suggestedQuestions) && settings.suggestedQuestions.length > 0) {
                const suggestedQuestionsContainer = document.createElement('div');
                suggestedQuestionsContainer.className = 'suggested-questions';
                settings.suggestedQuestions.forEach(question => {
                    const questionButton = document.createElement('button');
                    questionButton.className = 'suggested-question-btn';
                    questionButton.textContent = question;
                    questionButton.addEventListener('click', () => {
                        submitMessage(question);
                        if (suggestedQuestionsContainer.parentNode) {
                            suggestedQuestionsContainer.parentNode.removeChild(suggestedQuestionsContainer);
                        }
                    });
                    suggestedQuestionsContainer.appendChild(questionButton);
                });
                messagesContainer.appendChild(suggestedQuestionsContainer);
            }
            messagesContainer.scrollTop = messagesContainer.scrollHeight;

        } catch (error) {
            console.error('Chat start error:', error);
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) indicator.parentNode.removeChild(indicator);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "متأسفیم، ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید.";
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    async function submitMessage(messageText) {
        if (isWaitingForResponse) return;
        isWaitingForResponse = true;
        
        const requestData = {
            action: "sendMessage",
            sessionId: conversationId,
            route: settings.webhook.route,
            chatInput: messageText,
            metadata: {}
        };

        const userMessage = document.createElement('div');
        userMessage.className = 'chat-bubble user-bubble';
        userMessage.textContent = messageText;
        messagesContainer.appendChild(userMessage);

        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': 'fa-IR' // Indicate Persian language preference
                }, 
                body: JSON.stringify(requestData) 
            });
            const responseData = await response.json();
            messagesContainer.removeChild(typingIndicator);

            const botMessage = document.createElement('div');
            botMessage.className = 'chat-bubble bot-bubble';
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            botMessage.innerHTML = linkifyText(responseText);
            messagesContainer.appendChild(botMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            const indicator = messagesContainer.querySelector('.typing-indicator');
            if (indicator) indicator.parentNode.removeChild(indicator);
            const errorMessage = document.createElement('div');
            errorMessage.className = 'chat-bubble bot-bubble';
            errorMessage.textContent = "متأسفیم، ارسال پیام شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید.";
            messagesContainer.appendChild(errorMessage);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        const newHeight = messageTextarea.scrollHeight;
        messageTextarea.style.height = (newHeight > 120 ? 120 : newHeight) + 'px';
    }
    
    // Event listeners
    startChatButton.addEventListener('click', startChat);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText && !isWaitingForResponse) {
            submitMessage(messageText);
            messageTextarea.value = '';
            autoResizeTextarea();
        }
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keypress', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            sendButton.click();
        }
    });
    
    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
        });
    });
})();

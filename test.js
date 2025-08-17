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

    // Enhanced CSS with better RTL support and animations
    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            --chat-color-primary: var(--chat-widget-primary, #e22a22);
            --chat-color-secondary: var(--chat-widget-secondary, #b81e1e);
            --chat-color-light: var(--chat-widget-light, #f9d6d6);
            --chat-color-surface: var(--chat-widget-surface, #ffffff);
            --chat-color-text: var(--chat-widget-text, #2d3748);
            --chat-color-text-light: var(--chat-widget-text-light, #718096);
            --chat-color-border: var(--chat-widget-border, #e2e8f0);
            --chat-shadow-sm: 0 1px 3px rgba(60, 64, 72, 0.1);
            --chat-shadow-md: 0 4px 8px rgba(60, 64, 72, 0.15);
            --chat-shadow-lg: 0 10px 20px rgba(60, 64, 72, 0.2);
            --chat-radius-sm: 6px;
            --chat-radius-md: 10px;
            --chat-radius-lg: 16px;
            --chat-radius-full: 9999px;
            --chat-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: Vazir, 'Poppins', -apple-system, BlinkMacSystemFont, sans-serif;
            direction: rtl;
        }

        /* Main container */
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            z-index: 1000;
            width: 380px;
            max-width: calc(100vw - 40px);
            height: min(580px, 80vh);
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            overflow: hidden;
            display: none;
            flex-direction: column;
            transition: var(--chat-transition);
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            border: 1px solid var(--chat-color-border);
        }

        .chat-assist-widget .chat-window.right-side { 
            right: 20px;
        }

        .chat-assist-widget .chat-window.left-side { 
            left: 20px; 
        }

        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        /* Header */
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
            margin: 0;
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
            line-height: 1;
        }

        /* Welcome screen */
        .chat-assist-widget .chat-welcome {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1;
            padding: 24px;
            text-align: center;
        }

        .chat-assist-widget .chat-welcome-title {
            font-size: 1.375rem;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 1.5rem;
            line-height: 1.4;
        }

        .chat-assist-widget .chat-start-btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            padding: 14px 24px;
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
            width: auto;
            min-width: 200px;
        }

        /* Chat body */
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
            padding: 16px;
            background: #f8fafc;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scroll-behavior: smooth;
        }

        /* Message bubbles */
        .chat-assist-widget .message-row {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            margin: 4px 0;
            direction: ltr;
        }

        .chat-assist-widget .message-row.bot { 
            justify-content: flex-start; 
        }

        .chat-assist-widget .message-row.user { 
            justify-content: flex-end; 
        }

        .chat-assist-widget .chat-avatar {
            width: 32px; 
            height: 32px; 
            flex: 0 0 32px;
            border-radius: 50%;
            border: 1px solid var(--chat-color-border);
            background: #fff;
            object-fit: cover;
            box-shadow: var(--chat-shadow-sm);
        }

        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 78%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
            box-shadow: var(--chat-shadow-sm);
            direction: rtl;
            text-align: right;
            animation: fadeInUp 0.25s ease-out;
        }

        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            margin-left: 8px;
        }

        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            border: 1px solid var(--chat-color-border);
            margin-right: 8px;
        }

        /* Bubble tails */
        .chat-assist-widget .message-row.bot .chat-bubble::after {
            content: "";
            position: absolute;
            left: -6px; 
            bottom: 10px;
            width: 12px; 
            height: 12px;
            background: #fff;
            border-left: 1px solid var(--chat-color-border);
            border-bottom: 1px solid var(--chat-color-border);
            transform: rotate(45deg);
            border-bottom-left-radius: 2px;
        }

        .chat-assist-widget .message-row.user .chat-bubble::after {
            content: "";
            position: absolute;
            right: -6px; 
            bottom: 10px;
            width: 12px; 
            height: 12px;
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            transform: rotate(45deg);
        }

        /* Typing indicator */
        .chat-assist-widget .typing-indicator {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 10px 14px;
            background: white;
            border: 1px solid var(--chat-color-border);
            border-radius: 14px;
            direction: ltr;
        }

        .chat-assist-widget .typing-dot {
            width: 8px;
            height: 8px;
            background: var(--chat-color-text-light);
            border-radius: var(--chat-radius-full);
            animation: typingAnimation 1.4s infinite ease-in-out;
        }

        /* Input area */
        .chat-assist-widget .chat-controls {
            padding: 12px;
            background: var(--chat-color-surface);
            border-top: 1px solid var(--chat-color-border);
            display: flex;
            gap: 8px;
            align-items: flex-end;
        }

        .chat-assist-widget .chat-textarea {
            flex: 1;
            padding: 12px 16px;
            border: 1px solid var(--chat-color-border);
            border-radius: var(--chat-radius-md);
            background: #f1f5f9;
            color: var(--chat-color-text);
            resize: none;
            font-family: inherit;
            font-size: 14px;
            max-height: 120px;
            min-height: 48px;
            transition: var(--chat-transition);
            direction: rtl;
            text-align: right;
            line-height: 1.5;
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

        /* Launcher button */
        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            height: 56px;
            width: 56px;
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
            justify-content: center;
            padding: 0;
        }

        /* Suggested questions */
        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 12px 0 4px 0;
            align-self: flex-start;
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
            line-height: 1.4;
        }

        /* Animations */
        @keyframes fadeInUp {
            from { 
                opacity: 0; 
                transform: translateY(8px); 
            }
            to { 
                opacity: 1; 
                transform: translateY(0); 
            }
        }

        @keyframes typingAnimation {
            0%, 60%, 100% { 
                transform: scale(0.8); 
                opacity: 0.5; 
            }
            30% { 
                transform: scale(1); 
                opacity: 1; 
            }
        }

        /* Responsive */
        @media (max-width: 480px) {
            .chat-assist-widget .chat-window {
                width: calc(100vw - 40px);
                height: 70vh;
                bottom: 70px;
            }
            
            .chat-assist-widget .chat-launcher {
                bottom: 15px;
                right: 15px;
            }
        }

        /* Accessibility */
        .chat-assist-widget .chat-submit:focus-visible,
        .chat-assist-widget .chat-start-btn:focus-visible,
        .chat-assist-widget .chat-launcher:focus-visible {
            outline: 2px solid var(--chat-color-primary);
            outline-offset: 2px;
        }

        .chat-assist-widget .chat-textarea:focus-visible {
            outline: 2px solid var(--chat-color-primary);
            outline-offset: -1px;
        }

        /* Scrollbar */
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
            botAvatar: 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp',
            userAvatar: '',
            name: 'پشتیبانی آنلاین',
            welcomeText: 'سلام! چطور می‌توانم به شما کمک کنم؟',
            responseTimeText: 'پاسخگویی بدون وقفه',
        },
        style: {
            primaryColor: '#e22a22',
            secondaryColor: '#b81e1e',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#2d3748'
        },
        suggestedQuestions: [
            'چگونه می‌توانم حساب کاربری ایجاد کنم؟',
            'قیمت‌های شما چگونه است؟',
            'آیا راهنمای استفاده دارید؟'
        ],
        behavior: {
            autoOpen: false,
            persistSession: true,
            typingDelay: 1000
        }
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ? 
        {
            webhook: { ...defaultSettings.webhook, ...window.ChatWidgetConfig.webhook },
            branding: { ...defaultSettings.branding, ...window.ChatWidgetConfig.branding },
            style: { ...defaultSettings.style, ...window.ChatWidgetConfig.style },
            suggestedQuestions: window.ChatWidgetConfig.suggestedQuestions || defaultSettings.suggestedQuestions,
            behavior: { ...defaultSettings.behavior, ...window.ChatWidgetConfig.behavior }
        } : defaultSettings;

    // Session management
    let conversationId = '';
    let isWaitingForResponse = false;
    let messageQueue = [];

    // Create widget DOM structure
    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';
    
    // Apply custom colors
    widgetRoot.style.setProperty('--chat-widget-primary', settings.style.primaryColor);
    widgetRoot.style.setProperty('--chat-widget-secondary', settings.style.secondaryColor);
    widgetRoot.style.setProperty('--chat-widget-surface', settings.style.backgroundColor);
    widgetRoot.style.setProperty('--chat-widget-text', settings.style.fontColor);

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    
    // Header logo fallback
    const headerLogoSrc = settings.branding.logo || settings.branding.botAvatar || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';

    // HTML structure
    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${headerLogoSrc}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn" aria-label="بستن چت">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn" aria-label="شروع گفتگو">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                شروع گفتگو
            </button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
    `;

    const chatInterfaceHTML = `
        <div class="chat-body">
            <div class="chat-messages" role="log" aria-live="polite"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="پیام خود را بنویسید..." rows="1" aria-label="پیام شما"></textarea>
                <button class="chat-submit" aria-label="ارسال پیام">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="24" height="24" style="transform: scaleX(-1);">
                      <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984ل-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    `;
    
    chatWindow.innerHTML = welcomeScreenHTML + chatInterfaceHTML;
    
    // Create launcher button
    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `<img width="28" height="28" src='https://parsipost.ir/wp-content/uploads/2025/08/icon.webp' alt="چت آنلاین">`;
    launchButton.setAttribute('aria-label', 'باز کردن چت پشتیبانی');
    
    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // DOM references
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    
    // Session management
    function createSessionId() { 
        return 'chat-' + Date.now() + '-' + Math.floor(Math.random() * 1000).toString(36);
    }

    function restoreSession() {
        if (settings.behavior.persistSession) {
            const savedSession = localStorage.getItem('chatWidgetSession');
            if (savedSession) {
                try {
                    const session = JSON.parse(savedSession);
                    conversationId = session.conversationId || createSessionId();
                    return true;
                } catch (e) {
                    console.error('Failed to restore session:', e);
                }
            }
        }
        conversationId = createSessionId();
        return false;
    }

    function saveSession() {
        if (settings.behavior.persistSession) {
            localStorage.setItem('chatWidgetSession', JSON.stringify({
                conversationId,
                timestamp: Date.now()
            }));
        }
    }

    // Message processing
    function linkifyText(text) {
        if (!text) return '';
        
        // URL detection
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        text = text.replace(urlPattern, url => 
            `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`
        );
        
        // Email detection
        const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
        text = text.replace(emailPattern, email => 
            `<a href="mailto:${email}" class="chat-link">${email}</a>`
        );
        
        return text;
    }

    function processMessageContent(content) {
        if (!content) return { html: '', text: '' };
        
        if (typeof content === 'string') {
            return {
                html: linkifyText(content),
                text: content
            };
        }
        
        if (content.html) {
            return {
                html: content.html,
                text: content.text || ''
            };
        }
        
        return {
            html: linkifyText(content.text || ''),
            text: content.text || ''
        };
    }

    // Message display functions
    function createMessageElement(side, content) {
        const row = document.createElement('div');
        row.className = `message-row ${side}`;
        row.setAttribute('role', 'listitem');

        const processedContent = processMessageContent(content);

        if (side === 'bot') {
            const avatar = document.createElement('img');
            avatar.className = 'chat-avatar bot-avatar';
            avatar.src = settings.branding.botAvatar || settings.branding.logo || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';
            avatar.alt = 'ربات';
            avatar.setAttribute('aria-hidden', 'true');
            row.appendChild(avatar);
        }

        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${side === 'user' ? 'user-bubble' : 'bot-bubble'}`;
        
        if (processedContent.html) {
            bubble.innerHTML = processedContent.html;
        } else {
            bubble.textContent = processedContent.text;
        }

        row.appendChild(bubble);

        if (side === 'user' && settings.branding.userAvatar) {
            const avatar = document.createElement('img');
            avatar.className = 'chat-avatar user-avatar';
            avatar.src = settings.branding.userAvatar;
            avatar.alt = 'کاربر';
            avatar.setAttribute('aria-hidden', 'true');
            row.appendChild(avatar);
        }

        return row;
    }

    function createTypingIndicator() {
        const row = document.createElement('div');
        row.className = 'message-row bot';
        row.setAttribute('aria-live', 'polite');
        row.setAttribute('aria-label', 'در حال تایپ...');

        const avatar = document.createElement('img');
        avatar.className = 'chat-avatar bot-avatar';
        avatar.src = settings.branding.botAvatar || settings.branding.logo || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';
        avatar.alt = 'ربات';
        avatar.setAttribute('aria-hidden', 'true');

        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `
            <div class="typing-dot" aria-hidden="true"></div>
            <div class="typing-dot" aria-hidden="true"></div>
            <div class="typing-dot" aria-hidden="true"></div>
        `;

        row.appendChild(avatar);
        row.appendChild(indicator);
        return row;
    }

    function scrollToBottom() {
        messagesContainer.scrollTo({
            top: messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    }

    function showSuggestedQuestions() {
        if (!settings.suggestedQuestions?.length) return;

        const suggestedQuestionsContainer = document.createElement('div');
        suggestedQuestionsContainer.className = 'suggested-questions';
        suggestedQuestionsContainer.setAttribute('role', 'menu');

        settings.suggestedQuestions.forEach(question => {
            const questionButton = document.createElement('button');
            questionButton.className = 'suggested-question-btn';
            questionButton.textContent = question;
            questionButton.setAttribute('role', 'menuitem');
            questionButton.addEventListener('click', () => {
                submitMessage(question);
                suggestedQuestionsContainer.remove();
            });
            suggestedQuestionsContainer.appendChild(questionButton);
        });

        messagesContainer.appendChild(suggestedQuestionsContainer);
        scrollToBottom();
    }

    // Chat operations
    async function startChat() {
        chatWelcome.style.display = 'none';
        chatBody.classList.add('active');
        
        if (!conversationId) {
            conversationId = createSessionId();
        }

        isWaitingForResponse = true;

        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        scrollToBottom();

        try {
            // Initial message to server
            const initialData = {
                action: "session_start",
                sessionId: conversationId,
                route: settings.webhook.route,
                metadata: { 
                    isInitialMessage: true,
                    userAgent: navigator.userAgent,
                    language: navigator.language
                }
            };

            const response = await fetch(settings.webhook.url, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': 'fa-IR'
                }, 
                body: JSON.stringify(initialData) 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }

            // Process response
            if (Array.isArray(responseData)) {
                // Handle multiple messages
                for (const message of responseData) {
                    await displayMessage('bot', message.output || message.text);
                    await new Promise(resolve => setTimeout(resolve, settings.behavior.typingDelay || 500));
                }
            } else {
                // Single message
                await displayMessage('bot', responseData.output || responseData.text);
            }

            showSuggestedQuestions();
            saveSession();

        } catch (error) {
            console.error('Chat start error:', error);
            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }
            await displayMessage('bot', "متأسفیم، ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید.");
        } finally {
            isWaitingForResponse = false;
        }
    }

    async function displayMessage(side, content) {
        return new Promise(resolve => {
            const message = createMessageElement(side, content);
            messagesContainer.appendChild(message);
            scrollToBottom();
            
            // Small delay for animation
            setTimeout(resolve, 100);
        });
    }

    async function submitMessage(messageText) {
        if (!messageText.trim() || isWaitingForResponse) return;
        
        isWaitingForResponse = true;
        messageTextarea.disabled = true;
        sendButton.disabled = true;
        
        // Add to queue in case multiple messages are sent quickly
        messageQueue.push(messageText);
        
        try {
            // Display user message immediately
            await displayMessage('user', messageText);
            
            const typingIndicator = createTypingIndicator();
            messagesContainer.appendChild(typingIndicator);
            scrollToBottom();
            
            const requestData = {
                action: "user_message",
                sessionId: conversationId,
                route: settings.webhook.route,
                message: messageText,
                metadata: {
                    timestamp: new Date().toISOString()
                }
            };

            const response = await fetch(settings.webhook.url, { 
                method: 'POST', 
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept-Language': 'fa-IR'
                }, 
                body: JSON.stringify(requestData) 
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const responseData = await response.json();

            if (typingIndicator.parentNode) {
                typingIndicator.remove();
            }

            // Process response
            if (Array.isArray(responseData)) {
                for (const message of responseData) {
                    await displayMessage('bot', message.output || message.text);
                    await new Promise(resolve => setTimeout(resolve, settings.behavior.typingDelay || 500));
                }
            } else {
                await displayMessage('bot', responseData.output || responseData.text);
            }

            saveSession();

        } catch (error) {
            console.error('Message submission error:', error);
            const typingIndicator = chatWindow.querySelector('.typing-indicator');
            if (typingIndicator?.parentNode) {
                typingIndicator.remove();
            }
            await displayMessage('bot', "متأسفیم، ارسال پیام شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید.");
        } finally {
            isWaitingForResponse = false;
            messageTextarea.disabled = false;
            sendButton.disabled = false;
            messageQueue = messageQueue.filter(msg => msg !== messageText);
            
            // Focus back on textarea
            messageTextarea.focus();
        }
    }

    // UI helpers
    function autoResizeTextarea() {
        messageTextarea.style.height = 'auto';
        const newHeight = Math.min(messageTextarea.scrollHeight, 120);
        messageTextarea.style.height = newHeight + 'px';
    }

    function toggleChatWindow() {
        chatWindow.classList.toggle('visible');
        
        if (chatWindow.classList.contains('visible')) {
            messageTextarea.focus();
            
            // Auto-start chat if not already started
            if (!chatBody.classList.contains('active') {
                const wasRestored = restoreSession();
                if (wasRestored || settings.behavior.autoOpen) {
                    startChat();
                }
            }
        }
    }

    // Event listeners
    startChatButton.addEventListener('click', startChat);
    
    sendButton.addEventListener('click', () => {
        const messageText = messageTextarea.value.trim();
        if (messageText) {
            submitMessage(messageText);
            messageTextarea.value = '';
            autoResizeTextarea();
        }
    });
    
    messageTextarea.addEventListener('input', autoResizeTextarea);
    
    messageTextarea.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            const messageText = messageTextarea.value.trim();
            if (messageText) {
                submitMessage(messageText);
                messageTextarea.value = '';
                autoResizeTextarea();
            }
        }
    });
    
    launchButton.addEventListener('click', toggleChatWindow);

    chatWindow.querySelector('.chat-close-btn').addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });

    // Auto-open if configured
    if (settings.behavior.autoOpen) {
        setTimeout(() => {
            chatWindow.classList.add('visible');
            startChat();
        }, 1000);
    }

    // Initialize session
    restoreSession();
})();

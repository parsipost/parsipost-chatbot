// Interactive Chat Widget for n8n - Persian RTL Support & Enhanced UI with Slide-Up and Coin-Flip Animation
(function() {
    // Initialize widget only once
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // Load font resource - Vazir (Persian font)
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css';
    document.head.appendChild(fontElement);

    // Apply widget styles with slide-up and coin-flip animations
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
            font-family: Vazir, 'Poppins', sans-serif;
            direction: rtl;
        }
        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 100px;
            z-index: 2000000003;
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
        .chat-assist-widget .chat-window.right-side { 
            right: 20px; 
            margin: 10px 15px; 
        }
        .chat-assist-widget .chat-window.left-side { 
            left: 20px; 
        }
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
            flex-shrink: 0;
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
        .chat-assist-widget .chat-header-actions {
            position: absolute;
            left: 52px;
            top: 50%;
            transform: translateY(-50%);
            display: flex;
            gap: 8px;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s, visibility 0.3s;
        }
        .chat-assist-widget .chat-window.chat-session-active .chat-header-actions {
            opacity: 1;
            visibility: visible;
        }
        .chat-assist-widget .chat-action-btn {
            background: rgba(255, 255, 255, 0.15);
            border: none;
            color: white;
            cursor: pointer;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: var(--chat-transition);
            border-radius: var(--chat-radius-full);
            width: 28px;
            height: 28px;
        }
        .chat-assist-widget .chat-action-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            transform: scale(1.1);
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
            overflow: hidden;
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
            gap: 10px;
        }
        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: 18px;
            max-width: 85%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.6;
            position: relative;
            white-space: pre-line;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary) 0%, var(--chat-color-secondary) 100%);
            color: white;
            border: none;
            border-bottom-right-radius: 0;
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            background: white;
            color: var(--chat-color-text);
            border: 1px solid var(--chat-color-border);
            border-bottom-left-radius: 0;
            position: relative;
            overflow: visible;
        }
        .chat-assist-widget .message-row.bot .chat-bubble::after {
            content: "";
            position: absolute;
            left: -6px;
            bottom: 0;
            width: 12px;
            height: 12px;
            background: white;
            border-left: 1px solid var(--chat-color-border);
            border-bottom: 1px solid var(--chat-color-border);
            transform: rotate(45deg);
            z-index: 0;
            clip-path: polygon(0 0, 100% 100%, 0 100%);
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .typing-indicator {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 14px 18px;
            background: white;
            border-radius: var(--chat-radius-md);
            border-bottom-left-radius: 4px;
            width: fit-content;
            box-shadow: var(--chat-shadow-sm);
            border: 1px solid var(--chat-color-border);
        }
        .chat-assist-widget .typing-indicator::after {
            content: "";
            position: absolute;
            left: -6px;
            bottom: 0;
            width: 12px;
            height: 12px;
            background: white;
            border-left: 1px solid var(--chat-color-border);
            border-bottom: 1px solid var(--chat-color-border);
            transform: rotate(45deg);
            z-index: 0;
            clip-path: polygon(0 0, 100% 100%, 0 100%);
            box-shadow: var(--chat-shadow-sm);
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
            flex-shrink: 0;
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
            overflow-y: auto;
        }
        .chat-assist-widget .chat-textarea:focus {
            outline: none;
            border-color: var(--chat-color-primary);
            box-shadow: 0 0 0 3px var(--chat-color-light);
            background: var(--chat-color-surface);
        }
        .chat-assist-widget .chat-textarea::-webkit-scrollbar {
            width: 8px;
        }
        .chat-assist-widget .chat-textarea::-webkit-scrollbar-track {
            background: transparent;
        }
        .chat-assist-widget .chat-textarea::-webkit-scrollbar-thumb {
            background-color: transparent;
            border-radius: 4px;
            transition: background-color 0.2s ease-in-out;
        }
        .chat-assist-widget .chat-textarea:hover::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.3);
        }
        .chat-assist-widget .chat-textarea::-webkit-scrollbar-thumb:hover {
            background-color: rgba(0, 0, 0, 0.4);
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
            bottom: -100px; /* Start off-screen at the bottom */
            width: 60px;
            height: 60px;
            border-radius: var(--chat-radius-full);
            color: white;
            border: 1px solid var(--chat-color-primary);
            cursor: pointer;
            box-shadow: var(--chat-shadow-lg);
            z-index: 2000000003;
            transition: transform 0.8s cubic-bezier(0.68, -0.55, 0.265, 1.55), opacity 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            gap: 10px;
            background-color: var(--chat-color-surface);
            will-change: transform; /* Optimize animation performance */
            opacity: 1;
        }
        .chat-assist-widget .chat-launcher.right-side { 
            right: 20px; 
            margin: 10px 15px; 
        }
        .chat-assist-widget .chat-launcher.left-side { 
            left: 20px; 
        }
        .chat-assist-widget .chat-launcher.visible {
            transform: translateY(-120px); /* Slide to final position (bottom: 20px) */
        }
        .chat-assist-widget .chat-launcher.hidden {
            opacity: 0;
            pointer-events: none;
            transform: translateY(-120px) scale(0.8);
        }
        .chat-assist-widget .chat-launcher.coin-flip {
            animation: coinFlip 1s ease-in-out forwards;
        }
        .chat-assist-widget .chat-launcher:hover {
            transform: translateY(-120px) scale(1.05); /* Maintain slide-up position on hover */
            box-shadow: var(--chat-shadow-lg);
        }
        .chat-assist-widget .chat-launcher svg,
        .chat-assist-widget .chat-launcher img {
            width: 28px;
            height: 28px;
        }
        .chat-assist-widget .chat-launcher-text { font-weight: 600; font-size: 15px; }
        .chat-assist-widget .suggested-questions {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin: 12px 0;
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
        .chat-assist-widget ::-webkit-scrollbar { width: 8px; }
        .chat-assist-widget ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        .chat-assist-widget ::-webkit-scrollbar-thumb { background: #c1c1c1; border-radius: 10px; }
        .chat-assist-widget ::-webkit-scrollbar-thumb:hover { background: #a8a8a8; }
        .chat-assist-widget .message-row {
            display: flex;
            gap: 10px;
            align-items: flex-end;
            margin: 2px 0;
            direction: ltr;
        }
        .chat-assist-widget .message-row.bot { justify-content: flex-start; }
        .chat-assist-widget .message-row.user { justify-content: flex-end; }
        .chat-assist-widget .chat-avatar {
            width: 32px; height: 32px; flex: 0 0 32px;
            border-radius: 50%;
            border: 1px solid var(--chat-color-border);
            background: #fff;
            object-fit: cover;
            box-shadow: var(--chat-shadow-sm);
        }
        .chat-assist-widget .message-row .chat-bubble {
            max-width: 78%;
            direction: rtl;
            animation: fadeInUp 0.2s ease-out;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(6px); }
            to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes coinFlip {
            0% { transform: translateY(-120px) perspective(500px) rotateY(0deg); }
            50% { transform: translateY(-120px) perspective(500px) rotateY(180deg) scale(1.2); }
            100% { transform: translateY(-120px) perspective(500px) rotateY(360deg); }
        }
        @media (max-width: 480px) {
            .chat-assist-widget .chat-window {
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                border-radius: 0;
                box-shadow: none;
                transform: translateY(100%);
                z-index: 2000000004;
            }
            .chat-assist-widget .chat-window.visible {
                transform: translateY(0);
            }
            .chat-assist-widget .chat-launcher {
                bottom: -100px; /* Start off-screen */
                z-index: 2000000003;
            }
            .chat-assist-widget .chat-launcher.right-side { 
                right: 15px; 
                margin: 10px; 
            }
            .chat-assist-widget .chat-launcher.left-side { 
                left: 15px; 
            }
            .chat-assist-widget .chat-launcher.visible {
                transform: translateY(-115px); /* Adjust for mobile (bottom: 15px) */
            }
            .chat-assist-widget .chat-launcher.hidden {
                transform: translateY(-115px) scale(0.8);
            }
            .chat-assist-widget .chat-launcher:hover {
                transform: translateY(-115px) scale(1.05);
            }
            .chat-assist-widget .chat-launcher.coin-flip {
                animation: coinFlipMobile 1s ease-in-out forwards;
            }
            @keyframes coinFlipMobile {
                0% { transform: translateY(-115px) perspective(500px) rotateY(0deg); }
                50% { transform: translateY(-115px) perspective(500px) rotateY(180deg) scale(1.2); }
                100% { transform: translateY(-115px) perspective(500px) rotateY(360deg); }
            }
            .chat-assist-widget .chat-header {
                padding: 20px 16px;
            }
            .chat-assist-widget .chat-messages {
                padding: 16px;
            }
            .chat-assist-widget .chat-controls {
                padding: 12px;
            }
            .chat-assist-widget .chat-bubble {
                max-width: 90%;
            }
            .chat-assist-widget .message-row .chat-bubble {
                max-width: 85%;
            }
        }
        @media (max-width: 768px) and (min-width: 481px) {
            .chat-assist-widget .chat-window {
                width: 90%;
                max-width: 400px;
                height: 70%;
                max-height: 600px;
                left: 50%;
                transform: translateX(-50%) translateY(20px) scale(0.95);
            }
            .chat-assist-widget .chat-window.visible {
                transform: translateX(-50%) translateY(0) scale(1);
            }
            .chat-assist-widget .chat-launcher.right-side,
            .chat-assist-widget .chat-launcher.left-side {
                left: 50%;
                transform: translateX(-50%);
                margin: 0;
            }
            .chat-assist-widget .chat-launcher.visible {
                transform: translateX(-50%) translateY(-120px);
            }
            .chat-assist-widget .chat-launcher.hidden {
                transform: translateX(-50%) translateY(-120px) scale(0.8);
            }
            .chat-assist-widget .chat-launcher:hover {
                transform: translateX(-50%) translateY(-120px) scale(1.05);
            }
            @keyframes coinFlip {
                0% { transform: translateX(-50%) translateY(-120px) perspective(500px) rotateY(0deg); }
                50% { transform: translateX(-50%) translateY(-120px) perspective(500px) rotateY(180deg) scale(1.2); }
                100% { transform: translateX(-50%) translateY(-120px) perspective(500px) rotateY(360deg); }
            }
        }
        @media (max-width: 1024px) and (min-width: 769px) {
            .chat-assist-widget .chat-window {
                width: 380px;
                height: 580px;
            }
            .chat-assist-widget .chat-launcher.right-side { 
                right: 25px; 
            }
            .chat-assist-widget .chat-launcher.left-side { 
                left: 25px; 
            }
        }
        @media (min-width: 1025px) {
            .chat-assist-widget .chat-window {
                width: 400px;
                height: 600px;
            }
            .chat-assist-widget .chat-launcher.right-side { 
                right: 30px; 
            }
            .chat-assist-widget .chat-launcher.left-side { 
                left: 30px; 
            }
        }
        @media (max-height: 600px) {
            .chat-assist-widget .chat-window:not(.fullscreen-mode) {
                height: 80vh;
                max-height: 500px;
            }
            .chat-assist-widget .chat-messages {
                max-height: calc(80vh - 140px);
            }
        }
    `;
    document.head.appendChild(widgetStyles);

    // Default configuration with Persian text
    const defaultSettings = {
        webhook: { url: '', route: '' },
        branding: {
            logo: '',
            botAvatar: 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp',
            userAvatar: '',
            name: 'پشتیبانی آنلاین',
            welcomeText: 'سلام! چطور می‌توانم به شما کمک کنم؟',
            responseTimeText: '',
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
        ]
    };

    // Merge user settings with defaults
    const settings = window.ChatWidgetConfig ? {
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

    const chatWindow = document.createElement('div');
    chatWindow.className = `chat-window ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;

    // Header logo fallback
    const headerLogoSrc = settings.branding.logo || settings.branding.botAvatar || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';

    // HTML structure with new header buttons
    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${headerLogoSrc}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <div class="chat-header-actions">
                <button class="chat-action-btn chat-reset-btn" title="شروع مجدد">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
                </button>
                <button class="chat-action-btn chat-clear-btn" title="پاک کردن گفتگو">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                </button>
            </div>
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

    const launchButton = document.createElement('button');
    launchButton.className = `chat-launcher ${settings.style.position === 'left' ? 'left-side' : 'right-side'}`;
    launchButton.innerHTML = `<img src='https://parsipost.ir/wp-content/uploads/2025/08/icon.webp' style="width: 64px;height: 64px;" alt="chat">`;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    // Animation logic: Slide up after 3 seconds, coin-flip after 2 more seconds
    setTimeout(() => {
        launchButton.classList.add('visible');
        setTimeout(() => {
            launchButton.classList.add('coin-flip');
            setTimeout(() => {
                launchButton.classList.remove('coin-flip');
            }, 1000); // Remove coin-flip class after animation duration
        }, 2000); // Coin-flip after 2 seconds
    }, 3000); // Slide-up after 3 seconds

    // Get references to elements
    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const chatBody = chatWindow.querySelector('.chat-body');
    const messagesContainer = chatWindow.querySelector('.chat-messages');
    const messageTextarea = chatWindow.querySelector('.chat-textarea');
    const sendButton = chatWindow.querySelector('.chat-submit');
    const clearChatButton = chatWindow.querySelector('.chat-clear-btn');
    const resetChatButton = chatWindow.querySelector('.chat-reset-btn');

    function createSessionId() { return crypto.randomUUID(); }

    function linkifyText(text) {
        const urlPattern = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
        return text.replace(urlPattern, url => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="chat-link">${url}</a>`);
    }

    function createMessageElement(side, content) {
        const row = document.createElement('div');
        row.className = `message-row ${side}`;
        if (side === 'bot') {
            const avatar = document.createElement('img');
            avatar.className = 'chat-avatar bot-avatar';
            avatar.src = settings.branding.botAvatar || settings.branding.logo || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';
            avatar.alt = 'ربات';
            row.appendChild(avatar);
        }
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${side === 'user' ? 'user-bubble' : 'bot-bubble'}`;
        if (content && 'html' in content) bubble.innerHTML = content.html;
        else if (content && 'text' in content) bubble.textContent = content.text;
        else bubble.textContent = '';
        row.appendChild(bubble);
        if (side === 'user' && settings.branding.userAvatar) {
            const avatar = document.createElement('img');
            avatar.className = 'chat-avatar user-avatar';
            avatar.src = settings.branding.userAvatar;
            avatar.alt = 'کاربر';
            row.appendChild(avatar);
        }
        return row;
    }

    function createTypingIndicator() {
        const row = document.createElement('div');
        row.className = 'message-row bot';
        const avatar = document.createElement('img');
        avatar.className = 'chat-avatar bot-avatar';
        avatar.src = settings.branding.botAvatar || settings.branding.logo || 'https://parsipost.ir/wp-content/uploads/2025/08/icon.webp';
        avatar.alt = 'ربات';
        const indicator = document.createElement('div');
        indicator.className = 'typing-indicator';
        indicator.innerHTML = `<div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div>`;
        row.appendChild(avatar);
        row.appendChild(indicator);
        return row;
    }

    async function fetchInitialMessage() {
        isWaitingForResponse = true;
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const initialData = {
                action: "sendMessage",
                sessionId: conversationId,
                route: settings.webhook.route,
                chatInput: "START_CHAT_SESSION",
                metadata: { isInitialMessage: true }
            };
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept-Language': 'fa-IR' },
                body: JSON.stringify(initialData)
            });
            const responseData = await response.json();
            if (typingIndicator.parentNode) typingIndicator.remove();

            const messageText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            const botRow = createMessageElement('bot', { html: linkifyText(messageText) });
            messagesContainer.appendChild(botRow);

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
            if (typingIndicator.parentNode) typingIndicator.remove();
            const botRow = createMessageElement('bot', { text: "متأسفیم، ارتباط با سرور برقرار نشد. لطفاً بعداً تلاش کنید." });
            messagesContainer.appendChild(botRow);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } finally {
            isWaitingForResponse = false;
        }
    }

    async function startChat() {
        chatWelcome.style.display = 'none';
        chatBody.classList.add('active');
        chatWindow.classList.add('chat-session-active');
        conversationId = createSessionId();
        await fetchInitialMessage();
    }

    function clearChat() {
        const allMessages = messagesContainer.querySelectorAll('.message-row, .suggested-questions');
        if (allMessages.length <= 1) return;
        for (let i = 1; i < allMessages.length; i++) {
            allMessages[i].remove();
        }
    }

    async function resetChat() {
        messagesContainer.innerHTML = '';
        conversationId = createSessionId();
        await fetchInitialMessage();
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
        const userRow = createMessageElement('user', { text: messageText });
        messagesContainer.appendChild(userRow);
        const typingIndicator = createTypingIndicator();
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            const response = await fetch(settings.webhook.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept-Language': 'fa-IR' },
                body: JSON.stringify(requestData)
            });
            const responseData = await response.json();
            if (typingIndicator.parentNode) typingIndicator.remove();
            const responseText = Array.isArray(responseData) ? responseData[0].output : responseData.output;
            const botRow = createMessageElement('bot', { html: linkifyText(responseText) });
            messagesContainer.appendChild(botRow);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Message submission error:', error);
            if (typingIndicator.parentNode) typingIndicator.remove();
            const botRow = createMessageElement('bot', { text: "متأسفیم، ارسال پیام شما با مشکل مواجه شد. لطفاً دوباره تلاش کنید." });
            messagesContainer.appendChild(botRow);
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

    clearChatButton.addEventListener('click', clearChat);
    resetChatButton.addEventListener('click', resetChat);

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
        // Hide launcher when chat is opened
        if (chatWindow.classList.contains('visible')) {
            launchButton.classList.add('hidden');
        } else {
            launchButton.classList.remove('hidden');
        }
    });

    const closeButtons = chatWindow.querySelectorAll('.chat-close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            chatWindow.classList.remove('visible');
            // Show launcher when chat is closed
            launchButton.classList.remove('hidden');
        });
    });
})();
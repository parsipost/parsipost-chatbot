(function() {
    if (window.N8nChatWidgetLoaded) return;
    window.N8nChatWidgetLoaded = true;

    // فونت وزیر (فارسی)
    const fontElement = document.createElement('link');
    fontElement.rel = 'stylesheet';
    fontElement.href = 'https://cdn.jsdelivr.net/npm/vazirmatn@33.003.05/Vazirmatn-font-face.css';
    document.head.appendChild(fontElement);

    const widgetStyles = document.createElement('style');
    widgetStyles.textContent = `
        .chat-assist-widget {
            direction: rtl;
            font-family: 'Vazirmatn', sans-serif;
            --chat-color-primary: #e22a22;
            --chat-color-secondary: #b81e1e;
            --chat-color-light: #f9d6d6;
            --chat-color-surface: #ffffff;
            --chat-color-text: #2d3748;
            --chat-color-text-light: #718096;
            --chat-color-border: #e2e8f0;
            --chat-shadow-lg: 0 10px 25px rgba(0,0,0,0.15);
            --chat-radius-md: 12px;
            --chat-radius-lg: 18px;
        }

        .chat-assist-widget .chat-window {
            position: fixed;
            bottom: 90px;
            width: 360px;
            height: 560px;
            background: var(--chat-color-surface);
            border-radius: var(--chat-radius-lg);
            box-shadow: var(--chat-shadow-lg);
            border: 1px solid var(--chat-color-border);
            overflow: hidden;
            display: none;
            flex-direction: column;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all .35s ease;
        }
        .chat-assist-widget .chat-window.visible {
            display: flex;
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        .chat-assist-widget .chat-window.right-side { right: 20px; }
        .chat-assist-widget .chat-window.left-side { left: 20px; }

        .chat-assist-widget .chat-header {
            padding: 14px 16px;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: #fff;
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
        }

        .chat-assist-widget .chat-header-logo {
            width: 32px; height: 32px;
            border-radius: 8px;
            background: #fff;
            padding: 4px;
        }
        .chat-assist-widget .chat-header-title { font-size: 15px; }

        .chat-assist-widget .chat-close-btn {
            margin-right: auto;
            background: rgba(255,255,255,.2);
            border: none;
            color: white;
            border-radius: 50%;
            width: 28px;
            height: 28px;
            cursor: pointer;
            transition: 0.25s;
        }
        .chat-assist-widget .chat-close-btn:hover { background: rgba(255,255,255,.35); }

        .chat-assist-widget .chat-welcome {
            text-align: center;
            padding: 28px;
        }
        .chat-assist-widget .chat-welcome-title {
            font-size: 18px;
            font-weight: 700;
            color: var(--chat-color-text);
            margin-bottom: 18px;
        }
        .chat-assist-widget .chat-start-btn {
            padding: 12px 20px;
            border: none;
            border-radius: var(--chat-radius-md);
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
            font-weight: 600;
            cursor: pointer;
            transition: 0.3s;
        }
        .chat-assist-widget .chat-start-btn:hover { transform: translateY(-2px); }

        .chat-assist-widget .chat-body { display: none; flex-direction: column; height: 100%; }
        .chat-assist-widget .chat-body.active { display: flex; }

        .chat-assist-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 18px;
            background: #f7f8fa;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .chat-assist-widget .chat-bubble {
            padding: 12px 16px;
            border-radius: var(--chat-radius-md);
            max-width: 85%;
            font-size: 14px;
            line-height: 1.6;
            word-wrap: break-word;
        }
        .chat-assist-widget .chat-bubble.user-bubble {
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: #fff;
            align-self: flex-start;
            border-bottom-left-radius: 4px;
        }
        .chat-assist-widget .chat-bubble.bot-bubble {
            background: #fff;
            color: var(--chat-color-text);
            align-self: flex-end;
            border-bottom-right-radius: 4px;
            border: 1px solid var(--chat-color-border);
        }

        .chat-assist-widget .chat-controls {
            padding: 12px;
            border-top: 1px solid var(--chat-color-border);
            background: #fff;
            display: flex;
            gap: 10px;
        }
        .chat-assist-widget .chat-textarea {
            flex: 1;
            border-radius: var(--chat-radius-md);
            border: 1px solid var(--chat-color-border);
            padding: 12px 14px;
            resize: none;
            font-family: inherit;
            font-size: 14px;
        }
        .chat-assist-widget .chat-submit {
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: #fff;
            border: none;
            border-radius: var(--chat-radius-md);
            width: 48px; height: 48px;
            cursor: pointer;
        }

        .chat-assist-widget .chat-launcher {
            position: fixed;
            bottom: 20px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat-color-primary), var(--chat-color-secondary));
            color: white;
            padding: 0 20px;
            height: 50px;
            display: flex; align-items: center; gap: 8px;
            cursor: pointer;
            border: none;
            box-shadow: var(--chat-shadow-lg);
        }
        .chat-assist-widget .chat-launcher.right-side { right: 20px; }
        .chat-assist-widget .chat-launcher.left-side { left: 20px; }
    `;
    document.head.appendChild(widgetStyles);

    // تنظیمات فارسی
    const settings = {
        branding: {
            logo: '',
            name: 'پشتیبانی آنلاین',
            welcomeText: 'سلام! چطور می‌تونم کمکتون کنم؟',
            responseTimeText: 'پاسخگویی در کمتر از ۲ دقیقه'
        }
    };

    const widgetRoot = document.createElement('div');
    widgetRoot.className = 'chat-assist-widget';

    const chatWindow = document.createElement('div');
    chatWindow.className = 'chat-window right-side';

    const welcomeScreenHTML = `
        <div class="chat-header">
            <img class="chat-header-logo" src="${settings.branding.logo}" alt="${settings.branding.name}">
            <span class="chat-header-title">${settings.branding.name}</span>
            <button class="chat-close-btn">×</button>
        </div>
        <div class="chat-welcome">
            <h2 class="chat-welcome-title">${settings.branding.welcomeText}</h2>
            <button class="chat-start-btn">شروع گفتگو</button>
            <p class="chat-response-time">${settings.branding.responseTimeText}</p>
        </div>
        <div class="chat-body">
            <div class="chat-messages"></div>
            <div class="chat-controls">
                <textarea class="chat-textarea" placeholder="پیام خود را بنویسید..." rows="1"></textarea>
                <button class="chat-submit">➤</button>
            </div>
        </div>
    `;
    chatWindow.innerHTML = welcomeScreenHTML;

    const launchButton = document.createElement('button');
    launchButton.className = 'chat-launcher right-side';
    launchButton.innerHTML = `💬 <span>چت آنلاین</span>`;

    widgetRoot.appendChild(chatWindow);
    widgetRoot.appendChild(launchButton);
    document.body.appendChild(widgetRoot);

    const startChatButton = chatWindow.querySelector('.chat-start-btn');
    const chatWelcome = chatWindow.querySelector('.chat-welcome');
    const chatBody = chatWindow.querySelector('.chat-body');

    startChatButton.addEventListener('click', () => {
        chatWelcome.style.display = 'none';
        chatBody.classList.add('active');
    });

    launchButton.addEventListener('click', () => {
        chatWindow.classList.toggle('visible');
    });

    chatWindow.querySelector('.chat-close-btn').addEventListener('click', () => {
        chatWindow.classList.remove('visible');
    });
})();

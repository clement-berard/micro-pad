export const html = (padId: string) => `
<!DOCTYPE html>
<html>
<head>
    <title>Pad: ${padId}</title>
    <style>
        body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
        }
        body {
            transition: background-color 0.3s, color 0.3s;
        }
        body.dark-mode {
            background-color: #1a1a1a;
            color: #ffffff;
        }
        #editor {
            width: 100%;
            height: 100%;
            border: none;
            resize: none;
            padding: 20px;
            box-sizing: border-box;
            font-family: monospace;
            font-size: 16px;
            outline: none;
            background: transparent;
            color: inherit;
            transition: background-color 0.3s, color 0.3s;
        }
        #controls {
            position: fixed;
            top: 10px;
            right: 10px;
            display: flex;
            gap: 10px;
            z-index: 1000;
        }
        .icon-button {
            width: 32px;
            height: 32px;
            border: none;
            background: #eee;
            cursor: pointer;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: background-color 0.3s;
        }
        .dark-mode .icon-button {
            background: #333;
            color: white;
        }
        .icon-button:hover {
            background: #ddd;
        }
        .dark-mode .icon-button:hover {
            background: #444;
        }
    </style>
</head>
<body>
    <div id="controls">
        <button class="icon-button" id="darkModeToggle" title="Toggle Dark Mode">
            🌙
        </button>
        <button class="icon-button" id="fullscreenToggle" title="Toggle Fullscreen">
            ⛶
        </button>
    </div>
    <textarea id="editor"></textarea>
    <script>
        // Dark mode
        const darkModeToggle = document.getElementById('darkModeToggle');
        const body = document.body;
        
        // Charger la préférence dark mode
        const isDarkMode = localStorage.getItem('darkMode') === 'true';
        if (isDarkMode) {
            body.classList.add('dark-mode');
            darkModeToggle.textContent = '☀';
        }

        darkModeToggle.addEventListener('click', () => {
            body.classList.toggle('dark-mode');
            const isDark = body.classList.contains('dark-mode');
            localStorage.setItem('darkMode', isDark);
            darkModeToggle.textContent = isDark ? '☀' : '🌙';
        });

        // Fullscreen
        const fullscreenToggle = document.getElementById('fullscreenToggle');

        fullscreenToggle.addEventListener('click', () => {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.error('Fullscreen error:', err);
                });
            } else {
                document.exitFullscreen();
            }
        });

        document.addEventListener('fullscreenchange', () => {
            fullscreenToggle.textContent = document.fullscreenElement ? '⛶' : '⛶';
        });

        // WebSocket et autre code existant
        const padId = "${padId}";
        const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const ws = new WebSocket(\`\${wsProtocol}//\${window.location.host}\`);
        const editor = document.getElementById('editor');
        let ignoreChange = false;

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'join', padId }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'content') {
                ignoreChange = true;
                editor.value = message.content;
                ignoreChange = false;
            }
        };

        function sendUpdate() {
            ws.send(JSON.stringify({
                type: 'update',
                content: editor.value
            }));
        }

        let updateTimeout;
        editor.addEventListener('input', () => {
            if (ignoreChange) return;
            clearTimeout(updateTimeout);
            updateTimeout = setTimeout(sendUpdate, 50);
        });

        editor.addEventListener('cut', () => {
            if (ignoreChange) return;
            setTimeout(sendUpdate, 0);
        });

        editor.addEventListener('paste', () => {
            if (ignoreChange) return;
            setTimeout(sendUpdate, 0);
        });

        editor.addEventListener('keydown', (e) => {
            if (ignoreChange) return;
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (editor.value === '') {
                    sendUpdate();
                }
            }
        });
    </script>
</body>
</html>
`;

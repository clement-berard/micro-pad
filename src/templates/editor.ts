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
        }
    </style>
</head>
<body>
    <textarea id="editor"></textarea>
    <script>
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

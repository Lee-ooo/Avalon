const socket = io.connect('http://127.0.0.1:5000'); // 连接到后端

// 连接到服务器时的处理
socket.on('connect', () => {
    console.log('连接到服务器');
});

// 接收新消息
socket.on('new_message', (data) => {
    const chatBox = document.getElementById('chat-box');
    const newMessage = document.createElement('p');
    newMessage.textContent = `${data.nickname}: ${data.message}`;
    chatBox.appendChild(newMessage);
});

// 发送消息
document.getElementById('send-message').addEventListener('click', () => {
    const nickname = prompt("请输入你的昵称："); // 测试用昵称
    const message = document.getElementById('message').value;
    socket.emit('send_message', { nickname, message });
    document.getElementById('message').value = '';
});
document.addEventListener('DOMContentLoaded', () => {
    const popupTrigger = document.getElementById('popup-trigger');
    const popupContainer = document.getElementById('popup-container');
    const popupInput = document.getElementById('popup-input');

    // 监听按钮点击事件，显示输入框
    popupTrigger.addEventListener('click', () => {
        popupContainer.style.display = 'block'; // 显示弹窗
        popupInput.focus(); // 自动聚焦输入框
    });

    // 监听输入框的回车事件
    popupInput.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
            const inputValue = popupInput.value.trim(); // 获取输入值并去掉两端空格

            if (inputValue) {
                // 使用 fetch 发送 POST 请求到 Flask 后端
                fetch('/submit-input', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ input: inputValue }), // 将输入内容作为 JSON 发送
                })
                .then(response => response.json())
                .then(data => {
                    console.log('服务器响应:', data);
                    alert(data.message || '输入成功');
                })
                .catch(error => {
                    console.error('请求出错:', error);
                    alert('请求失败');
                });
            }

            // 清空输入框并隐藏弹窗
            popupInput.value = '';
            popupContainer.style.display = 'none';
        }
    });
});


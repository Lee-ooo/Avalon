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

let players = {
    1: null,
    2: null,
    3: null,
    4: null,
    5: null,
    6: null,
    7: null,
    8: null,
    9: null,
    10: null,
    11: null,
    12: null
};

let playerid = null;

// 发送消息
document.addEventListener('DOMContentLoaded', () => {
    const popupContainer = document.getElementById('popup-container');
    const popupInput = document.getElementById('popup-input');

    const playerNames = [
        "1", "2", "3", "4", "5", "6",
        "7", "8", "9", "10", "11", "12"
    ];

    for (let i = 1; i <= 12; i++) {
        let playerDiv = document.getElementById(`player${i}`);

        if (players[i]) {
            // 如果有玩家，设置背景为红色并显示玩家的名字
            playerDiv.style.backgroundColor = 'red';
            playerDiv.textContent = players[i].slice(0, 2);  // 显示玩家名字的前两个字母
        } else {
            // 如果没有玩家，保持绿色背景
            playerDiv.style.backgroundColor = 'green';  // 设置背景颜色为绿色
            playerDiv.textContent = '';  // 没人时不显示文本
        }
    }

    // 页面加载时自动弹出输入框
    popupContainer.style.display = 'block';

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
                    body: JSON.stringify({ input: inputValue }) // 发送用户输入
                })
                .then(response => response.json())
                .then(data => {
                    console.log('服务器响应:', data);
                    messageContainer = document.getElementById('player1');
                    messageContainer.textContent = data.input;
                    playerid = data.input;
                    let output = data.input;
                    output = '欢迎,'+output;
                    alert(output || '输入成功');
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

window.addEventListener('beforeunload', function (event) {
    // 发送请求通知服务器玩家退出
    fetch('/player-quit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ player_id: playerid })  // 假设有玩家 ID
    });

    // 你可以在这里添加额外的处理，例如保存玩家数据等
});
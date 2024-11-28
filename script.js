const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
const statusElement = document.getElementById("status");

let audioStream; // 音频流
let mediaRecorder; // 音频录制器
let webSocket; // WebSocket 连接
let audioContext;
let source;
let processor;

// 初始化 WebSocket 连接
function initWebSocket() {
    webSocket = new WebSocket("ws://localhost:8080");
    webSocket.onopen = () => {
        statusElement.textContent = "状态: 已连接到 WebSocket 服务器";
        console.log("WebSocket 连接已打开");
    };
    webSocket.onclose = () => {
        statusElement.textContent = "状态: WebSocket 已断开";
        console.log("WebSocket 连接已关闭");
    };
    webSocket.onerror = (error) => {
        statusElement.textContent = "状态: WebSocket 出现错误";
        console.error("WebSocket 错误:", error);
    };
}

// 开始录音
async function startRecording() {
    try {
        // 请求麦克风权限
        audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // 创建 Web Audio API 的上下文和处理器
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        source = audioContext.createMediaStreamSource(audioStream);
        processor = audioContext.createScriptProcessor(4096, 1, 1);

        // 将音频数据发送到 WebSocket
        processor.onaudioprocess = (event) => {
            if (webSocket && webSocket.readyState === WebSocket.OPEN) {
                const audioData = event.inputBuffer.getChannelData(0);
                const float32Array = new Float32Array(audioData);
                webSocket.send(float32Array.buffer); // 将音频数据以二进制形式发送
            }
        };

        // 连接音频流和处理器
        source.connect(processor);
        processor.connect(audioContext.destination);

        // 更新按钮状态
        startButton.disabled = true;
        stopButton.disabled = false;
        statusElement.textContent = "状态: 正在录音并传输";
    } catch (error) {
        console.error("无法启动录音:", error);
        statusElement.textContent = "状态: 启动录音失败";
    }
}

// 停止录音
function stopRecording() {
    if (audioStream) {
        audioStream.getTracks().forEach((track) => track.stop());
    }
    if (processor) {
        processor.disconnect();
    }
    if (source) {
        source.disconnect();
    }
    if (audioContext) {
        audioContext.close();
    }

    // 更新按钮状态
    startButton.disabled = false;
    stopButton.disabled = true;
    statusElement.textContent = "状态: 已停止录音";
}

// 按钮事件绑定
startButton.addEventListener("click", () => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
        initWebSocket();
    }
    startRecording();
});

stopButton.addEventListener("click", stopRecording);

import asyncio
import websockets
import pyaudio
import struct

# WebSocket 服务器地址
SERVER_URL = "ws://localhost:8080"

# 设置音频流参数
FORMAT = pyaudio.paInt16  # 音频格式
CHANNELS = 1  # 单声道
RATE = 44100  # 采样率
CHUNK = 1024  # 音频数据块大小

# 初始化 pyaudio
p = pyaudio.PyAudio()

# 开始录音
stream = p.open(format=FORMAT,
                channels=CHANNELS,
                rate=RATE,
                input=True,
                frames_per_buffer=CHUNK)


async def send_audio_data():
    async with websockets.connect(SERVER_URL) as websocket:
        print("WebSocket 已连接，开始发送音频数据")
        while True:
            # 从麦克风捕获一块数据
            audio_data = stream.read(CHUNK)

            # 发送音频数据到服务器
            await websocket.send(audio_data)


asyncio.run(send_audio_data())

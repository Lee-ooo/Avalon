import asyncio
import websockets

async def audio_handler(websocket, path):
    print("客户端已连接")
    try:
        while True:
            # 接收来自客户端的音频数据
            audio_data = await websocket.recv()
            print(f"收到音频数据，大小: {len(audio_data)} 字节")
            # 在这里处理音频数据，比如保存或传递给其他应用
    except websockets.exceptions.ConnectionClosed as e:
        print(f"客户端已断开连接，原因: {e.reason}")
    except Exception as e:
        print(f"处理音频数据时发生错误: {e}")

async def main():
    # 启动 WebSocket 服务器
    server = await websockets.serve(audio_handler, "localhost", 8080)
    print("WebSocket 服务器已启动，监听端口 8080")
    await asyncio.Future()  # 保持事件循环运行

# 启动事件循环
if __name__ == "__main__":
    asyncio.run(main())

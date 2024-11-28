from flask import Flask, render_template, request, jsonify
from flask_socketio import SocketIO, emit, join_room, leave_room
from game_logic import AvalonGame

app = Flask(__name__)
app.secret_key = 'your_secret_key'
socketio = SocketIO(app, cors_allowed_origins="*")  # 确保跨域允许

game = AvalonGame()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/join', methods=['POST'])
def join_game():
    nickname = request.form.get('nickname')
    if not nickname:
        return "昵称不能为空", 400
    success = game.add_player(nickname)
    return "加入成功" if success else "游戏已满，加入观众席"

@socketio.on('connect')
def handle_connect():
    emit('status', {'msg': '玩家已连接'}, broadcast=True)

@socketio.on('send_message')
def handle_message(data):
    nickname = data.get('nickname', '匿名玩家')
    message = data.get('message', '')
    emit('new_message', {'nickname': nickname, 'message': message}, broadcast=True)

@socketio.on('disconnect')
def handle_disconnect():
    emit('status', {'msg': '玩家已断开连接'}, broadcast=True)


# 定义处理输入的路由
@app.route('/submit-input', methods=['POST'])
def submit_input():
    # 从请求中获取 JSON 数据
    data = request.get_json()

    # 获取用户输入的值
    user_input = data.get('input', None)

    if user_input:
        print(f"Received user input: {user_input}")
        # 你可以在这里执行其他逻辑，比如存储数据、验证输入等
        return jsonify({"message": "输入已收到", "input": user_input})
    else:
        return jsonify({"error": "没有输入内容"}), 400  # 返回400错误，表示没有输入内容


if __name__ == '__main__':
    socketio.run(app)

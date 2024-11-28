from utils.roles import assign_roles

class AvalonGame:
    def __init__(self):
        self.players = []  # 玩家信息
        self.audience = []  # 观众
        self.game_started = False
        self.current_phase = None
        self.roles_assigned = False
        self.admin = None

    def add_player(self, nickname):
        """玩家加入游戏"""
        if len(self.players) < 12:
            self.players.append({'nickname': nickname, 'role': None})
            if not self.admin:
                self.admin = nickname  # 第一个加入的玩家为管理员
            return True
        else:
            self.audience.append(nickname)
            return False

    def start_game(self):
        """开始游戏"""
        if len(self.players) < 5:
            raise ValueError("至少需要 5 名玩家才能开始游戏")
        self.game_started = True
        self.assign_roles()
        self.current_phase = "team_nomination"  # 游戏开始进入任务提名阶段

    def assign_roles(self):
        """分配角色"""
        roles = assign_roles(len(self.players))
        for i, player in enumerate(self.players):
            player['role'] = roles[i]
        self.roles_assigned = True

    def get_game_state(self):
        """获取游戏状态，返回 JSON 格式的状态"""
        return {
            "players": [
                {"nickname": p["nickname"], "role": p["role"] if self.roles_assigned else "unknown"}
                for p in self.players
            ],
            "audience_count": len(self.audience),
            "game_started": self.game_started,
            "current_phase": self.current_phase,
            "admin": self.admin,
        }

    def is_admin(self, nickname):
        """检查玩家是否为管理员"""
        return self.admin == nickname

    def nominate_team(self, team):
        """提名任务团队"""
        if self.current_phase != "team_nomination":
            raise ValueError("当前不是任务提名阶段")
        if len(team) != self.get_team_size():
            raise ValueError("任务队伍人数不正确")
        self.current_phase = "team_vote"

    def vote_team(self, votes):
        """处理投票结果"""
        if self.current_phase != "team_vote":
            raise ValueError("当前不是投票阶段")
        if len(votes) != len(self.players):
            raise ValueError("所有玩家都需要投票")
        if votes.count("approve") > len(self.players) / 2:
            self.current_phase = "mission_execution"
        else:
            self.current_phase = "team_nomination"

    def execute_mission(self, results):
        """执行任务"""
        if self.current_phase != "mission_execution":
            raise ValueError("当前不是任务执行阶段")
        if results.count("fail") >= self.get_fail_threshold():
            self.current_phase = "game_over"
            return "fail"
        self.current_phase = "team_nomination"
        return "success"

    def get_team_size(self):
        """返回当前任务所需队伍人数"""
        return {5: 2, 6: 2, 7: 3, 8: 3, 9: 3, 10: 4, 11: 4, 12: 5}[len(self.players)]

    def get_fail_threshold(self):
        """返回任务失败票数要求"""
        return 1 if len(self.players) < 7 else 2

    def end_game(self):
        """结束游戏"""
        self.game_started = False
        self.roles_assigned = False
        self.current_phase = None
        self.players.clear()
        self.audience.clear()
        self.admin = None

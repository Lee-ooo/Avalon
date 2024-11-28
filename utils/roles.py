import random

def assign_roles(player_count):
    """根据玩家数量分配角色"""
    if player_count < 5:
        raise ValueError("至少需要 5 名玩家才能开始游戏")

    base_roles = ["Merlin", "Assassin", "Loyal Servant", "Minion of Mordred"]
    extra_roles = [
        "Percival", "Morgana", "Mordred", "Oberon", "Loyal Servant", "Minion of Mordred"
    ]
    all_roles = base_roles + extra_roles[:player_count - len(base_roles)]
    random.shuffle(all_roles)
    return all_roles

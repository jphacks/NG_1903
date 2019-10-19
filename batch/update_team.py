import random
import uuid

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

NUM_TEAM_MEMBER = 3
BLOCK_SIZE = NUM_TEAM_MEMBER * 2


def create_team(new_team_id, current_week_id, next_week_id, arr_members_id):
    users_ref = db.reference('/Users')
    users = users_ref.get()
    teams_ref = db.reference('/Teams')

    team_goal = 0
    members = {}
    member_index = 1
    for member_id in arr_members_id:
        team_goal += users[str(member_id)]['weeklyDistance'][str(current_week_id)]
        members[member_id] = {
            "userId": member_id
        }
        member_index += 1

    teams_ref.child(next_week_id).child(new_team_id).set({
        "teamGoal": team_goal,
        "users": members
    })


def update_team(current_week_id, next_week_id):
    ranks_ref = db.reference('/ranks')
    ranks = ranks_ref.get()
    ranks = ranks[next_week_id]
    ranks = [x for x in ranks if x is not None]  # 謎None対策

    num_full_member_block = len(ranks) / BLOCK_SIZE
    for i in range(int(num_full_member_block)):
        tmp = {}
        # ブロックサイズのユーザを取り出す
        for j in range(BLOCK_SIZE):
            index = i * int(num_full_member_block) + j + 1
            tmp[index] = ranks[index]

        # チームをつくる
        for j in range(int(BLOCK_SIZE / NUM_TEAM_MEMBER)):
            team_members_keys = random.sample(list(tmp.keys()), NUM_TEAM_MEMBER)
            team_members_ids = []
            for key in team_members_keys:
                team_members_ids.append(ranks[key]['user_id'])
            tmpi = sorted(team_members_keys, reverse=True)
            for key in tmpi:
                del tmp[key]
                del ranks[key]
            create_team(new_team_id=str(uuid.uuid4()), current_week_id=current_week_id, next_week_id=next_week_id, arr_members_id=team_members_ids)
    # len(ranks) <= NUM_TEAM_MEMBERなときは、ブロック関係なく組んでしまう
    if len(ranks) <= NUM_TEAM_MEMBER:
        team_members_keys = random.sample(list(ranks.keys()), NUM_TEAM_MEMBER)
        team_members_ids = []
        tmpi = sorted(team_members_keys, reverse=True)
        for key in tmpi:
            team_members_ids.append(ranks[key]['user_id'])
            del ranks[key]
        create_team(new_team_id=str(uuid.uuid4()), current_week_id=current_week_id, next_week_id=next_week_id, arr_members_id=team_members_ids)
    # 残り
    team_members_keys = list(ranks.keys())
    team_members_ids = []
    tmpi = sorted(team_members_keys, reverse=True)
    for key in tmpi:
        team_members_ids.append(ranks[key]['user_id'])
        del ranks[key]
    create_team(new_team_id=str(uuid.uuid4()), current_week_id=current_week_id, next_week_id=next_week_id, arr_members_id=team_members_ids)

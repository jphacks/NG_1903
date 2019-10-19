import firebase_admin
from firebase_admin import credentials, db


def calc_new_rate(old_rate, is_complete_team_goal, ran_distance, team_goal_distance, num_team_member):
    if is_complete_team_goal:
        # チーム目標達成
        # 100 * (自分の走った距離 / (チーム目標/チームメンバー数))
        delta_rate = 100 * (ran_distance / (team_goal_distance/num_team_member))
    else:
        # チーム目標未達成
        # -100 * (1-(自分の距離 / (チーム目標/チームメンバー数)))
        delta_rate = -100 * (1-(ran_distance / (team_goal_distance/num_team_member)))

    new_rate = old_rate + delta_rate

    # レートが0未満にならないようにする
    if new_rate <= 0.0:
        new_rate = 0.0

    return new_rate


def update_rate(current_week_id, next_week_id):
    teams_ref = db.reference('/Teams')
    teams = teams_ref.get()
    users_ref = db.reference('/Users')
    users = users_ref.get()
    for user_id in users:
        user = users[str(user_id)]
        old_rate = user['rate'][str(current_week_id)]
        ran_distance = user['weeklyDistance'][str(current_week_id)]

        team_id = user['teamId'][str(current_week_id)]
        team = teams[str(team_id)]
        team_goal_distance = float(team['teamGoal'])

        team_members = team['users']
        # 謎のNoneが入るので、対策
        team_members = [x for x in team_members if x is not None]

        num_team_member = len(team_members)
        team_ran_distance = float(0)
        for member in team_members:
            if member is None:
                continue
            member_user_id = member['userId']
            member_user = users[str(member_user_id)]
            member_ran_distance = float(member_user['weeklyDistance'][str(current_week_id)])
            team_ran_distance += member_ran_distance
        if team_ran_distance >= team_goal_distance:
            is_complete_team_goal = True
        else:
            is_complete_team_goal = False

        new_rate = calc_new_rate(
            old_rate=old_rate, ran_distance=ran_distance,
            is_complete_team_goal=is_complete_team_goal,
            team_goal_distance=team_goal_distance,
            num_team_member=num_team_member
        )
        updates = {}
        updates['/{user_id}/rate/{week_id}'.format(user_id=str(user_id), week_id=str(next_week_id))] = new_rate
        users_ref.update(updates)

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db


def update_rank(current_week_id, next_week_id):
    ranks_ref = db.reference('/ranks')

    ranking = {}
    users_ref = db.reference('/Users')
    users = users_ref.get()
    for users_key in users:
        user = users[users_key]
        ranking[users_key] = {
            "rate": user['rate'][next_week_id],
            "name": user['userName']
        }
    ranking = sorted(ranking.items(), key=lambda x: x[1]['rate'], reverse=True)
    print(ranking)

    rank_num = 1
    rank = {}
    for rank_data in ranking:
        rank[str(rank_num)] = {
            "user_id": rank_data[0],
            "rate": rank_data[1]['rate'],
            "name": rank_data[1]["name"]
        }
        rank_num += 1

    ranks_ref.child(next_week_id).set(
        rank
    )

import uuid

import firebase_admin
from firebase_admin import credentials
from firebase_admin import db

from batch import update_rate, update_rank, update_team


def main():
    cred = credentials.Certificate('../tapidora-63973-firebase-adminsdk-lzcfe-fb0238ec1f.json')
    firebase_admin.initialize_app(cred, {
        'databaseURL': 'https://tapidora-63973.firebaseio.com/'
    })

    batch_ref = db.reference('/batch')
    batch = batch_ref.get()

    # ロック状態にする
    updates = {}
    updates['/is_running'] = True
    batch_ref.update(updates)

    current_week_id = batch['current_week_id']
    next_week_id = str(uuid.uuid4())

    # レート更新
    update_rate.update_rate(current_week_id=current_week_id, next_week_id=next_week_id)
    # ランキング生成
    update_rank.update_rank(current_week_id=current_week_id, next_week_id=next_week_id)
    # チームマッチング
    update_team.update_team(current_week_id=current_week_id, next_week_id=next_week_id)

    # week_idの更新
    updates = {}
    updates['/current_week_id'] = next_week_id
    batch_ref.update(updates)

    # ロック状態を解除
    updates = {}
    updates['/is_running'] = False
    batch_ref.update(updates)


if __name__ == '__main__':
    main()

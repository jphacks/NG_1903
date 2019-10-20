from flask import Flask, jsonify, request, redirect
import json
import time
import datetime, pytz
import os
from google.auth.transport import requests
import hashlib
from google.oauth2 import id_token
from flask_cors import CORS
import firebase_admin
from firebase_admin import credentials, db
from flask_login import (
    LoginManager,
    current_user,
    login_required,
    login_user,
    logout_user,
)
from oauthlib.oauth2 import WebApplicationClient
import uuid

from batch import update_rate, update_rank, update_team

cred = credentials.Certificate("tapidora-63973-firebase-adminsdk-lzcfe-fb0238ec1f.json")
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://tapidora-63973.firebaseio.com/'
})

app = Flask(__name__)
CORS(app)

# tokenの有効時間(秒)
TOKEN_VALID_TIME = 1.0 * 60.0 * 60.0 * 24 * 7 * 100

# GOOGLE_CLIENT_ID
GOOGLE_CLIENT_ID = '142703424738-kkqmrm6eejec9hnkdglr7npotj1ijqr4.apps.googleusercontent.com'



def token_verified(token, userid):
    ref = db.reference('/Users/' + userid)
    user_info = ref.get()
    db_token = user_info['apiToken']
    if token[0:7] == "Bearer ":
        token = token[7:]

    if db_token != token:
        return False

    valid_time = user_info['valid_time']
    if valid_time < time.time():
        return False

    return True


@app.route('/login', methods=["POST"])
def verify_token():
    if request.method == "POST":
        user_token = json.loads(request.get_data())['token']
        try:
            # Specify the CLIENT_ID of the app that accesses the backend:
            idinfo = id_token.verify_oauth2_token(user_token, requests.Request(), GOOGLE_CLIENT_ID)


            # Or, if multiple clients access the backend server:
            # idinfo = id_token.verify_oauth2_token(token, requests.Request())
            # if idinfo['aud'] not in [CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]:
            #     raise ValueError('Could not verify audience.')

            if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
                raise ValueError('Wrong issuer.')

            # If auth request is from a G Suite domain:
            # if idinfo['hd'] != GSUITE_DOMAIN_NAME:
            #     raise ValueError('Wrong hosted domain.')

            # ID token is valid. Get the user's Google Account ID from the decoded token.
            # sub is user primary id
            googleId = idinfo['sub']

            email_verified = idinfo['email_verified']

            # email検証がTrueかどうか
            if not email_verified:
                raise ValueError("email_verified false")


            # クライアントの検証
            if idinfo['aud'] != GOOGLE_CLIENT_ID:
                raise ValueError("Bad")

            email = idinfo['email']
            userName = idinfo['name']
            now_time = time.time()

            global TOKEN_VALID_TIME

            valid_time = now_time + TOKEN_VALID_TIME

            token_org_str = userName + googleId + str(valid_time)

            return_token = hashlib.sha256(token_org_str.encode()).hexdigest()

            ref = db.reference('/Users')
            userId = ""
            snapshot = ref.order_by_child("googleId").equal_to(googleId).get()
            if not snapshot:
                user_ref = ref.push()
                userId = user_ref.key
            else:
                if len(snapshot) == 1:
                    # 普通にやっていればgoogleIdは重複しない
                    for key in snapshot:
                        userId = key
                        user_ref = ref.child(userId)


            batch_ref = db.reference('/batch')
            batch_data = batch_ref.get()
            weekId = batch_data['current_week_id']
            weekId = str(weekId)

            user_ref.update({
                'apiToken': return_token,
                'valid_time': valid_time,
                'userName': userName,
                'email': email,
                'googleToken' : user_token,
                "googleId" : googleId
            })

            if 'totalDistance' not in user_ref.get():
                user_ref.update({
                    'totalDistance' : 0
                })

            if 'before_pull_time' not in user_ref.get():
                default_push_time = nowtime_to_rcf3339()
                user_ref.update({
                    'before_pull_time': default_push_time
                })

            if 'weeklyDistance' not in user_ref.get():
                weeklyDistance_ref = user_ref.child('weeklyDistance')
                weeklyDistance_ref.update({
                    weekId: 0
                })
            else:
                weeklyDistance_ref = user_ref.child('weeklyDistance')
                if weekId not in weeklyDistance_ref.get():
                    weeklyDistance_ref.update({
                        weekId : 0
                    })


            now_week_tames = db.reference('/Teams/' + weekId)
            new_Team_ref = now_week_tames.push()
            new_TeamId = new_Team_ref.key
            # 1人チームを作成
            new_Team_ref.update({
                "teamGoal" : 10,
                "users": {
                    "1" : {
                        "userId" : userId
                    }
                }
            })

            user_ref.update({
                'teamId' : {
                    weekId : new_TeamId
                },
                'rate' : {
                    weekId : 0
                }
            })

            ret_data = {
                'userId' : userId,
                'apiToken' : return_token,
                'teamID' : new_TeamId,
                'userName' : userName,
                'verified' : True
            }

            print(ret_data)

            return jsonify(ret_data)


        except Exception as e:
            print(e)
            # Invalid token
            ret_data = {
                'userId' : "Notset",
                'apiToken' : 'Notset',
                "teamID": "Notset",
                "userName": "Notset",
                'verified' : False
            }
            return ret_data

@app.route('/user',methods=['OPTION'])
def preflight():
    return "OK"

@app.route('/user/<userId>', methods=['GET'])
def get_user_info(userId):
    ret_data = {
                'rate': -99,
                'weeklyDistance': -99,
                'totalDistance': -99,
                'token_verified_flag': False
            }

    if request.method == 'GET':
        # posted_json = json.loads(request.get_data())
        # token = posted_json['apiToken']
        # userId = posted_json['userId']

        token = request.headers.get("Authorization")

        if not token_verified(token=token, userid=userId):
            return ret_data

        user_ref = db.reference('/Users/' + userId)

        user_info = user_ref.get()

        batch_ref = db.reference('/batch')
        batch_data = batch_ref.get()

        totalDistance = user_info['totalDistance']

        rate_ref =user_ref.child('rate')

        weekId = batch_data['current_week_id']
        weekId = str(weekId)

        rate_data = rate_ref.get()
        rate = rate_data[weekId]

        weeklyDistance = user_info['weeklyDistance'][weekId]


        ret_data = {
            'rate' : rate,
            'weeklyDistance': weeklyDistance,
            'totalDistance': totalDistance,
            'token_verified_flag': True
        }
        print(ret_data)


    return jsonify(ret_data)

@app.route('/team',methods=['OPTION'])
def team_preflight():
    return "OK"

@app.route('/team/<teamId>', methods=["GET"])
def get_team_info(teamId):

    ret_data = {
        'teamGoal': -99,
        'teamMember' : [
        {
          'userName': 'dummy',
          'userData':{
            'rate': -50,
            'weeklyDistance': -50,
            'totalDistance': -50
            }
        }
        ],
        'token_verified_flag': False

    }

    if request.method == "GET":
        # posted_json = json.loads(request.get_data())
        # token = posted_json['apiToken']
        # userid = posted_json['userId']

        token = request.headers.get("Authorization")
        userId = request.headers.get("UserID")

        if not token_verified(token=token, userid=userId):
            return ret_data

        user_ref = db.reference('/Users/' + userId)

        user_info = user_ref.get()

        batch_ref = db.reference('/batch')
        batch_data = batch_ref.get()

        user_teamId_ref = user_ref.child('teamId')

        weekId = batch_data['current_week_id']
        weekId = str(weekId)
        teamId = user_teamId_ref.get()[weekId]

        teams_teamId_ref = db.reference('Teams/' + weekId + '/' + teamId)

        team_data = teams_teamId_ref.get()

        teamGoal = team_data['teamGoal']
        users = team_data['users']
        team_menber = []

        for index in users:
            if index == None:
                continue
            loop_user_id = index["userId"]

            loop_user_ref = db.reference('Users/' + loop_user_id)
            loop_user_data = loop_user_ref.get()

            loop_user_rate = loop_user_data['rate'][weekId]
            loop_user_weeklyDistance = loop_user_data['weeklyDistance'][weekId]
            loop_user_totalDistance = loop_user_data['totalDistance']
            loop_userName = loop_user_data['userName']

            team_menber_add_data = {
              "userName": loop_userName,
              "userData":{
                "rate": loop_user_rate,
                "weeklyDistance": loop_user_weeklyDistance,
                "totalDistance": loop_user_totalDistance
                }
            }
            team_menber.append(team_menber_add_data)

        ret_data = {
            "teamGoal": teamGoal,
            "teamMember" : team_menber
        }


        return jsonify(ret_data)


# google fit とかでデータを更新した時に呼んで欲しい関数
# 最後にデータを送信した時間を更新します
def push_data_time_update(userId):
    user_ref = db.reference('/Users/' + userId)
    user_ref.update({
        "before_pull_time" : nowtime_to_rcf3339()
    })


# 今の所タイムゾーンは全て日本
def nowtime_to_rcf3339():
    dt = datetime.datetime.now(tz=pytz.timezone('Japan'))
    ret_str = dt.strftime('%Y/%m/%dT%H:%M:%S%z')
    return ret_str

# デバッグ用
@app.route("/")
def dummy_data_create():
    ref = db.reference()
    names = ["Tom", "Ant", "Ken", "Bob", "Rinrin", "Sayo", "Rute", "Rob"]
    import random
    for index, userName in enumerate(names):
        apiToken = "apiToken"
        googleToken = "googleToken"
        totalDistance = 0
        batch_ref = db.reference('/batch')
        batch_data = batch_ref.get()

        user_teamId_ref = user_ref.child('teamId')

        weekId = batch_data['current_week_id']
        weekId = str(weekId)

        rate = {
            weekId : random.randint(0, 500)
        }

        weeklyDistance = {
            weekId : random.randint(0, 20)
        }
        user_teamId = "402"
        if index >= len(names)/2:
            user_teamId = "5000"

        teamId = {
            weekId : user_teamId
        }
        userId = hashlib.sha256(userName.encode()).hexdigest()

        push_data = {
            "userName": userName,
            "googleToken": googleToken,
            "apiToken" : apiToken,
            "totalDistance" : totalDistance,
            "googleId" : "googleId" + str(index),
            # "rate" : rate,
            # "weeklyDistance" : weeklyDistance,
            "teamId" : teamId,
            "before_pull_time" : nowtime_to_rcf3339()
        }

        user_ref = db.reference("/Users/" + userId)
        user_ref.update(push_data)
        team_ref = db.reference("/Teams/" + weekId + '/' + user_teamId + "/users/")
        # team_ref.update({
        #     "teamGoal": random.randint(100, 200)
        # })
        team_ref = team_ref.child(str((index)%4 + 1 ))
        team_ref.update({
            "teamGoal": 100,
            "userId" : userId
        })

    return "OK"


@app.route("/test")
def test():
    ref = db.reference('/Users')
    googleId = "45"
    snapshot = ref.order_by_child("googleId").equal_to(googleId).get()
    if not snapshot:
        user_ref = ref.push()
        userId = user_ref.key
    else:
        if len(snapshot) == 1:
            # 普通にやっていればgoogleIdは重複しない
            for key in snapshot:
                userId = key
                user_ref = ref.child(userId)


    return snapshot


@app.route("/cron")
def cron_run():
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

    return jsonify({'result': 'ok'})


if __name__ == '__main__':
    app.run()

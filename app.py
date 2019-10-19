from flask import Flask, jsonify, request, redirect
import json
import time
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
    ref = db.reference('/' + userid)
    user_info = ref.get()
    db_token = user_info['token']
    if db_token != token:
        return False

    valid_time = user_info['valid_time']
    if valid_time < time.time():
        return False

    return True


@app.route('/login', methods=["POST"])
def verify_token():
    if request.method == "POST":
        # print(request.form)
        # print('body: {}'.format(request.get_data()))
        user_token = json.loads(request.get_data())['token']
        # print(tmp)
        # user_token = request.form["token"]
        # print(user_token)
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
            userid = idinfo['sub']

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

            token_org_str = userName + userid + str(valid_time)

            return_token = hashlib.sha256(token_org_str.encode()).hexdigest()

            ref = db.reference('/Users')
            user_ref = ref.child(userName)

            batch_ref = db.reference('/batch')
            batch_data = batch_ref.get()
            weekId = batch_data['weekId']

            user_ref.update({
                'apiToken': return_token,
                'valid_time': valid_time,
                'userName': userName,
                'email': email,
                'googleToken' : user_token,
                'totalDistanve' : 0
            })

            weeklyDistance_ref = user_ref.child('weeklyDistance')
            weeklyDistance_ref.update({
                weekId : 0
            })

            ret_data = {
                'userId' : userid,
                'apiToken' : return_token,
                'teamID' : "3",
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


@app.route('/user', methods=['POST'])
def get_user_info():
    ret_data = {
                'rate': -99,
                'weeklyDistance': -99,
                'totalDistance': -99,
                'token_verified_flag': False
            }

    if request.method == 'POST':
        token = request.form['apiToken']
        userid = request.form['userId']

        if not token_verified(token=token, userid=userid):
            return ret_data

        user_ref = db.reference('/Users/' + userid)

        user_info = user_ref.get()

        batch_ref = db.reference('/batch')
        batch_data = batch_ref.get()

        weeklyDistance = user_info['weeklyDistance']
        totalDistance = user_info['totalDistance']

        rate_ref =user_ref.child('rate')

        weekId = batch_data['weekId']

        rate_data = rate_ref.get()
        rate = rate_data[weekId]

        ret_data = {
            'rate' : rate,
            'weeklyDistance': weeklyDistance,
            'totalDistance': totalDistance,
            'token_verified_flag': True
        }

    return jsonify(ret_data)


@app.route('/team', methods=["POST"])
def get_team_info():

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

    if request.method == "POST":
        token = request.form['apiToken']
        userid = request.form['userId']

        if not token_verified(token=token, userid=userid):
            return ret_data

        user_ref = db.reference('/Users/' + userid)

        user_info = user_ref.get()

        batch_ref = db.reference('/batch')
        batch_data = batch_ref.get()

        user_teamId_ref = user_ref.child('teamId')

        weekId = batch_data['weekId']

        teamId = user_teamId_ref[weekId]

        teams_teamId_ref = db.reference('Teams/' + teamId)

        team_data = teams_teamId_ref.get()

        teamGoal = team_data['teamGoal']
        users = team_data['users']
        team_menber = []
        for index in users:
            loop_user_id = users[index]["userId"]

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


@app.route('/mile_add', methods=["POST"])
def user_mile_add():
    if request.method == "POST":
        ref = db.reference('/Users/lock')
        user_data = ref.get()
        if not user_data:
            return "None_Users_Data"
        totalDistance = user_data["totalDistance"]
        totalDistance += 100
        this_week_mileage = user_data["weeklyDistance"]
        this_week_mileage += 50

        ret_data = {
            "totalDistance" : totalDistance
        }
        ref.update(ret_data)
        return jsonify(ret_data)

    ret_data = {

    }
    return ret_data

def week_reset():
    ref = db.reference('/Users')
    ref_data = ref.get()
    for user in ref_data:
        print(user)
        user_ref = ref.child(user)
        user_ref.update({
            # 'this_week_goal': 200,
            'weeklyDistance': 0
        })

# デバッグ用
@app.route("/")
def dummy_data_create():
    ref = db.reference()
    names = ["Tom", "Ant", "Ken", "Bob", "Rinrin", "Sayo", "Rute", "Rob"]
    import random
    weekId = "1234567890"
    for index, userName in enumerate(names):
        apiToken = "apiToken"
        googleToken = "googleToken"
        totalDistance = 0
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
            "rate" : rate,
            "weeklyDistance" : weeklyDistance,
            "teamId" : teamId
        }

        user_ref = db.reference("/Users/" + userId)
        user_ref.update(push_data)
        team_ref = db.reference("/Teams/" + user_teamId + "/users/")
        team_ref.update({
            "teamGoal": random.randint(100, 200)
        })
        team_ref = team_ref.child(str((index)%4 + 1 ))
        team_ref.update({
            "userId" : userId
        })


if __name__ == '__main__':
    app.run()

from flask import Flask, jsonify, request, redirect
import json
import time
import os
import requests
import hashlib
from google.oauth2 import id_token
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

# tokenの有効時間(秒)
TOKEN_VALID_TIME = 1.0 * 60.0 * 60.0

try:
    GOOGLE_CLIENT_ID = os.environ.get("GOOGLE_CLIENT_ID", None)
except KeyError:
    GOOGLE_CLIENT_ID = "DEFAULT"


def token_verified(token, user_name):
    ref = db.reference('/' + user_name)
    user_info = ref.get()
    db_token = user_info['token']
    if db_token != token:
        return False

    valid_time = user_info['valid_time']
    if valid_time < time.time():
        return False

    return True


@app.route('/')
def hello_world():
    return 'Hello World!'

@app.route('/login')
def login():
    return "logined"


@app.rouote('/verify_token', methods=["POST"])
def verify_token():
    if request.method == "POST":
        user_token = request.form["token"]
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
            user_name = idinfo['name']
            now_time = time.time()

            global TOKEN_VALID_TIME

            valid_time = now_time + TOKEN_VALID_TIME

            token_org_str = user_name + userid + str(valid_time)

            return_token = hashlib.sha256(token_org_str.encode()).hexdigest()

            ref = db.reference('/Users')
            user_ref = ref.child(user_name)

            before_login_time = user_ref.get()["before_login_time"]

            user_ref.update({
                'token': return_token,
                'valid_time': valid_time,
                'user_name': user_name,
                'email': email,
                'before_login_time' : now_time
            })

            ret_data = {
                'token' : return_token,
                'verified' : True,
                'before_login_time' : before_login_time
            }

            return ret_data


        except ValueError:
            # Invalid token
            ret_data = {
                'token' : 'NONE',
                'verified' : False
            }
            return ret_data


@app.route('/user', methods=['POST'])
def get_user_info():
    ret_data = {

    }



    if request.method == 'POST':
        token = request.form['apiToken']
        userid = request.form['userId']
        number = 5555
        ret_data = {
            'rate': number,
            'weeklyDistance': number,
            'totalDistance': number,
            'achievementRate': number # 達成率
        }

    return jsonify(ret_data)

@app.route('/mile_add', methods=["POST"])
def user_mile_add():
    if request.method == "POST":
        ref = db.reference('/Users/lock')
        user_data = ref.get()
        if not user_data:
            return "None_Users_Data"
        mileage = user_data["mileage"]
        mileage += 100
        this_week_mileage = user_data["this_week_mileage"]
        this_week_mileage += 50

        ret_data = {
            "mileage" : mileage
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
            'this_week_mileage': 0
        })

if __name__ == '__main__':
    app.run()

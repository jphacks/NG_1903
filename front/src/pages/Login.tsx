import React from 'react';
import  { GoogleLogin, GoogleLogout } from 'react-google-login'
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../types';
import { loginCreator, initLoginCreator } from '../actions/action';
import axios from 'axios';
import { URL } from '../App';
import { AppState } from '../store';
import { Button } from 'react-bootstrap';
import './title.css'
import Icon from './nice_run_icon.png';
import { RouteComponentProps, withRouter } from 'react-router-dom';


const Login: React.FC<RouteComponentProps> = props => {
    const dispatch = useDispatch()
    const login = (data: UserState) => dispatch(loginCreator(data))
    const userState = useSelector((state: AppState) => state.userState)


    const onSuccess = (response:any) => {
        console.log(response);
        //axios.post(URL + '/login', {token: response.tokenObj.id_token}).then(
        axios.get(URL + '/login').then(
            res => {
                login(res.data as UserState)
                props.history.push("/")
            }
        ).then(() => {
            console.log("success")

        })
    }

    console.log("login")
    console.log(userState)
    return (
        <div>
            <img className="icon"
                src={Icon}
            />
            <div className="title">
                Nice Run Club
            </div>
            <div className="loginFrame">
                <GoogleLogin
                    className="loginButton"
                    // clientId='142703424738-kkqmrm6eejec9hnkdglr7npotj1ijqr4.apps.googleusercontent.com'
                    clientId="433618952640-37ar21n8s7m5fhn728f23vjap40kou9s.apps.googleusercontent.com" //mock.onsd.now.sh
                    buttonText="Sign in With Google"
                    onSuccess={onSuccess}
                    onFailure={err => console.error(err)}
                    cookiePolicy={'single_host_origin'}
            />
            </div>
        </div>
    )
    
}

export default withRouter(Login)

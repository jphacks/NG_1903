import React from 'react';
import  { GoogleLogin, GoogleLogout } from 'react-google-login'
import { useDispatch, useSelector } from 'react-redux';
import { UserState } from '../types';
import { loginCreator, initLoginCreator } from '../actions/action';
import axios from 'axios';
import { URL } from '../App';
import { AppState } from '../store';
import { Button } from 'react-bootstrap';


const Login: React.FC = () => {
    const dispatch = useDispatch()
    const login = (data: UserState) => dispatch(loginCreator(data))
    const logout = () => dispatch(initLoginCreator())
    const userState = useSelector((state: AppState) => state.userState)


    const onSuccess = (response:any) => {
        console.log(response);
        // axios.post(URL + '/login', {token: response.accessToken}).then(
        axios.get(URL + '/login').then(
            res => {
                login(res.data as UserState)
            }
        )
    }

    console.log("login")
    console.log(userState)
    return (
        <div>
            <div>
                icon
            </div>
            <div>
                Nice Run Club
            </div>
            <GoogleLogin
                clientId="433618952640-37ar21n8s7m5fhn728f23vjap40kou9s.apps.googleusercontent.com"
                buttonText="Sign in With Google"
                onSuccess={onSuccess}
                onFailure={err => console.error(err)}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
    
}

export default Login
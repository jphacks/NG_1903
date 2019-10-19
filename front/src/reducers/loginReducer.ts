import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { UserState } from '../types';
import { loginCreator, initLoginCreator } from '../actions/action';

const initialState: UserState = {
    userId: '',
    userName: '',
    teamID: ''
}

export const LoginReducer = reducerWithInitialState(initialState)
    .case(loginCreator, (state, loginData) => {
        return Object.assign({}, state, {
            userId: loginData.userId,
            userName: loginData.userName,
            teamID: loginData.teamID
        })
    })
    .case(initLoginCreator,(state) => {
        return Object.assign({}, state, {
            userId: '',
            userName: '',
            teamID: ''
        })
    })
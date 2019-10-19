import { reducerWithInitialState } from 'typescript-fsa-reducers'
import { UserState } from '../types';
import { loginCreator, initLoginCreator } from '../actions/action';

const initialState: UserState = {
    userId: '',
    userName: 'TestUser'
}

export const LoginReducer = reducerWithInitialState(initialState)
    .case(loginCreator, (state, loginData) => {
        return Object.assign({}, state, {
            userId: loginData.userId,
            userName: loginData.userName
        })
    })
    .case(initLoginCreator,(state) => {
        return Object.assign({}, state, {
            userId: '',
            userName: '',
        })
    })
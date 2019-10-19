import actionCreatorFactory from 'typescript-fsa'
import { UserState } from '../types';
const actionCreator = actionCreatorFactory()

export const loginCreator = actionCreator<UserState>('LOGIN')
export const initLoginCreator = actionCreator('INITLOGIN')
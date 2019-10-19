import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { UserState } from './types';
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { LoginReducer } from './reducers/loginReducer';



export type AppState = {
    userState: UserState
}

const persistConfig = {
    key: 'root',
    storage,
    while: ['userState'],
}

const persistedReducer = persistReducer(persistConfig,
    combineReducers<AppState>({
        userState: LoginReducer,
    }))

const store = createStore(persistedReducer, {}, applyMiddleware(thunk))
export const persistor = persistStore(store)
export default store
    
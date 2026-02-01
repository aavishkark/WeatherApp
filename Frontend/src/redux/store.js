import { applyMiddleware, combineReducers, legacy_createStore } from "redux"
import { thunk } from "redux-thunk"
import { authReducer, weatherReducer, favoritesReducer } from "./reducers"

const rootReducer = combineReducers({
    authReducer,
    weatherReducer,
    favoritesReducer
})

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk))

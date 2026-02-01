import {
    POST_LOGIN_REQ, POST_LOGIN_SUCCESS, POST_LOGIN_FAILURE, SAVE_USER_DATA, POST_LOGOUT_REQ,
    POST_REGISTER_REQ, POST_REGISTER_SUCCESS, POST_REGISTER_FAILURE,
    GET_WEATHER_REQ, GET_WEATHER_SUCCESS, GET_WEATHER_FAILURE,
    SEARCH_CITY_REQ, SEARCH_CITY_SUCCESS, SEARCH_CITY_FAILURE,
    GET_FORECAST_REQ, GET_FORECAST_SUCCESS, GET_FORECAST_FAILURE, CLEAR_SEARCH,
    GET_FAVORITES_REQ, GET_FAVORITES_SUCCESS, GET_FAVORITES_FAILURE,
    ADD_FAVORITE_REQ, ADD_FAVORITE_SUCCESS, ADD_FAVORITE_FAILURE,
    REMOVE_FAVORITE_REQ, REMOVE_FAVORITE_SUCCESS, REMOVE_FAVORITE_FAILURE
} from "./types"

const authInitialState = {
    isAuth: false,
    isLoading: false,
    isError: false,
    errorMessage: "",
    user: {},
    registerSuccess: false
}

export const authReducer = (state = authInitialState, { type, payload }) => {
    switch (type) {
        case POST_LOGIN_REQ:
            return { ...state, isLoading: true, isError: false }
        case POST_LOGIN_SUCCESS:
            return { ...state, isLoading: false, isError: false, isAuth: true, user: payload }
        case POST_LOGIN_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case POST_REGISTER_REQ:
            return { ...state, isLoading: true, isError: false, registerSuccess: false }
        case POST_REGISTER_SUCCESS:
            return { ...state, isLoading: false, isError: false, registerSuccess: true }
        case POST_REGISTER_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg, registerSuccess: false }
        case SAVE_USER_DATA:
            return { ...state, user: payload.user, isAuth: payload.auth }
        case POST_LOGOUT_REQ:
            return { ...state, user: {}, isAuth: false }
        default:
            return state
    }
}

const weatherInitialState = {
    isLoading: false,
    isError: false,
    errorMessage: "",
    currentWeather: {},
    searchResults: [],
    forecast: {}
}

export const weatherReducer = (state = weatherInitialState, { type, payload }) => {
    switch (type) {
        case GET_WEATHER_REQ:
            return { ...state, isLoading: true, isError: false }
        case GET_WEATHER_SUCCESS:
            return { ...state, isLoading: false, isError: false, currentWeather: payload }
        case GET_WEATHER_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case SEARCH_CITY_REQ:
            return { ...state, isLoading: true, isError: false }
        case SEARCH_CITY_SUCCESS:
            return { ...state, isLoading: false, isError: false, searchResults: payload }
        case SEARCH_CITY_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case GET_FORECAST_REQ:
            return { ...state, isLoading: true, isError: false }
        case GET_FORECAST_SUCCESS:
            return { ...state, isLoading: false, isError: false, forecast: payload }
        case GET_FORECAST_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case CLEAR_SEARCH:
            return { ...state, searchResults: [] }
        default:
            return state
    }
}

const favoritesInitialState = {
    isLoading: false,
    isError: false,
    errorMessage: "",
    favorites: []
}

export const favoritesReducer = (state = favoritesInitialState, { type, payload }) => {
    switch (type) {
        case GET_FAVORITES_REQ:
            return { ...state, isLoading: true, isError: false }
        case GET_FAVORITES_SUCCESS:
            return { ...state, isLoading: false, isError: false, favorites: payload }
        case GET_FAVORITES_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case ADD_FAVORITE_REQ:
            return { ...state, isLoading: true, isError: false }
        case ADD_FAVORITE_SUCCESS:
            return { ...state, isLoading: false, isError: false }
        case ADD_FAVORITE_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        case REMOVE_FAVORITE_REQ:
            return { ...state, isLoading: true, isError: false }
        case REMOVE_FAVORITE_SUCCESS:
            return { ...state, isLoading: false, isError: false }
        case REMOVE_FAVORITE_FAILURE:
            return { ...state, isLoading: false, isError: true, errorMessage: payload.msg }
        default:
            return state
    }
}

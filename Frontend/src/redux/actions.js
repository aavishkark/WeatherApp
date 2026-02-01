import axios from "axios"
import {
    POST_LOGIN_FAILURE, POST_LOGIN_REQ, POST_LOGIN_SUCCESS, POST_LOGOUT_REQ,
    POST_REGISTER_FAILURE, POST_REGISTER_REQ, POST_REGISTER_SUCCESS, SAVE_USER_DATA,
    GET_WEATHER_REQ, GET_WEATHER_SUCCESS, GET_WEATHER_FAILURE,
    SEARCH_CITY_REQ, SEARCH_CITY_SUCCESS, SEARCH_CITY_FAILURE,
    GET_FORECAST_REQ, GET_FORECAST_SUCCESS, GET_FORECAST_FAILURE, CLEAR_SEARCH,
    GET_FAVORITES_REQ, GET_FAVORITES_SUCCESS, GET_FAVORITES_FAILURE,
    ADD_FAVORITE_REQ, ADD_FAVORITE_SUCCESS, ADD_FAVORITE_FAILURE,
    REMOVE_FAVORITE_REQ, REMOVE_FAVORITE_SUCCESS, REMOVE_FAVORITE_FAILURE, TOGGLE_TEMP_UNIT
} from "./types"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

export const postLogin = (data) => (dispatch) => {
    dispatch({ type: POST_LOGIN_REQ })
    return axios.post(`${BACKEND_URL}/users/login`, {
        email: data.email,
        password: data.password
    })
        .then((res) => {
            if (res.data.msg === 'Login Successfull') {
                localStorage.setItem('weatherapp', true)
                let userData = JSON.stringify(res.data.user)
                localStorage.setItem('user', userData)
                localStorage.setItem('userid', res.data.user._id)
                localStorage.setItem('token', res.data.token)
                dispatch(saveUserData({ user: res.data.user, auth: true }))
                dispatch({ type: POST_LOGIN_SUCCESS, payload: res.data.user })
            }
            else {
                localStorage.setItem('weatherapp', false)
                dispatch({ type: POST_LOGIN_FAILURE, payload: { msg: "Wrong Credentials" } })
            }
        })
        .catch((err) => {
            localStorage.setItem('weatherapp', false)
            dispatch({ type: POST_LOGIN_FAILURE, payload: { msg: err } })
        })
}

export const postRegister = (data) => (dispatch) => {
    dispatch({ type: POST_REGISTER_REQ })
    return axios.post(`${BACKEND_URL}/users/register`, {
        username: data.username,
        email: data.email,
        password: data.password
    })
        .then((res) => {
            if (res.data.msg === 'A user has been registered') {
                dispatch({ type: POST_REGISTER_SUCCESS, payload: res.data })
            }
            else {
                dispatch({ type: POST_REGISTER_FAILURE, payload: { msg: "Registration failed" } })
            }
        })
        .catch((err) => {
            dispatch({ type: POST_REGISTER_FAILURE, payload: { msg: err } })
        })
}

export const postLogout = () => (dispatch) => {
    localStorage.removeItem('user')
    localStorage.removeItem('userid')
    localStorage.removeItem('token')
    localStorage.setItem('weatherapp', false)
    dispatch({ type: POST_LOGOUT_REQ })
}

export const saveUserData = (data) => (dispatch) => {
    dispatch({ type: SAVE_USER_DATA, payload: data })
}

const CACHE_DURATION = 10 * 60 * 1000

const getCachedData = (key) => {
    const cached = localStorage.getItem(key)
    if (cached) {
        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp < CACHE_DURATION) {
            return data
        }
    }
    return null
}

const setCachedData = (key, data) => {
    localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }))
}

export const getWeather = (city) => (dispatch) => {
    dispatch({ type: GET_WEATHER_REQ })
    const cacheKey = `weather_${city.toLowerCase()}`
    const cached = getCachedData(cacheKey)

    if (cached) {
        dispatch({ type: GET_WEATHER_SUCCESS, payload: cached })
        return
    }

    return axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
        .then((res) => {
            setCachedData(cacheKey, res.data)
            dispatch({ type: GET_WEATHER_SUCCESS, payload: res.data })
        })
        .catch((err) => {
            dispatch({ type: GET_WEATHER_FAILURE, payload: { msg: err } })
        })
}

export const getWeatherByCoords = (lat, lon) => (dispatch) => {
    dispatch({ type: GET_WEATHER_REQ })
    const cacheKey = `weather_${lat}_${lon}`
    const cached = getCachedData(cacheKey)

    if (cached) {
        dispatch({ type: GET_WEATHER_SUCCESS, payload: cached })
        return
    }

    return axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then((res) => {
            setCachedData(cacheKey, res.data)
            dispatch({ type: GET_WEATHER_SUCCESS, payload: res.data })
        })
        .catch((err) => {
            dispatch({ type: GET_WEATHER_FAILURE, payload: { msg: err } })
        })
}

export const searchCity = (query) => (dispatch) => {
    dispatch({ type: SEARCH_CITY_REQ })
    return axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
        .then((res) => {
            dispatch({ type: SEARCH_CITY_SUCCESS, payload: res.data })
        })
        .catch((err) => {
            dispatch({ type: SEARCH_CITY_FAILURE, payload: { msg: err } })
        })
}

export const getForecast = (lat, lon) => (dispatch) => {
    dispatch({ type: GET_FORECAST_REQ })
    const cacheKey = `forecast_${lat}_${lon}`
    const cached = getCachedData(cacheKey)

    if (cached) {
        dispatch({ type: GET_FORECAST_SUCCESS, payload: cached })
        return
    }

    return axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        .then((res) => {
            setCachedData(cacheKey, res.data)
            dispatch({ type: GET_FORECAST_SUCCESS, payload: res.data })
        })
        .catch((err) => {
            dispatch({ type: GET_FORECAST_FAILURE, payload: { msg: err } })
        })
}

export const clearSearch = () => (dispatch) => {
    dispatch({ type: CLEAR_SEARCH })
}

export const getFavorites = () => (dispatch) => {
    const token = localStorage.getItem('token')
    dispatch({ type: GET_FAVORITES_REQ })
    return axios.get(`${BACKEND_URL}/favorites/allfavorites`, {
        headers: { token: `Bearer ${token}` }
    })
        .then((res) => {
            dispatch({ type: GET_FAVORITES_SUCCESS, payload: res.data.Favorites })
        })
        .catch((err) => {
            dispatch({ type: GET_FAVORITES_FAILURE, payload: { msg: err } })
        })
}

export const addFavorite = (data) => (dispatch) => {
    const token = localStorage.getItem('token')
    const userid = localStorage.getItem('userid')
    dispatch({ type: ADD_FAVORITE_REQ })
    return axios.post(`${BACKEND_URL}/favorites/addfavorite`, {
        userId: userid,
        cityName: data.cityName,
        country: data.country,
        lat: data.lat,
        lon: data.lon
    }, {
        headers: { token: `Bearer ${token}` }
    })
        .then((res) => {
            dispatch({ type: ADD_FAVORITE_SUCCESS, payload: res.data })
            dispatch(getFavorites())
        })
        .catch((err) => {
            dispatch({ type: ADD_FAVORITE_FAILURE, payload: { msg: err } })
        })
}

export const removeFavorite = (id) => (dispatch) => {
    const token = localStorage.getItem('token')
    dispatch({ type: REMOVE_FAVORITE_REQ })
    return axios.delete(`${BACKEND_URL}/favorites/removefavorite/${id}`, {
        headers: { token: `Bearer ${token}` }
    })
        .then((res) => {
            dispatch({ type: REMOVE_FAVORITE_SUCCESS, payload: res.data })
            dispatch(getFavorites())
        })
        .catch((err) => {
            dispatch({ type: REMOVE_FAVORITE_FAILURE, payload: { msg: err } })
        })
}

export const toggleTempUnit = () => (dispatch) => {
    dispatch({ type: TOGGLE_TEMP_UNIT })
}

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { addFavorite, getFavorites, removeFavorite, getWeather, getForecast } from '../../redux/actions'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'

import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import MapIcon from '@mui/icons-material/Map'
import Tooltip from '@mui/material/Tooltip'
import axios from 'axios'
import WeatherDetails from '../../components/WeatherDetails/WeatherDetails'
import Forecast from '../../components/Forecast/Forecast'
import WeatherChart from '../../components/WeatherChart/WeatherChart'
import { formatTemp, isDaytime, getMoonPhase } from '../../utils/weatherUtils'
import WeatherLoader from '../../components/Loading/WeatherLoader'

const City = () => {
    const { name } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { favorites } = useSelector((store) => store.favoritesReducer)
    const { currentWeather, errorMessage, isLoading } = useSelector((store) => store.weatherReducer)
    const { celsius } = useSelector((store) => store.preferencesReducer)

    const isFavorite = favorites?.some(fav => fav.cityName?.toLowerCase() === name?.toLowerCase())

    useEffect(() => {
        dispatch(getFavorites())
        if (name) {
            dispatch(getWeather(name))
        }
    }, [dispatch, name])

    useEffect(() => {
        if (currentWeather?.coord) {
            dispatch(getForecast(currentWeather.coord.lat, currentWeather.coord.lon))
        }
    }, [currentWeather, dispatch])

    const handleFavoriteToggle = () => {
        if (isFavorite) {
            const fav = favorites.find(f => f.cityName?.toLowerCase() === name?.toLowerCase())
            if (fav) dispatch(removeFavorite(fav._id))
        } else {
            dispatch(addFavorite({ cityName: name, country: currentWeather?.sys?.country || '' }))
        }
    }

    if (isLoading && !currentWeather?.name) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                <WeatherLoader />
            </Box>
        )
    }

    if (errorMessage) {
        return (
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Typography color="error">{errorMessage}</Typography>
            </Container>
        )
    }

    if (!currentWeather || !currentWeather.weather) {
        return null
    }

    const iconCode = currentWeather.weather?.[0]?.icon

    return (
        <Box sx={{ minHeight: '100vh', pb: 4 }}>
            <Container maxWidth="md" sx={{ pt: 10, pb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                    <IconButton onClick={() => navigate(-1)} sx={{ ml: -1 }}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="View on Map">
                            <IconButton
                                onClick={() => navigate(`/maps?lat=${currentWeather.coord?.lat}&lon=${currentWeather.coord?.lon}&city=${currentWeather.name}`)}
                                sx={{
                                    background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                    color: 'white',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    }
                                }}
                            >
                                <MapIcon />
                            </IconButton>
                        </Tooltip>
                        <IconButton onClick={handleFavoriteToggle} sx={{ color: isFavorite ? 'error.main' : 'inherit' }}>
                            {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                    </Box>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h4" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {currentWeather.name}
                    </Typography>
                    <Typography sx={{ opacity: 0.8, fontSize: '0.9rem' }}>
                        {currentWeather.sys?.country}
                    </Typography>
                </Box>

                <Box sx={{ textAlign: 'center', mb: 4 }}>
                    {iconCode && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: -2 }}>
                            <Typography sx={{ fontSize: '4rem', lineHeight: 1 }}>
                                {isDaytime(currentWeather.dt, currentWeather.sys?.sunrise, currentWeather.sys?.sunset)
                                    ? '☀️'
                                    : getMoonPhase(new Date())}
                            </Typography>
                            <img
                                src={`https://openweathermap.org/img/wn/${iconCode}@4x.png`}
                                alt=""
                                style={{ width: 120, height: 120 }}
                            />
                        </Box>
                    )}
                    <Typography sx={{ fontSize: '5rem', fontWeight: 200, lineHeight: 1 }}>
                        {formatTemp(currentWeather.main?.temp, celsius)}°
                    </Typography>
                    <Typography sx={{ fontSize: '1.1rem', opacity: 0.9, textTransform: 'capitalize', mt: 1 }}>
                        {currentWeather.weather?.[0]?.description}
                    </Typography>
                    <Typography sx={{ fontSize: '0.9rem', opacity: 0.7, mt: 0.5 }}>
                        Feels like {formatTemp(currentWeather.main?.feels_like, celsius)}°
                    </Typography>
                </Box>

                <WeatherDetails weather={currentWeather} />

                <WeatherChart />

                <Forecast city={name} />
            </Container>
        </Box>
    )
}

export default City
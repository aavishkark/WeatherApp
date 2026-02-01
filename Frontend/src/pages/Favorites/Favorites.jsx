import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getFavorites, removeFavorite, addFavorite } from '../../redux/actions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { formatTemp, isDaytime, getMoonPhase, calculateAQI } from '../../utils/weatherUtils'
import MapIcon from '@mui/icons-material/Map'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import WeatherLoader from '../../components/Loading/WeatherLoader'
import SearchBar from '../../components/SearchBar/SearchBar'

const countryCities = {
    IN: ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
    US: ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Miami', 'Seattle'],
    GB: ['London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 'Bristol'],
    DEFAULT: ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai']
}

const Favorites = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { favorites, isLoading } = useSelector((store) => store.favoritesReducer)
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const [weatherData, setWeatherData] = useState({})
    const [suggestedCities, setSuggestedCities] = useState([])
    const [isSuggestionsLoading, setIsSuggestionsLoading] = useState(true)
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

    useEffect(() => {
        dispatch(getFavorites())

        setIsSuggestionsLoading(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    axios.get(`https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`)
                        .then(res => {
                            const code = res.data?.[0]?.country
                            setSuggestedCities(countryCities[code] || countryCities.DEFAULT)
                        })
                        .catch(() => setSuggestedCities(countryCities.DEFAULT))
                        .finally(() => setIsSuggestionsLoading(false))
                },
                () => {
                    setSuggestedCities(countryCities.DEFAULT)
                    setIsSuggestionsLoading(false)
                }
            )
        } else {
            setSuggestedCities(countryCities.DEFAULT)
            setIsSuggestionsLoading(false)
        }
    }, [dispatch, API_KEY])

    useEffect(() => {
        if (favorites && favorites.length > 0) {
            favorites.forEach(fav => {
                if (!weatherData[fav.cityName]) {
                    axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${fav.cityName}&appid=${API_KEY}&units=metric`)
                        .then(res => {
                            const { lat, lon } = res.data.coord
                            axios.get(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`)
                                .then(aqiRes => {
                                    const pm25 = aqiRes.data.list[0]?.components?.pm2_5
                                    const aqi = calculateAQI(pm25)
                                    setWeatherData(prev => ({ ...prev, [fav.cityName]: { ...res.data, aqi } }))
                                })
                                .catch(() => {
                                    setWeatherData(prev => ({ ...prev, [fav.cityName]: res.data }))
                                })
                        })
                        .catch(() => { })
                }
            })
        }
    }, [favorites, API_KEY])

    const favoriteNames = favorites?.map(f => f.cityName?.toLowerCase()) || []
    const filteredSuggestions = suggestedCities.filter(city => !favoriteNames.includes(city.toLowerCase()))


    return (
        <Box sx={{ p: 3, pt: 10, maxWidth: 600, mx: 'auto' }}>
            <Typography variant="h4" component="h1" sx={{ mb: 3, fontWeight: 700, textAlign: 'center' }}>
                Your Favorites
            </Typography>
            <Box sx={{ mb: 4 }}>
                <SearchBar />
            </Box>
            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '20vh', mb: 4 }}>
                    <WeatherLoader />
                </Box>
            ) : favorites && favorites.length > 0 && (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    mb: 4
                }}>
                    {favorites.map((fav) => {
                        const weather = weatherData[fav.cityName]
                        const iconCode = weather?.weather?.[0]?.icon
                        return (
                            <Box
                                key={fav._id}
                                onClick={() => navigate(`/city/${fav.cityName}`)}
                                sx={{
                                    p: 2.5,
                                    borderRadius: 3,
                                    bgcolor: 'background.paper',
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transition: 'box-shadow 0.2s',
                                    '&:hover': {
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                <Box
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        dispatch(removeFavorite(fav._id))
                                    }}
                                    sx={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 10,
                                        color: '#ccc',
                                        cursor: 'pointer',
                                        fontSize: '1.1rem',
                                        lineHeight: 1,
                                        '&:hover': { color: '#999' }
                                    }}
                                >
                                    ×
                                </Box>
                                <Typography sx={{ fontSize: '0.9rem', fontWeight: 500, mb: 0.5 }}>
                                    {fav.cityName}
                                </Typography>
                                <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mb: 2, textTransform: 'capitalize' }}>
                                    {weather?.weather?.[0]?.description || '—'}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Typography sx={{ fontSize: '2.5rem', fontWeight: 300, lineHeight: 1 }}>
                                        {weather ? formatTemp(weather.main?.temp, celsius) : '—'}°
                                    </Typography>
                                    {iconCode && (
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Typography sx={{ fontSize: '1.5rem', mr: 1, lineHeight: 1 }}>
                                                {isDaytime(weather.dt, weather.sys?.sunrise, weather.sys?.sunset)
                                                    ? '☀️'
                                                    : getMoonPhase(new Date())}
                                            </Typography>
                                            <img
                                                src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                                                alt=""
                                                style={{ width: 50, height: 50, marginRight: -8 }}
                                            />
                                        </Box>
                                    )}
                                </Box>
                                {weather && (
                                    <Box sx={{ mt: 2, pt: 1.5, borderTop: '1px solid var(--text-secondary)', opacity: 0.8 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary', mb: 1 }}>
                                            <span>H: {formatTemp(weather.main?.temp_max, celsius)}°</span>
                                            <span>L: {formatTemp(weather.main?.temp_min, celsius)}°</span>
                                            {weather.aqi && <span style={{ color: weather.aqi <= 100 ? '#10b981' : '#ef4444' }}>AQI: {weather.aqi}</span>}
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'text.secondary' }}>
                                            <span>💧 {weather.main?.humidity}%</span>
                                            <span>💨 {weather.wind?.speed} m/s {['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.round((weather.wind?.deg || 0) / 45) % 8]}</span>
                                        </Box>
                                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                                            <Tooltip title="View on Map">
                                                <IconButton
                                                    size="small"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        navigate(`/maps?lat=${weather.coord?.lat}&lon=${weather.coord?.lon}&city=${fav.cityName}`)
                                                    }}
                                                    sx={{
                                                        background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
                                                        color: 'white',
                                                        '&:hover': {
                                                            background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                                        },
                                                        width: 32,
                                                        height: 32
                                                    }}
                                                >
                                                    <MapIcon sx={{ fontSize: 18 }} />
                                                </IconButton>
                                            </Tooltip>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
                        )
                    })}
                </Box>
            )}

            {isSuggestionsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                    <WeatherLoader />
                </Box>
            ) : filteredSuggestions.length > 0 && (
                <Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                        {favorites && favorites.length > 0 ? 'Add more cities' : 'Suggested cities'}
                    </Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                        {filteredSuggestions.map(city => (
                            <Typography
                                key={city}
                                onClick={() => dispatch(addFavorite({ cityName: city, country: '' }))}
                                sx={{
                                    px: 2,
                                    py: 0.75,
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 2,
                                    cursor: 'pointer',
                                    fontSize: '0.875rem',
                                    '&:hover': { bgcolor: '#fafafa', borderColor: '#ccc' }
                                }}
                            >
                                {city}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            )}

            {(!favorites || favorites.length === 0) && filteredSuggestions.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 10 }}>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                        No favorites yet
                    </Typography>
                    <Typography
                        onClick={() => navigate('/')}
                        sx={{
                            color: 'primary.main',
                            cursor: 'pointer',
                            '&:hover': { textDecoration: 'underline' }
                        }}
                    >
                        Search for a city
                    </Typography>
                </Box>
            )}
        </Box>
    )
}

export default Favorites

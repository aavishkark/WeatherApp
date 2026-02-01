import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatTemp } from '../../utils/weatherUtils'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

import LocationOnIcon from '@mui/icons-material/LocationOn'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import MapIcon from '@mui/icons-material/Map'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import Paper from '@mui/material/Paper'
import Divider from '@mui/material/Divider'
import { getWeather, getWeatherByCoords } from '../../redux/actions'
import WeatherLoader from '../../components/Loading/WeatherLoader'
import SearchBar from '../../components/SearchBar/SearchBar'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const { currentWeather, isLoading } = useSelector((store) => store.weatherReducer)
    const [locationError, setLocationError] = useState(false)
    const [isLocating, setIsLocating] = useState(true)

    useEffect(() => {
        setIsLocating(true)
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    dispatch(getWeatherByCoords(latitude, longitude))
                    setLocationError(false)
                    setIsLocating(false)
                },
                (error) => {
                    setLocationError(true)
                    setIsLocating(false)
                }
            )
        } else {
            setLocationError(true)
            setIsLocating(false)
        }
    }, [dispatch])





    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 5) return 'Good night'
        if (hour < 12) return 'Good morning'
        if (hour < 18) return 'Good afternoon'
        return 'Good evening'
    }

    return (
        <Container maxWidth="md" sx={{ pt: 12, pb: 6, minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <Box sx={{ textAlign: 'center', mb: 6, animation: 'fadeIn 0.8s ease-out' }}>
                <Typography variant="h3" sx={{
                    fontWeight: 800,
                    mb: 1,
                    background: 'linear-gradient(135deg, #2d3748 0%, #004aad 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Outfit", sans-serif',
                    letterSpacing: -1,
                    '[data-theme="dark"] &': {
                        background: 'linear-gradient(135deg, #fff 0%, #b2f5ea 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }
                }}>
                    {getGreeting()}, Explorer.
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 400, opacity: 0.8 }}>
                    Where should we go today?
                </Typography>
            </Box>

            <SearchBar />

            {isLoading || isLocating ? (
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                    <WeatherLoader />
                </Box>
            ) : currentWeather && currentWeather.main ? (
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        onClick={() => navigate(`/city/${currentWeather.name}`)}
                        sx={{
                            p: 4,
                            borderRadius: 6,
                            background: 'linear-gradient(145deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0.9) 100%)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.5)',
                            cursor: 'pointer',
                            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            maxWidth: 500,
                            width: '100%',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
                            '&:hover': {
                                transform: 'translateY(-5px)',
                                boxShadow: '0 20px 40px -15px rgba(0,74,173,0.2)'
                            },
                            '[data-theme="dark"] &': {
                                background: 'linear-gradient(145deg, rgba(30,30,30,0.6) 0%, rgba(40,40,40,0.9) 100%)',
                                border: '1px solid rgba(255,255,255,0.05)',
                            }
                        }}
                    >
                        <Box sx={{
                            display: 'flex',
                            flexDirection: { xs: 'column', sm: 'row' },
                            alignItems: { xs: 'center', sm: 'center' },
                            justifyContent: 'space-between',
                            mb: 3,
                            textAlign: { xs: 'center', sm: 'left' }
                        }}>
                            <Box sx={{ mb: { xs: 2, sm: 0 } }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-start' }, gap: 1, mb: 1 }}>
                                    <LocationOnIcon color="primary" sx={{ fontSize: 20 }} />
                                    <Typography variant="subtitle1" fontWeight={600} letterSpacing={0.5} sx={{ textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.85rem' }}>
                                        Current Location
                                    </Typography>
                                </Box>
                                <Typography variant="h3" fontWeight={800} sx={{ mb: 0 }}>
                                    {currentWeather.name}
                                </Typography>
                                <Typography variant="h6" sx={{ textTransform: 'capitalize', opacity: 0.7, fontWeight: 400 }}>
                                    {currentWeather.weather?.[0]?.description}
                                </Typography>
                            </Box>
                            <Box sx={{ textAlign: { xs: 'center', sm: 'right' } }}>
                                <Typography variant="h1" fontWeight={200} sx={{
                                    fontSize: { xs: '4rem', sm: '5rem' },
                                    color: 'primary.main',
                                    lineHeight: 1,
                                    textShadow: '0 0 40px rgba(0,74,173,0.2)',
                                    '[data-theme="dark"] &': {
                                        color: '#b2f5ea',
                                        textShadow: '0 0 40px rgba(178,245,234,0.2)'
                                    }
                                }}>
                                    {formatTemp(currentWeather.main?.temp, celsius)}°
                                </Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ opacity: 0.1, mb: 3 }} />

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', px: { xs: 0, sm: 2 }, gap: { xs: 1, sm: 2 } }}>
                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                                    <ThermostatIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: 'primary.main' }} />
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Temp</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                                    {formatTemp(currentWeather.main?.feels_like, celsius)}°
                                </Typography>
                            </Box>

                            <Box sx={{ width: 1, height: 45, bgcolor: 'divider', opacity: 0.1, alignSelf: 'center' }} />

                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                                    <WaterDropIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: 'primary.main' }} />
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Humidity</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{currentWeather.main?.humidity}%</Typography>
                            </Box>

                            <Box sx={{ width: 1, height: 45, bgcolor: 'divider', opacity: 0.1, alignSelf: 'center' }} />

                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                                    <AirIcon sx={{ fontSize: { xs: 16, sm: 20 }, color: 'primary.main' }} />
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>Wind</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>{Math.round(currentWeather.wind?.speed)} m/s</Typography>
                            </Box>

                            <Box sx={{ width: 1, height: 45, bgcolor: 'divider', opacity: 0.1, alignSelf: 'center' }} />

                            <Box sx={{ textAlign: 'center', flex: 1 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, color: 'text.secondary', mb: 0.5 }}>
                                    <Typography variant="body2" fontWeight={500} sx={{ fontSize: { xs: '0.75rem', sm: '0.875rem' } }}>AQI</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight={700} sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, color: currentWeather.aqi <= 100 ? 'success.main' : 'error.main' }}>
                                    {currentWeather.aqi || '-'}
                                </Typography>
                            </Box>
                        </Box>

                        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                            <Tooltip title="View on Map">
                                <IconButton
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        navigate(`/maps?lat=${currentWeather.coord?.lat}&lon=${currentWeather.coord?.lon}&city=${currentWeather.name}`)
                                    }}
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
                        </Box>
                    </Paper>
                </Box>
            ) : (
                <Box sx={{ mt: 8, display: 'flex', justifyContent: 'center' }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            borderRadius: 6,
                            background: 'rgba(255,255,255,0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            maxWidth: 500,
                            width: '100%',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 2
                        }}
                    >
                        <Box sx={{
                            bgcolor: locationError ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                            p: 2,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mb: 1
                        }}>
                            <LocationOnIcon sx={{ fontSize: 40, color: locationError ? '#ef4444' : '#3b82f6' }} />
                        </Box>
                        <Typography variant="h5" fontWeight={600}>
                            {locationError ? 'Location Access Denied' : 'Location Access Required'}
                        </Typography>
                        <Typography color="text.secondary" sx={{ maxWidth: '80%', mb: 2 }}>
                            {locationError
                                ? 'Please enable location access in your browser settings to see your local weather, or search for a city above.'
                                : 'Please allow location access to see your local weather.'}
                        </Typography>
                    </Paper>
                </Box>
            )}
        </Container>
    )
}

export default Dashboard
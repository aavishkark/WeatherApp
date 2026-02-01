import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { formatTemp } from '../../utils/weatherUtils'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import AirIcon from '@mui/icons-material/Air'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import axios from 'axios'
import { getWeather, getWeatherByCoords } from '../../redux/actions'

const Dashboard = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const { currentWeather } = useSelector((store) => store.weatherReducer)
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isFocused, setIsFocused] = useState(false)
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords
                    dispatch(getWeatherByCoords(latitude, longitude))
                },
                (error) => {
                    dispatch(getWeather('London'))
                }
            )
        } else {
            dispatch(getWeather('London'))
        }
    }, [dispatch])

    useEffect(() => {
        if (query.length > 2) {
            const timer = setTimeout(() => {
                axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
                    .then(res => setResults(res.data))
                    .catch(() => setResults([]))
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setResults([])
        }
    }, [query, API_KEY])

    const handleCityClick = (city) => {
        navigate(`/city/${city.name}`)
    }

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

            <Box sx={{ position: 'relative', maxWidth: 600, mx: 'auto', width: '100%', zIndex: 10 }}>
                <Paper
                    elevation={isFocused ? 8 : 2}
                    sx={{
                        p: '2px 4px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: 4,
                        transition: 'all 0.3s ease',
                        border: '1px solid',
                        borderColor: isFocused ? 'primary.main' : 'divider',

                    }}
                >
                    <Box sx={{ p: 2 }}>
                        <SearchIcon color={isFocused ? "primary" : "action"} />
                    </Box>
                    <TextField
                        fullWidth
                        placeholder="Search a place"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => {
                            setTimeout(() => setIsFocused(false), 200)
                        }}
                        variant="standard"
                        InputProps={{
                            disableUnderline: true,
                            sx: { fontSize: '1.1rem', fontWeight: 500 }
                        }}
                    />
                </Paper>

                {results.length > 0 && (
                    <Paper
                        elevation={6}
                        sx={{
                            position: 'absolute',
                            top: '120%',
                            left: 0,
                            right: 0,
                            borderRadius: 3,
                            overflow: 'hidden',
                            animation: 'slideDown 0.2s ease-out'
                        }}
                    >
                        <List>
                            {results.map((city, index) => (
                                <ListItem
                                    key={`${city.name}-${city.country}-${index}`}
                                    onClick={() => handleCityClick(city)}
                                    sx={{
                                        cursor: 'pointer',
                                        transition: 'background 0.2s',
                                        '&:hover': { bgcolor: 'action.hover' },
                                        py: 2
                                    }}
                                >
                                    <LocationOnIcon fontSize="small" color="action" sx={{ mr: 2 }} />
                                    <ListItemText
                                        primary={
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {city.name}
                                            </Typography>
                                        }
                                        secondary={
                                            <Typography variant="body2" color="text.secondary">
                                                {city.state ? `${city.state}, ` : ''}{city.country}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                )}
            </Box>

            {currentWeather && currentWeather.main && (
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
                        </Box>
                    </Paper>
                </Box>
            )}
        </Container>
    )
}

export default Dashboard
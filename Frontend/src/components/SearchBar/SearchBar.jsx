import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import TextField from '@mui/material/TextField'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import SearchIcon from '@mui/icons-material/Search'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import { useDispatch, useSelector } from 'react-redux'
import IconButton from '@mui/material/IconButton'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import { addFavorite, removeFavorite, getFavorites } from '../../redux/actions'
import axios from 'axios'
import './searchbar.css'

const SearchBar = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [isFocused, setIsFocused] = useState(false)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const searchRef = useRef(null)
    const { favorites } = useSelector((store) => store.favoritesReducer)
    const { isAuth } = useSelector((store) => store.authReducer)
    const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY

    useEffect(() => {
        if (isAuth) {
            dispatch(getFavorites())
        }
    }, [dispatch, isAuth])

    useEffect(() => {
        if (query.length > 2) {
            const timer = setTimeout(() => {
                axios.get(`https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`)
                    .then(res => {
                        setResults(res.data)
                        setShowSuggestions(true)
                    })
                    .catch(() => setResults([]))
            }, 300)
            return () => clearTimeout(timer)
        } else {
            setResults([])
        }
    }, [query, API_KEY])

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const handleCityClick = (city) => {
        navigate(`/city/${city.name}`)
        setQuery('')
        setResults([])
    }

    const isFavorite = (city) => {
        return favorites.some(fav => {
            if (fav.lat && fav.lon && city.lat && city.lon) {
                return Math.abs(fav.lat - city.lat) < 0.01 && Math.abs(fav.lon - city.lon) < 0.01
            }
            return fav.cityName === city.name && fav.country === city.country
        })
    }

    const handleToggleFavorite = (e, city) => {
        e.stopPropagation()
        e.preventDefault()
        if (!isAuth) {
            navigate('/login')
            return
        }

        if (isFavorite(city)) {
            const favCity = favorites.find(fav => {
                if (fav.lat && fav.lon && city.lat && city.lon) {
                    return Math.abs(fav.lat - city.lat) < 0.01 && Math.abs(fav.lon - city.lon) < 0.01
                }
                return fav.cityName === city.name && fav.country === city.country
            })
            if (favCity) {
                dispatch(removeFavorite(favCity._id))
            }
        } else {
            dispatch(addFavorite({
                cityName: city.name,
                country: city.country,
                lat: city.lat,
                lon: city.lon
            }))
        }
    }

    return (
        <Box ref={searchRef} sx={{ position: 'relative', maxWidth: 600, mx: 'auto', width: '100%', zIndex: 10 }}>
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
                    onFocus={() => {
                        setIsFocused(true)
                        setShowSuggestions(true)
                    }}
                    onBlur={() => {
                        setTimeout(() => setIsFocused(false), 200)
                    }}
                    variant="standard"
                    autoComplete="off"
                    InputProps={{
                        disableUnderline: true,
                        sx: { fontSize: '1.1rem', fontWeight: 500 }
                    }}
                />
            </Paper>

            {showSuggestions && results.length > 0 && (
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
                                secondaryAction={
                                    <IconButton
                                        onClick={(e) => handleToggleFavorite(e, city)}
                                        edge="end"
                                    >
                                        {isFavorite(city) ? (
                                            <FavoriteIcon color="error" />
                                        ) : (
                                            <FavoriteBorderIcon color="action" />
                                        )}
                                    </IconButton>
                                }
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
    )
}

export default SearchBar
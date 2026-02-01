import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { useSelector } from 'react-redux'
import { formatTemp } from '../../utils/weatherUtils'
import './WeatherDetails.css'

const WeatherDetails = ({ weather }) => {
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const formatTime = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    return (
        <Box className="weather-details-grid">
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">High / Low</Typography>
                <Typography className="weather-detail-value">
                    {formatTemp(weather.main?.temp_max, celsius)}° / {formatTemp(weather.main?.temp_min, celsius)}°
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Humidity</Typography>
                <Typography className="weather-detail-value">
                    {weather.main?.humidity}%
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Wind</Typography>
                <Typography className="weather-detail-value">
                    {Math.round(weather.wind?.speed)} m/s
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Pressure</Typography>
                <Typography className="weather-detail-value">
                    {weather.main?.pressure} hPa
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Sunrise</Typography>
                <Typography className="weather-detail-value">
                    {formatTime(weather.sys?.sunrise)}
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Sunset</Typography>
                <Typography className="weather-detail-value">
                    {formatTime(weather.sys?.sunset)}
                </Typography>
            </Box>
            {weather.visibility && (
                <Box className="weather-detail-card">
                    <Typography className="weather-detail-label">Visibility</Typography>
                    <Typography className="weather-detail-value">
                        {(weather.visibility / 1000).toFixed(1)} km
                    </Typography>
                </Box>
            )}
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Clouds</Typography>
                <Typography className="weather-detail-value">
                    {weather.clouds?.all}%
                </Typography>
            </Box>
            <Box className="weather-detail-card">
                <Typography className="weather-detail-label">Dew Point</Typography>
                <Typography className="weather-detail-value">
                    {formatTemp(weather.main?.temp - ((100 - weather.main?.humidity) / 5), celsius)}°
                </Typography>
            </Box>
        </Box>
    )
}

export default WeatherDetails

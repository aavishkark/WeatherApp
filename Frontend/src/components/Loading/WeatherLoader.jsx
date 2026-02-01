import React from 'react'
import Box from '@mui/material/Box'
import './WeatherLoader.css'

const WeatherLoader = () => {
    return (
        <Box className="weather-loader-container">
            <Box className="weather-loader-sun" />
            <Box className="weather-loader-cloud" />
        </Box>
    )
}

export default WeatherLoader

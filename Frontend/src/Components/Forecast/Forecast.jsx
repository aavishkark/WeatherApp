import React from 'react'
import { useSelector } from 'react-redux'
import { formatTemp } from '../../utils/weatherUtils'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import WeatherLoader from '../Loading/WeatherLoader'
import IconButton from '@mui/material/IconButton'
import CloseIcon from '@mui/icons-material/Close'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import './Forecast.css'

const Forecast = () => {
    const { forecast, isLoading } = useSelector((store) => store.weatherReducer)
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const [selectedDay, setSelectedDay] = React.useState(null)
    const [tabValue, setTabValue] = React.useState(0)

    const dailyData = forecast?.list?.filter((reading) => reading.dt_txt.includes("12:00:00")) || []

    const getDayName = (timestamp) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', { weekday: 'short' })
    }

    const handleDayClick = (item) => {
        const dateStr = item.dt_txt.split(' ')[0]
        const dayHourly = forecast.list.filter(reading => reading.dt_txt.startsWith(dateStr))

        const chartData = dayHourly.map(hour => ({
            time: new Date(hour.dt * 1000).toLocaleTimeString([], { hour: '2-digit', hour12: true }),
            temp: Math.round(hour.main.temp),
            displayTemp: formatTemp(hour.main.temp, celsius),
            icon: hour.weather[0].icon,
            desc: hour.weather[0].main,
            pop: Math.round(hour.pop * 100),
            wind: hour.wind.speed.toFixed(1),
            feels_like: formatTemp(hour.main.feels_like, celsius),
            rawTemp: Math.round(hour.main.temp)
        }))

        setSelectedDay({ name: getDayName(item.dt), date: dateStr, data: chartData })
        setTabValue(0)
    }

    const handleClose = () => setSelectedDay(null)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <Box sx={{
                    bgcolor: 'background.paper',
                    p: 1.5,
                    border: '1px solid rgba(0,0,0,0.1)',
                    borderRadius: 2,
                    boxShadow: 3
                }}>
                    <Typography variant="body2">{data.time}</Typography>
                    {tabValue === 0 && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <img src={`https://openweathermap.org/img/wn/${data.icon}.png`} alt="" style={{ width: 30, height: 30 }} />
                                <Typography variant="h6" color="primary">{data.displayTemp}°</Typography>
                            </Box>
                            <Typography variant="caption" sx={{ opacity: 0.7 }}>{data.desc}</Typography>
                        </>
                    )}
                    {tabValue === 1 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                            <Typography variant="h6" color="primary">{data.pop}%</Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>Precipitation</Typography>
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                            <Typography variant="h6" color="success.main">{data.wind}<span style={{ fontSize: '0.8rem' }}> m/s</span></Typography>
                            <Typography variant="caption" sx={{ ml: 1 }}>Wind</Typography>
                        </Box>
                    )}
                </Box>
            )
        }
        return null
    }

    if (isLoading && !dailyData.length) {
        return (
            <Box className="forecast-loading">
                <WeatherLoader />
            </Box>
        )
    }

    if (!dailyData.length) {
        return null
    }

    const hasPrecipitation = selectedDay?.data.some(item => item.pop > 0)

    return (
        <Box className="forecast-container">
            <Typography variant="h6" className="forecast-title">5-Day Forecast</Typography>
            <Box className="forecast-list">
                {dailyData.map((item) => (
                    <Box key={item.dt} className="forecast-item" onClick={() => handleDayClick(item)} sx={{ cursor: 'pointer', transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.02)' } }}>
                        <Typography className="forecast-day">{getDayName(item.dt)}</Typography>
                        <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="weather icon"
                            className="forecast-icon"
                        />
                        <Typography className="forecast-temp">{formatTemp(item.main.temp, celsius)}°</Typography>
                        <Typography className="forecast-desc">{item.weather[0].main}</Typography>
                    </Box>
                ))}
            </Box>

            {selectedDay && (
                <Box sx={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    bgcolor: 'rgba(0,0,0,0.5)', zIndex: 1200,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', p: 2
                }} onClick={handleClose}>
                    <Box sx={{
                        bgcolor: 'background.paper', borderRadius: 3,
                        width: '100%', maxWidth: 700, p: 3,
                        boxShadow: 24, animation: 'fadeIn 0.3s',
                        position: 'relative'
                    }} onClick={e => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{selectedDay.name} - Hourly Trend</Typography>
                            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Box className="chart-tabs">
                                    <button className={`chart-tab ${tabValue === 0 ? 'active' : ''}`} onClick={() => setTabValue(0)}>Temp</button>
                                    <button className={`chart-tab ${tabValue === 1 ? 'active' : ''}`} onClick={() => setTabValue(1)}>Precip</button>
                                    <button className={`chart-tab ${tabValue === 2 ? 'active' : ''}`} onClick={() => setTabValue(2)}>Wind</button>
                                </Box>
                                <IconButton onClick={handleClose} size="small" sx={{ ml: 1 }}>
                                    <CloseIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        <Box className="chart-wrapper">
                            {tabValue === 1 && !hasPrecipitation ? (
                                <Box sx={{
                                    height: '100%',
                                    width: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'linear-gradient(180deg, transparent 0%, rgba(14, 165, 233, 0.05) 100%)',
                                    borderRadius: 4
                                }}>
                                    <Typography className="empty-precip-icon">☀️</Typography>
                                    <Typography sx={{ fontWeight: 500, color: 'text.secondary' }}>No precipitation expected</Typography>
                                    <Typography variant="caption" sx={{ mt: 0.5, opacity: 0.6 }}>Perfect day for a ride!</Typography>
                                </Box>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    {tabValue === 1 ? (
                                        <BarChart data={selectedDay.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="var(--text-secondary)" />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                            <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-paper)', opacity: 0.1 }} />
                                            <Bar dataKey="pop" fill="#0ea5e9" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                        </BarChart>
                                    ) : (
                                        <LineChart data={selectedDay.data} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="var(--text-secondary)" />
                                            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                            <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={['auto', 'auto']} />
                                            <Tooltip content={<CustomTooltip />} />
                                            <Line
                                                type="monotone"
                                                dataKey={tabValue === 2 ? "wind" : "temp"}
                                                stroke={tabValue === 2 ? "#10b981" : "var(--primary-color)"}
                                                strokeWidth={3}
                                                dot={{ r: 4, fill: tabValue === 2 ? "#10b981" : "var(--primary-color)" }}
                                                activeDot={{ r: 6 }}
                                            />
                                        </LineChart>
                                    )}
                                </ResponsiveContainer>
                            )}
                        </Box>
                    </Box>
                </Box>
            )}
        </Box>
    )
}

export default Forecast

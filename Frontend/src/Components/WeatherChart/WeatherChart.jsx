import React from 'react'
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Brush
} from 'recharts'
import { useSelector } from 'react-redux'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { formatTemp } from '../../utils/weatherUtils'
import './WeatherChart.css'

const WeatherChart = () => {
    const { forecast } = useSelector((store) => store.weatherReducer)
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const [tabValue, setTabValue] = React.useState(0)
    const [timeRange, setTimeRange] = React.useState('24h')

    if (!forecast?.list) return null

    const generateChartData = (list, range) => {
        const hourly = []
        let dataLimit = 9

        if (range === '48h') dataLimit = 16
        if (range === '5d') dataLimit = 40

        const sourceData = list.slice(0, dataLimit)

        for (let i = 0; i < sourceData.length - 1; i++) {
            const current = sourceData[i]
            const next = sourceData[i + 1]
            const timeDiff = (next.dt - current.dt) / 3600

            for (let j = 0; j < timeDiff; j++) {
                const fraction = j / timeDiff
                const interpolatedTemp = Math.round(current.main.temp + (next.main.temp - current.main.temp) * fraction)
                const time = new Date((current.dt + j * 3600) * 1000)

                const pop = Math.round((current.pop + (next.pop - current.pop) * fraction) * 100)
                const windSpeed = (current.wind.speed + (next.wind.speed - current.wind.speed) * fraction).toFixed(1)

                hourly.push({
                    dt: current.dt + j * 3600,
                    time: time.toLocaleTimeString([], { hour: '2-digit', hour12: true }),
                    shortDate: time.toLocaleDateString([], { weekday: 'short', day: 'numeric' }),
                    fullDate: time.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
                    temp: formatTemp(interpolatedTemp, celsius),
                    rawTemp: interpolatedTemp,
                    feels_like: formatTemp(current.main.feels_like + (next.main.feels_like - current.main.feels_like) * fraction, celsius),
                    humidity: Math.round(current.main.humidity + (next.main.humidity - current.main.humidity) * fraction),
                    wind: windSpeed,
                    pop: pop
                })
            }
        }
        return hourly
    }

    const chartData = generateChartData(forecast.list, timeRange)
    const hasPrecipitation = chartData.some(item => item.pop > 0)

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload
            return (
                <Box className="chart-tooltip">
                    <Typography className="tooltip-date">{data.fullDate}</Typography>
                    {tabValue === 0 && (
                        <>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                                <Typography className="tooltip-temp">{data.temp}°</Typography>
                                <Typography className="tooltip-desc" sx={{ ml: 1 }}>Feels {data.feels_like}°</Typography>
                            </Box>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 1, textAlign: 'left', mt: 1 }}>
                                <Typography className="tooltip-detail">Humidity: {data.humidity}%</Typography>
                            </Box>
                        </>
                    )}
                    {tabValue === 1 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                            <Typography className="tooltip-temp">{data.pop}%</Typography>
                            <Typography className="tooltip-desc" sx={{ ml: 1 }}>Precipitation</Typography>
                        </Box>
                    )}
                    {tabValue === 2 && (
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 1 }}>
                            <Typography className="tooltip-temp">{data.wind}<span style={{ fontSize: '1rem' }}> m/s</span></Typography>
                            <Typography className="tooltip-desc" sx={{ ml: 1 }}>Wind Speed</Typography>
                        </Box>
                    )}
                </Box>
            )
        }
        return null
    }

    return (
        <Box className="weather-chart-container">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, flexWrap: 'wrap', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                    <Typography variant="h6" className="chart-title" sx={{ mb: 0 }}>Forecast</Typography>
                    <select
                        value={timeRange}
                        onChange={(e) => setTimeRange(e.target.value)}
                        style={{
                            padding: '4px 8px',
                            borderRadius: '8px',
                            border: '1px solid var(--divider)',
                            background: 'var(--bg-paper)',
                            color: 'var(--text-primary)',
                            fontSize: '0.85rem',
                            outline: 'none',
                            cursor: 'pointer',
                            alignSelf: 'flex-start'
                        }}
                    >
                        <option value="24h">Next 24 Hours</option>
                        <option value="48h">Next 2 Days</option>
                        <option value="5d">Next 5 Days</option>
                    </select>
                </Box>

                <Box className="chart-tabs">
                    <button className={`chart-tab ${tabValue === 0 ? 'active' : ''}`} onClick={() => setTabValue(0)}>Temp</button>
                    <button className={`chart-tab ${tabValue === 1 ? 'active' : ''}`} onClick={() => setTabValue(1)}>Precip</button>
                    <button className={`chart-tab ${tabValue === 2 ? 'active' : ''}`} onClick={() => setTabValue(2)}>Wind</button>
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
                    <ResponsiveContainer width="100%" height="100%" debounce={50}>
                        {tabValue === 1 ? (
                            <BarChart key={`${timeRange}-${tabValue}`} data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="var(--text-secondary)" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(val, index) => {
                                        if (timeRange === '5d' && index % 24 === 0) return chartData[index].shortDate
                                        return val
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                                    interval={timeRange === '5d' ? 23 : 5}
                                />
                                <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'var(--bg-paper)', opacity: 0.1 }} />
                                <Bar dataKey="pop" fill="#0ea5e9" radius={[4, 4, 0, 0]} animationDuration={1500} />
                                {timeRange !== '24h' && (
                                    <Brush
                                        dataKey="time"
                                        height={30}
                                        stroke="var(--primary-color)"
                                        fill="var(--bg-default)"
                                        opacity={0.5}
                                        tickFontSize={10}
                                        travellerWidth={12}
                                    />
                                )}
                            </BarChart>
                        ) : (
                            <LineChart key={`${timeRange}-${tabValue}`} data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 50 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} stroke="var(--text-secondary)" />
                                <XAxis
                                    dataKey="time"
                                    tickFormatter={(val, index) => {
                                        if (timeRange === '5d' && index % 24 === 0) return chartData[index].shortDate
                                        return val
                                    }}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12, fill: 'var(--text-secondary)' }}
                                    interval={timeRange === '5d' ? 23 : 5}
                                />
                                <YAxis width={30} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-secondary)' }} domain={['auto', 'auto']} />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey={tabValue === 2 ? "wind" : "temp"}
                                    stroke={tabValue === 2 ? "#10b981" : "var(--primary-color)"}
                                    strokeWidth={3}
                                    dot={false}
                                    activeDot={{ r: 6, fill: tabValue === 2 ? "#10b981" : "var(--primary-color)" }}
                                    animationDuration={1500}
                                />
                                {timeRange !== '24h' && (
                                    <Brush
                                        dataKey="time"
                                        height={30}
                                        stroke="var(--primary-color)"
                                        fill="var(--bg-default)"
                                        opacity={0.5}
                                        tickFontSize={10}
                                        travellerWidth={12}
                                    />
                                )}
                            </LineChart>
                        )}
                    </ResponsiveContainer>
                )}
            </Box>
        </Box>
    )
}

export default WeatherChart

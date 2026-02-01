import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { postLogout, toggleTempUnit } from '../../redux/actions'
import { useThemeMode } from '../../context/ThemeContext'
import Box from '@mui/material/Box'
import Fab from '@mui/material/Fab'
import Tooltip from '@mui/material/Tooltip'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LightModeIcon from '@mui/icons-material/LightMode'
import ThermostatIcon from '@mui/icons-material/Thermostat'
import CloseIcon from '@mui/icons-material/Close'

const FloatingControls = () => {
    const [open, setOpen] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { celsius } = useSelector((store) => store.preferencesReducer)
    const { isAuth } = useSelector((store) => store.authReducer)
    const { mode, toggleTheme } = useThemeMode()

    const isAuthenticated = isAuth || localStorage.getItem('weatherapp') === 'true'

    const handleLogout = () => {
        dispatch(postLogout())
        navigate('/')
    }

    const toggleOpen = () => setOpen(!open)

    return (
        <Box sx={{ position: 'fixed', bottom: 24, right: 24, display: 'flex', flexDirection: 'column-reverse', gap: 2, alignItems: 'center', zIndex: 9999 }}>
            <Fab color="primary" onClick={toggleOpen}>
                {open ? <CloseIcon /> : <SettingsIcon />}
            </Fab>

            {open && (
                <>
                    {isAuthenticated && (
                        <Tooltip title="Logout" placement="left">
                            <Fab size="small" color="error" onClick={handleLogout}>
                                <LogoutIcon />
                            </Fab>
                        </Tooltip>
                    )}

                    <Tooltip title={`Switch to ${mode === 'light' ? 'Dark' : 'Light'} Mode`} placement="left">
                        <Fab size="small" onClick={toggleTheme} sx={{ bgcolor: 'var(--bg-paper)', color: 'var(--text-primary)' }}>
                            {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
                        </Fab>
                    </Tooltip>

                    <Tooltip title={`Switch to ${celsius ? 'Fahrenheit' : 'Celsius'}`} placement="left">
                        <Fab size="small" onClick={() => dispatch(toggleTempUnit())} sx={{ bgcolor: 'var(--bg-paper)', color: 'var(--text-primary)' }}>
                            <ThermostatIcon />
                        </Fab>
                    </Tooltip>
                </>
            )}
        </Box>
    )
}

export default FloatingControls

import React, { createContext, useState, useMemo, useContext, useEffect } from 'react'
import { ThemeProvider as MUIThemeProvider, createTheme } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

const ThemeContext = createContext()

export const useThemeMode = () => useContext(ThemeContext)

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(() => {
        const saved = localStorage.getItem('weatherAppTheme')
        return saved || 'light'
    })

    useEffect(() => {
        localStorage.setItem('weatherAppTheme', mode)
        document.body.setAttribute('data-theme', mode)
    }, [mode])

    const toggleTheme = () => {
        setMode(prev => prev === 'light' ? 'dark' : 'light')
    }

    const theme = useMemo(() => createTheme({
        palette: {
            mode,
            ...(mode === 'light' ? {
                background: {
                    default: '#f5f5f5',
                    paper: '#ffffff'
                }
            } : {
                background: {
                    default: '#121212',
                    paper: '#1e1e1e'
                }
            })
        },
        typography: {
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
        },
        shape: {
            borderRadius: 8
        }
    }), [mode])

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </ThemeContext.Provider>
    )
}

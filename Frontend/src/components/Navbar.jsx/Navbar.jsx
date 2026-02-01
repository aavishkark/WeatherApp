import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { postLogout } from '../../redux/actions'
import './navbar.css'

const Navbar = () => {
    const [drawerOpen, setDrawerOpen] = React.useState(false)
    const auth = JSON.parse(localStorage.getItem('weatherapp'))
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const handleLogout = () => {
        setDrawerOpen(false)
        dispatch(postLogout())
        navigate('/')
    }

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return
        }
        setDrawerOpen(open)
    }

    const menuItems = [
        { text: 'Home', path: '/', show: true },
        { text: 'Maps', path: '/maps', show: true },
        { text: 'Favorites', path: '/favorites', show: true },
        { text: 'Settings', path: '/settings', show: auth },
        { text: 'Login', path: '/login', show: !auth },
    ]

    const drawerList = () => (
        <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                {menuItems.filter(item => item.show && item.text !== 'Settings').map((item) => (
                    <ListItem key={item.text} disablePadding>
                        <ListItemButton component={RouterLink} to={item.path}>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed" sx={{
                top: 0,
                left: 0,
                width: '100%',
                zIndex: 1200,
                background: 'transparent',
                backdropFilter: 'blur(10px)',
                boxShadow: 'none',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease',
                '[data-theme="dark"] &': {
                    background: 'transparent',
                    backdropFilter: 'none',
                    borderBottom: 'none'
                }
            }}>
                <Toolbar sx={{ justifyContent: 'space-between' }}>
                    <Typography
                        variant="h6"
                        component={RouterLink}
                        to="/"
                        className="brand-logo"
                        sx={{
                            textDecoration: 'none',
                            fontWeight: 800,
                            letterSpacing: -0.5,
                            fontSize: '1.8rem',
                            fontFamily: '"Outfit", "Roboto", sans-serif',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            transition: 'opacity 0.2s',
                            '&:hover': { opacity: 0.8 }
                        }}
                    >
                        Currents
                    </Typography>

                    <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                        {[
                            { text: 'Home', path: '/' },
                            { text: 'Favorites', path: '/favorites' },
                            ...(auth ? [] : [{ text: 'Login', path: '/login' }])
                        ].map((item) => (
                            <Button
                                key={item.text}
                                color="inherit"
                                component={RouterLink}
                                to={item.path}
                                sx={{
                                    fontWeight: 500,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    borderRadius: 2,
                                    px: 2,
                                    color: 'text.primary',
                                    transition: 'all 0.2s',
                                    '[data-theme="dark"] &': {
                                        color: 'rgba(255,255,255,0.9)'
                                    },
                                    '&:hover': {
                                        color: 'primary.main',
                                        backgroundColor: 'rgba(0,0,0,0.05)',
                                        transform: 'translateY(-1px)',
                                        '[data-theme="dark"] &': {
                                            color: '#b2f5ea',
                                            backgroundColor: 'rgba(255,255,255,0.1)'
                                        }
                                    }
                                }}
                            >
                                {item.text}
                            </Button>
                        ))}
                    </Box>

                    <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                        sx={{
                            display: { xs: 'flex', md: 'none' },
                            color: 'text.primary'
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                </Toolbar>
            </AppBar>
            <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={toggleDrawer(false)}
                PaperProps={{
                    sx: {
                        backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        backdropFilter: 'blur(10px)',
                        color: 'text.primary',
                        width: 250,
                        '[data-theme="dark"] &': {
                            backgroundColor: '#1A2027',
                            backdropFilter: 'none',
                            color: 'white'
                        }
                    }
                }}
            >
                <Box
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                >
                    <List sx={{ pt: 4 }}>
                        {[
                            { text: 'Home', path: '/' },
                            { text: 'Favorites', path: '/favorites' },
                            ...(auth ? [] : [{ text: 'Login', path: '/login' }])
                        ].map((item) => (
                            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                                <ListItemButton
                                    component={RouterLink}
                                    to={item.path}
                                    sx={{
                                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
                                    }}
                                >
                                    <ListItemText
                                        primary={item.text}
                                        primaryTypographyProps={{
                                            fontWeight: 500,
                                            textAlign: 'center'
                                        }}
                                    />
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </Drawer>
        </Box>
    )
}

export default Navbar

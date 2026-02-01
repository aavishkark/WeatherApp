import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postLogin } from '../../redux/actions'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Link from '@mui/material/Link'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { useNavigate } from 'react-router-dom'
import { Alert } from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'
import GoogleIcon from '@mui/icons-material/Google'
import Divider from '@mui/material/Divider'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'

const Login = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [email, setemail] = useState("")
    const [password, setpassword] = useState("")
    const auth = JSON.parse(localStorage.getItem('weatherapp'))
    const auth1 = useSelector((store) => { return store.authReducer })
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(postLogin({ email, password }))
            .then(() => {
                const authCheck = JSON.parse(localStorage.getItem('weatherapp'))
                if (authCheck == true) {
                    navigate('/')
                }
            })
    }

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`
    }

    if (auth == true) {
        navigate('/')
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={auth1.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => { setemail(e.target.value) }}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                onChange={(e) => { setpassword(e.target.value) }}
                                autoComplete="current-password"
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Divider sx={{ my: 2 }}>or</Divider>
                            <Button
                                fullWidth
                                variant="outlined"
                                startIcon={<GoogleIcon />}
                                onClick={handleGoogleLogin}
                                sx={{ mb: 2 }}
                            >
                                Continue with Google
                            </Button>
                            <Box sx={{ textAlign: 'center', mt: 2 }}>
                                <Link href="#" variant="body2" sx={{ display: 'block', mb: 1 }}>
                                    Forgot password?
                                </Link>
                                <Typography variant="body2" color="text.secondary">
                                    Don't have an account?{' '}
                                    <Link href="/signup">Sign Up</Link>
                                </Typography>
                            </Box>
                            {auth1.isError == true ? <Alert severity="error" sx={{ mt: 2 }}>Wrong credentials, please try again</Alert> : ""}
                        </Box>
                    </Box>
                </Paper>
            </Container>
        </Box>
    )
}

export default Login

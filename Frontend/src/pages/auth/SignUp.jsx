import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postRegister } from '../../redux/actions'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import Link from '@mui/material/Link'
import Box from '@mui/material/Box'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import { useNavigate } from 'react-router-dom'
import GoogleIcon from '@mui/icons-material/Google'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Backdrop from '@mui/material/Backdrop'

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />
})

const SignUp = () => {
    const [open, setOpen] = useState(false)
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const auth1 = useSelector((store) => { return store.authReducer })
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

    const handleClose = () => {
        setOpen(false)
        if (auth1.registerSuccess === true) {
            navigate('/login')
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        dispatch(postRegister({ username, email, password }))
            .then(() => {
                setOpen(true)
            })
    }

    const handleGoogleLogin = () => {
        window.location.href = `${BACKEND_URL}/auth/google`
    }

    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
            <Backdrop sx={{ color: '#fff', zIndex: 9999 }} open={auth1.isLoading}>
                <CircularProgress color="inherit" />
            </Backdrop>
            <Container maxWidth="xs">
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Sign up to track weather in your favorite cities
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
                            <TextField
                                margin="normal"
                                autoComplete="given-name"
                                name="username"
                                required
                                fullWidth
                                id="username"
                                label="Username"
                                onChange={(e) => { setUsername(e.target.value) }}
                                autoFocus
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
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
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?{' '}
                                    <Link href="/login">Sign in</Link>
                                </Typography>
                            </Box>
                        </Box>
                    </Box>
                </Paper>
                <Dialog
                    open={open}
                    TransitionComponent={Transition}
                    keepMounted
                    onClose={handleClose}
                >
                    <DialogTitle>{auth1.isError ? "Error" : "Success"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {auth1.isError ? "Registration failed. Please try again." : "Registration successful! You can now login."}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>{auth1.isError ? "Try Again" : "Login"}</Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </Box>
    )
}

export default SignUp

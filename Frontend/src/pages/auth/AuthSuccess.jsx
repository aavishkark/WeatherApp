import React, { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { saveUserData } from '../../redux/actions'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'

const AuthSuccess = () => {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    useEffect(() => {
        const token = searchParams.get('token')
        const userid = searchParams.get('userid')
        if (token && userid) {
            localStorage.setItem('weatherapp', true)
            localStorage.setItem('token', token)
            localStorage.setItem('userid', userid)
            dispatch(saveUserData({ user: {}, auth: true }))
            navigate('/')
        }
    }, [searchParams, navigate, dispatch])

    return (
        <Box sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CircularProgress />
            <Typography sx={{ mt: 2 }}>Authenticating...</Typography>
        </Box>
    )
}

export default AuthSuccess

import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export const PrivateRoutes = ({ children }) => {
    const location = useLocation()
    const auth = localStorage.getItem('weatherapp')
    return (
        auth == 'true' ? children : <Navigate state={location.pathname} to={'/login'} replace={true} />
    )
}

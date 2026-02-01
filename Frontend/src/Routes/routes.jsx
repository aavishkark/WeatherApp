import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import Login from '../pages/auth/Login'
import SignUp from '../pages/auth/SignUp'
import City from '../pages/City/City'
import Favorites from '../pages/Favorites/Favorites'
import Settings from '../pages/Settings/Settings'
import { PrivateRoutes } from './PrivateRoutes'
import AuthSuccess from '../pages/auth/AuthSuccess'

const AllRoutes = () => {
    return (
        <Routes>
            <Route path='/' element={<Dashboard />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/signup' element={<SignUp />}></Route>
            <Route path='/auth/success' element={<AuthSuccess />}></Route>
            <Route path='/city/:name' element={<City />}></Route>
            <Route path='/favorites' element={<PrivateRoutes><Favorites /></PrivateRoutes>}></Route>
            <Route path='/settings' element={<PrivateRoutes><Settings /></PrivateRoutes>}></Route>
        </Routes>
    )
}

export default AllRoutes

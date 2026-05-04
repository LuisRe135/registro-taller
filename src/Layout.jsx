import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Landing from './views/Landing.jsx'
import Home from './views/Home.jsx'
import Car from './views/Car.jsx'

import injectContext from './js/store/appContext.js'
import Revision from './views/Revision.jsx'
import AddCar from './views/AddCar.jsx'
import Login from './views/Login.jsx'
import Register from './views/Register.jsx'



export const Layout = () => {
  const basename = process.env.BASENAME || "";
  return (
    <div>
        <BrowserRouter basement={basename}>
            <Routes>
                <Route exact path='/' element={<Landing/>} />
                <Route exact path='/home' element={<Home/>} />
                <Route exact path='/car' element={<Car/>}></Route>
                <Route exact path='/register' element={<Register/>} />
                <Route exact path='/addCar' element={<AddCar/>} />
                <Route exact path='/revision' element={<Revision/>} />
                <Route exact path='/login' element={<Login/>} />


            </Routes>
        </BrowserRouter>
    </div>
  )
}
export default injectContext(Layout);
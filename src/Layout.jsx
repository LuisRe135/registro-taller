import React from 'react'
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from './views/Home.jsx'
import Car from './views/Car.jsx'
import UnderInspection from './views/UnderInspection.jsx'
import injectContext from './js/store/appContext.js'
import Revision from './views/Revision.jsx'
import AddCar from './views/AddCar.jsx'


export const Layout = () => {
  const basename = process.env.BASENAME || "";
  return (
    <div>
        <BrowserRouter basement={basename}>
            <Routes>
                <Route exact path='/' element={<Home/>}></Route>
                <Route exact path='/car' element={<Car/>}></Route>
                <Route exact path='/underInspection' element={<UnderInspection/>}></Route>
                <Route exact path='/revision' element={<Revision/>}></Route>
                <Route exact path='/addCar' element={<AddCar/>} />


            </Routes>
        </BrowserRouter>
    </div>
  )
}
export default injectContext(Layout);
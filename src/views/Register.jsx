import React, {useContext, useState} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";



const Register = () =>{
        const {store, actions} = useContext(Context)
        const location = useLocation();
        const navigate = useNavigate();
        const [taller, setTaller] = useState({
               name: "",
               email: "",
               password: "",
               phone: "",
               address: ""
            })
        const handleRegister = () => {
            actions.register(taller)
            navigate("/login")
        }
        return (
            <div className='container'>
                <h1>Registro de Taller</h1>
                <div className='container'>
                    <h3>Informacion del Taller</h3>
                    <label className="form-label">Nombre</label>
                    <input className="form-control" type="text" id="name" placeholder="Nombre del Taller" 
                    value={taller.name} 
                    onChange={
                                    (event) => setTaller({
                                        ...taller,
                                        name: event.target.value
                                    })
                                }></input>
                    <label className="form-label">Email</label>
                    <input className="form-control" type="email" id="email" placeholder="Email del Taller"
                    value={taller.email} 
                    onChange={
                                    (event) => setTaller({
                                        ...taller,
                                        email: event.target.value
                                    })
                                } ></input>
                    <label className="form-label">Password</label>
                    <input className="form-control" type="password" id='password' placeholder="Password"
                    value={taller.password} 
                    onChange={
                                    (event) => setTaller({
                                        ...taller,
                                        password: event.target.value
                                    })
                                } ></input>
                    
                    <label className="form-label">Telefono</label>
                    <input className="form-control" type="text" id='phone' placeholder="Telefono (opcional)"
                    value={taller.phone} 
                    onChange={
                                    (event) => setTaller({
                                        ...taller,
                                        phone: event.target.value
                                    })
                                } ></input>
                    <label className="form-label">Direccion</label>
                    <input className="form-control" id='address' type="text" placeholder="Direccion"
                    value={taller.address} 
                    onChange={
                                    (event) => setTaller({
                                        ...taller,
                                        address: event.target.value
                                    })
                                } ></input>
                    </div>
                    <button className='btn btn-primary mt-3'
                    onClick={() => handleRegister()}>Registrar</button>
            </div>
         )
     }



     export default Register;
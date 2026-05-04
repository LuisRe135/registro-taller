import React, {useContext, useState} from 'react'
import { Context } from '../js/store/appContext.js'
import { useNavigate } from "react-router-dom";



const Login = () =>{
        const navigate = useNavigate();
        const {actions} = useContext(Context)
        const [taller, setTaller] = useState({
               email: "",
               password: ""
            })
        const handleLogin = async () => {
            const result = await actions.login(taller.email, taller.password)
            if (result.success) navigate("/home")
        }
        return (
            <div className='container'>
                <h1>Login</h1>
                <div className='container'>
                    <h3>Introduzca credenciales</h3>
                    
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
                    
                </div>
                    <button className='btn btn-primary mt-3'
                    onClick={() => handleLogin()}>Log in</button>
                    <button className='btn btn-secondary mt-3 ms-3' onClick={() => navigate("/register")}>Registrarse</button>
            </div>
         )
     }



     export default Login;
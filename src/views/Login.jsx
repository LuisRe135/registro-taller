import React, {useContext, useState, useEffect} from 'react'
import { Context } from '../js/store/appContext.js'
import { useNavigate } from "react-router-dom";

const CarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5ff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2v-5l3-7h12l3 7v5a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M9 17h6"/>
  </svg>
)

const Login = () => {
  const navigate = useNavigate();
  const {actions} = useContext(Context)
  const [taller, setTaller] = useState({ email: "", password: "" })
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (!errorMsg) return
    const timer = setTimeout(() => setErrorMsg(null), 5000)
    return () => clearTimeout(timer)
  }, [errorMsg])

  const handleLogin = async () => {
    setErrorMsg(null)
    const result = await actions.login(taller.email, taller.password)
    if (result.success) navigate("/home")
    else setErrorMsg("Credenciales incorrectas. ¿No tienes cuenta?")
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><CarIcon /></div>
          <span className="auth-logo-text">Car Registry</span>
        </div>
        <h1 className="auth-title">Bienvenido</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para continuar</p>

        <label className="form-label">Email</label>
        <input className="form-control" type="email" placeholder="email@taller.com"
          value={taller.email}
          onChange={(event) => setTaller({ ...taller, email: event.target.value })} />

        <label className="form-label">Contraseña</label>
        <input className="form-control" type="password" placeholder="••••••••"
          value={taller.password}
          onChange={(event) => setTaller({ ...taller, password: event.target.value })} />

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}{' '}
            <div className="alert-link btn btn-link p-0">
              Regístrate abajo
            </div>
          </div>
        )}

        <div className="auth-actions">
          <button className="btn btn-primary w-100" onClick={() => handleLogin()}>
            Iniciar sesión
          </button>
        </div>

        <div className="auth-footer">
          ¿No tienes cuenta?{' '}
          <button onClick={() => navigate("/register")}>Registrarse</button>
        </div>
      </div>
    </div>
  )
}

export default Login;

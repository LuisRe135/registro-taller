import React, {useContext, useState, useEffect} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";

const CarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e5ff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2v-5l3-7h12l3 7v5a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M9 17h6"/>
  </svg>
)

const Register = () => {
  const {store, actions} = useContext(Context)
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    taller_name: "", admin_name: "", email: "", password: "", phone: "", address: ""
  })
  const [errorMsg, setErrorMsg] = useState(null)

  useEffect(() => {
    if (!errorMsg) return
    const timer = setTimeout(() => setErrorMsg(null), 5000)
    return () => clearTimeout(timer)
  }, [errorMsg])

  const handleRegister = async () => {
    setErrorMsg(null)
    const result = await actions.register(form)
    if (result.success) {
      const loginResult = await actions.login(form.email, form.password)
      if (loginResult.success) navigate("/home")
      else navigate("/login")
    } else {
      setErrorMsg(result.error || "Error al registrar. Intenta de nuevo.")
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon"><CarIcon /></div>
          <span className="auth-logo-text">Car Registry</span>
        </div>
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Registra tu taller para comenzar</p>

        <label className="form-label">Nombre del Taller</label>
        <input className="form-control" type="text" placeholder="Taller Mecánico..."
          value={form.taller_name}
          onChange={(e) => setForm({ ...form, taller_name: e.target.value })} />

        <label className="form-label">Tu nombre</label>
        <input className="form-control" type="text" placeholder="Juan Pérez"
          value={form.admin_name}
          onChange={(e) => setForm({ ...form, admin_name: e.target.value })} />

        <label className="form-label">Email</label>
        <input className="form-control" type="email" placeholder="email@taller.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })} />

        <label className="form-label">Contraseña</label>
        <input className="form-control" type="password" placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })} />

        <label className="form-label">
          Teléfono <span style={{ color: 'rgba(41,41,41,0.3)', fontWeight: 400 }}>· opcional</span>
        </label>
        <input className="form-control" type="text" placeholder="+58 000 000 0000"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <label className="form-label">
          Dirección <span style={{ color: 'rgba(41,41,41,0.3)', fontWeight: 400 }}>· opcional</span>
        </label>
        <input className="form-control" type="text" placeholder="Av. Principal..."
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })} />

        {errorMsg && (
          <div className="alert alert-danger" role="alert">
            {errorMsg}
          </div>
        )}

        <div className="auth-actions">
          <button className="btn btn-primary w-100" onClick={() => handleRegister()}>
            Crear cuenta
          </button>
        </div>

        <div className="auth-footer">
          ¿Ya tienes cuenta?{' '}
          <button onClick={() => navigate("/login")}>Iniciar sesión</button>
        </div>
      </div>
    </div>
  )
}

export default Register;

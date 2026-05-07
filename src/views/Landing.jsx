import React from 'react'
import { useNavigate } from 'react-router-dom'

const CarIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#e5ff80" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2v-5l3-7h12l3 7v5a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M9 17h6"/>
  </svg>
)

const Landing = () => {
  const navigate = useNavigate()
  return (
    <div className="landing-page">
      <div className="landing-glow" />
      <div className="landing-glow-2" />
      <div className="landing-content">
        <div className="landing-logo-mark">
          <CarIcon />
        </div>
        <h1 className="landing-title">Car Registry</h1>
        <p className="landing-subtitle">Gestión de vehículos y revisiones de taller</p>
        <div className="landing-actions">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Iniciar sesión
          </button>
          <button className="btn btn-secondary" onClick={() => navigate('/register')}>
            Registrarse
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing

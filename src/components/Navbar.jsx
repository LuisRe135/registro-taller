import React from 'react'
import { Link } from 'react-router-dom'

const CarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#e5ff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2v-5l3-7h12l3 7v5a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M9 17h6"/>
  </svg>
)

const MoonIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const Navbar = () => {
  return (
    <nav className="cr-navbar">
      <Link to="/home" className="cr-nav-logo">
        <div className="cr-nav-logo-icon"><CarIcon /></div>
        <span className="cr-nav-logo-text">Car Registry</span>
      </Link>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <Link to="/home" className="cr-nav-link">Buscar</Link>
        <button className="cr-nav-icon-btn" title="Modo oscuro">
          <MoonIcon />
        </button>
      </div>
    </nav>
  )
}

export default Navbar

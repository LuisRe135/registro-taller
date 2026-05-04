import React from 'react'
import { useNavigate } from 'react-router-dom'

const Landing = () => {
  const navigate = useNavigate()

  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100'>
      <h1 className='mb-4'>Car Registry</h1>
      <div className='d-flex gap-3'>
        <button className='btn btn-primary btn-lg' onClick={() => navigate('/login')}>
          Iniciar sesión
        </button>
        <button className='btn btn-outline-secondary btn-lg' onClick={() => navigate('/register')}>
          Registrarse
        </button>
      </div>
    </div>
  )
}

export default Landing

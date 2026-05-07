import React, { useContext, useState } from 'react'
import { Context } from '../js/store/appContext.js'
import { useNavigate } from "react-router-dom"
import Navbar from '../components/Navbar'

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
)

export const Home = () => {
  const {store, actions} = useContext(Context)
  const [placa, setPlaca] = useState("")
  const navigate = useNavigate();
  const token = store.token

  const findCarAndProceed = async(placa) => {
    const found = await actions.findCar(placa)
    console.log(found)
    if (found) {
      navigate("/car")
    } else {
      actions.resetStore()
      console.log("Paso por aqui")
      console.log(placa)
      navigate("/addCar", {state: {placa}})
    }
  }

  return (
    <div className="home-page">
      <Navbar />
      <div className="home-body">
        <div className="search-card">
          <p className="search-eyebrow">Taller</p>
          <h2 className="search-title">Buscar Vehículo</h2>
          <label className="form-label">Número de placa</label>
          <div className="search-input-row">
            <input
              className="form-control plate-text"
              placeholder="ABC-1234"
              style={{ textTransform: 'uppercase' }}
              onChange={(event) => setPlaca(event.target.value)}
            />
            <button
              className="btn btn-primary"
              style={{ whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 6 }}
              onClick={() => findCarAndProceed(placa)}
            >
              <SearchIcon /> Buscar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home

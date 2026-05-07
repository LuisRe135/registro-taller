import React, {useContext, useState} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar'

const CarAddIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 01-2-2v-5l3-7h12l3 7v5a2 2 0 01-2 2h-2"/>
    <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
    <path d="M9 17h6"/>
  </svg>
)

const AddCar = () => {
  const location = useLocation();
  const placa = location.state?.placa || "";
  const navigate = useNavigate();
  const {store, actions} = useContext(Context)
  const [vehiculo1, setVehiculo1] = useState({
    placa: placa,
    owner: "",
    marca: "",
    modelo: "",
    year: "",
    color: "",
  })

  const addCar = () => {
    actions.addCar(vehiculo1)
    navigate("/car")
  }

  return (
    <div className="addcar-page">
      <Navbar />
      <div className="addcar-body">
        <div className="addcar-content">
          <div className="addcar-header">
            <h1>Nuevo Vehículo</h1>
            <p>Completa la información del vehículo</p>
          </div>

          <div className="cr-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div className="icon-box"><CarAddIcon /></div>
              <h3>Información del Vehículo</h3>
            </div>

            <label className="form-label">Placa *</label>
            <input className="form-control plate-text" type="text" placeholder="ABC-1234"
              style={{ textTransform: 'uppercase' }}
              value={vehiculo1.placa}
              onChange={(event) => setVehiculo1({ ...vehiculo1, placa: event.target.value })} />

            <label className="form-label">Propietario *</label>
            <input className="form-control" type="text" placeholder="Nombre del propietario"
              value={vehiculo1.owner}
              onChange={(event) => setVehiculo1({ ...vehiculo1, owner: event.target.value })} />

            <label className="form-label">Marca</label>
            <input className="form-control" type="text" placeholder="Toyota, Ford, Chevrolet..."
              value={vehiculo1.marca}
              onChange={(event) => setVehiculo1({ ...vehiculo1, marca: event.target.value })} />

            <label className="form-label">Modelo</label>
            <input className="form-control" type="text" placeholder="Corolla, F-150..."
              value={vehiculo1.modelo}
              onChange={(event) => setVehiculo1({ ...vehiculo1, modelo: event.target.value })} />

            <label className="form-label">Año</label>
            <input className="form-control" type="text" placeholder="2020"
              value={vehiculo1.year}
              onChange={(event) => setVehiculo1({ ...vehiculo1, year: event.target.value })} />

            <label className="form-label">Color</label>
            <input className="form-control" type="text" placeholder="Blanco, Negro, Rojo..."
              value={vehiculo1.color}
              onChange={(event) => setVehiculo1({ ...vehiculo1, color: event.target.value })} />

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-primary" onClick={() => addCar()}>
                Registrar Vehículo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddCar

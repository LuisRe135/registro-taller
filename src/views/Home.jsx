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
  const [employee, setEmployee] = useState({ name: "", email: "", password: "" })
  const [employeeMsg, setEmployeeMsg] = useState(null)
  const navigate = useNavigate();
  const isAdmin = store.user?.role === 'admin'

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

  const handleCreateEmployee = async () => {
    setEmployeeMsg(null)
    const result = await actions.createEmployee(employee)
    if (result.success) {
      setEmployeeMsg({ type: "success", text: `Empleado ${result.user.name} creado exitosamente.` })
      setEmployee({ name: "", email: "", password: "" })
    } else {
      setEmployeeMsg({ type: "error", text: result.error || "Error al crear empleado." })
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

        {isAdmin && (
          <div className="search-card" style={{ marginTop: 24 }}>
            <p className="search-eyebrow">Administración</p>
            <h2 className="search-title">Agregar Empleado</h2>

            <label className="form-label">Nombre</label>
            <input className="form-control" type="text" placeholder="Juan Pérez"
              value={employee.name}
              onChange={(e) => setEmployee({ ...employee, name: e.target.value })} />

            <label className="form-label" style={{ marginTop: 12 }}>Email</label>
            <input className="form-control" type="email" placeholder="empleado@taller.com"
              value={employee.email}
              onChange={(e) => setEmployee({ ...employee, email: e.target.value })} />

            <label className="form-label" style={{ marginTop: 12 }}>Contraseña temporal</label>
            <input className="form-control" type="password" placeholder="••••••••"
              value={employee.password}
              onChange={(e) => setEmployee({ ...employee, password: e.target.value })} />

            {employeeMsg && (
              <div className={`alert ${employeeMsg.type === "success" ? "alert-success" : "alert-danger"}`}
                style={{ marginTop: 12 }} role="alert">
                {employeeMsg.text}
              </div>
            )}

            <button className="btn btn-primary w-100" style={{ marginTop: 16 }}
              onClick={handleCreateEmployee}>
              Crear empleado
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home

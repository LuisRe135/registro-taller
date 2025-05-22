import React, {useContext, useState} from 'react'
import { useLocation, useNavigate } from "react-router-dom";

const Revision = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [revision, setRevision] = useState(location.state.item)
  const {store, actions} = useContext(Context)
  const vehiculos = store.vehiculos
  let carro = (vehiculos.find(vehiculo => vehiculo.placa == placa))
  const editarYRedireccionar = () => {
    actions.editRevision(revision.placa, revision.fecha, revision.hora);
    navigate("/car", {state : {carro}})
  }
  
  return (
    <div className="container">Revision

        {/* Fecha */}
        <h2>{revision.fecha}</h2>
        {/* razon por la que visita el taller */}
        <input className="form-control" type="text"id="owner" value={revision.razon}
          onChange={(event) => setRevision({
            ...revision,
            razon: event.target.value})}></input>
        {/* reparacion/trabajo realizado */}
        <input className="form-control" type="text"id="owner" value={revision.trabajo}
          onChange={(event) => setRevision({
            ...revision,
            trabajo: event.target.value})}></input>
        {/* Estatus: en revision, reparado, no reparado */}
        <select className="form-select" type="text"id="owner" value={revision.estatus}
          onChange={(event) => setRevision({
            ...revision,
            estatus: event.target.value})}>
              <option value="En revision">En revision</option>
              <option value="En reparacion">En reparacion</option>
              <option value="Terminado">Terminado</option>
            </select>
        {/* llamar actions.editRevision() con los datos que pongan en los forms */}
        <button onClick={()=>{editarYRedireccionar()}}>Editar</button>
    </div>
  )
}

export default Revision
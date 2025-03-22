import React, {useContext, useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";

const Car = () => {
  const location = useLocation();
  const carro = location.state.vehiculo
  const [razon, setRazon] = useState('')
  const {store, actions} = useContext(Context)
  let revisiones = store.revisiones
  useEffect(() => {
    console.log("Revisiones en el store cambiaron:", store.revisiones);
}, [store.revisiones]);
  const agregarRevision = ()=> {
    const fecha = new Date();
  
  // Format the date to DD/MM/YYYY
    const formattedDate = fecha.getDate().toString().padStart(2, '0') + '/' +
                        (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        fecha.getFullYear();
  
  // Get the time in HH:MM:SS format
    const formattedTime = fecha.toLocaleTimeString('en-GB'); // 'en-GB' ensures 24-hour format
    const infoRevision = {
      placa: carro.placa,
      razon: razon,
      fecha: formattedDate,
      hora: formattedTime
    }
    
    actions.addRevision(infoRevision)
   
    console.log("en agregarRevision:",infoRevision)
    
  }


  return (
    <div>Car
        <Navbar />
        {/* 
            
            Numero de placa
            Marca/mocelo
            Color
            Dueño
            */}

        <div>{carro.placa}</div>
        <div>{carro.owner}</div>
        <div>{carro.marca}</div>
        <div>{carro.modelo}</div>
        <div>{carro.year}</div>
        <div>{carro.color}</div>


        <label for="owner" className="form-label">Razon de la visita</label>
        <input className="form-control" type="text"id="owner" placeholder="Por que vino al taller?" 
          onChange={(event) => setRazon(event.target.value)}></input>

          <button type="button" className="btn btn-primary" onClick={()=> agregarRevision()}>Agregar una nueva revision</button>
          <button type="button" className="btn btn-primary" onClick={()=> (actions.showRevisiones())}>Ver revisiones</button>
            {/* Revision actual: por que entro al taller? agregar la reparacion que se le hizo cuando este listo

            Revisiones pasadas: Una lista con las fechas, fallas, reparacion que se le hizo o resultado de la revision. */}
        <div className='container'>
          <ul>
            <div>
              {store.revisiones && store.revisiones.length > 0 ? (
                store.revisiones.map((item, index) => (
                  <li key={index}>
                    <div>{item.fecha}</div>
                    <div>{item.hora}</div>
                    <div>{item.razon}</div>
                    
                  </li>
                ))
              ) : (
                <p>No hay revisiones registradas.</p>
              )}
            </div>

          </ul>
        </div>

    </div>
  )
}

export default Car
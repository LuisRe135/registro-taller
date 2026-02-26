import React, {useContext, useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";

const Car = () => {
  const location = useLocation();
  const {store, actions} = useContext(Context)
  
  const carro = store.car 
  console.log("aqui el carro antes del useEffect:",carro)
  const [razon, setRazon] = useState('')
  const navigate = useNavigate();
  const [revisionesLocales, setRevisionesLocales] = useState([]);


  useEffect(() => {
  // Solo ejecutar si el carro ya está definido y no es vacío
  if (store.car && Object.keys(store.car).length > 0 && store.car.placa) {
    console.log("✅ Cargando revisiones del carro:", store.car.placa);
    console.log("revisiones en Car: ", store.revisiones)
    

  }
}, [store.car?.placa]);

  const agregarRevision = async()=> {
      const fecha = new Date();
    
    // Format the date to DD/MM/YYYY
      const formattedDate = fecha.getDate().toString().padStart(2, '0') + '/' +
                          (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +
                          fecha.getFullYear();
    
    // Get the time in HH:MM:SS format
      const formattedTime = fecha.toLocaleTimeString('en-GB'); // 'en-GB' ensures 24-hour format

    // Create the object with the information
      const infoRevision = {
        placa: carro.placa,
        razon: razon,
        fecha: formattedDate,
        hora: formattedTime,
        estatus: 'En revision'
        
      }
          
      await actions.addRevision(infoRevision)
      setRazon("")
    
  }

  console.log("store.car al re-render:", store.car)
  console.log("store.revisiones al re-render:", store.revisiones)

  return (
    <div>Car
        <Navbar />
        {/* 
            
            Numero de placa
            Marca/mocelo
            Color
            Dueño
            */}

        <div>{store.car.placa}</div>
        <div>{carro.owner}</div>
        <div>{carro.marca}</div>
        <div>{carro.modelo}</div>
        <div>{carro.year}</div>
        <div>{carro.color}</div>


        <label className="form-label">Razon de la visita</label>
        <input className="form-control" type="text"id="owner" placeholder="Por que vino al taller?" value={razon}
          onChange={(event) => setRazon(event.target.value)}></input>

          <button type="button" className="btn btn-primary" onClick={()=> agregarRevision()}>Agregar una nueva revision</button>
          <button type="button" className="btn btn-primary" onClick={()=> (actions.showRevisiones(carro.placa))}>Ver revisiones</button>
            {/* Revision actual: por que entro al taller? agregar la reparacion que se le hizo cuando este listo
                                                      /////////////
            Revisiones pasadas: Una lista con las fechas, fallas, reparacion que se le hizo o resultado de la revision. */}
        <div className='container'>
          <ul>
            <div>
              {store.revisiones && store.revisiones.length > 0 ? (
                store.revisiones
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((item, index) => (
                  <li key={index}>
                    <div>{item.fecha}</div>
                    <div>{item.hora}</div>
                    <div>{item.razon}</div>
                    <div>{item.estatus}</div>
                    <div>{item.trabajo}</div>

                    {/* Boton que redireccione a Revision.jsx */}
                    <button onClick={()=>{navigate("/revision", { state: {item} })}}>Editar</button>
                    <button onClick={()=>{actions.deleteRevision(item.id, store.car.placa)}}>Eliminar</button>
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
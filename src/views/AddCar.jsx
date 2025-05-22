import React, {useContext, useState} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";



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

    const addCarResetPlaca = () =>{
        actions.addCar(vehiculo1)
        navigate("/car", { state: {vehiculo1} })
        
    }    
  return (
    <div>AddCar
        {/* 
            Formulario para agregar un carro, que luego te envie a la vista "Car.jsx" si se agrego correctamente.
         */}
         <div className='container'>
              <h3>Informacion del Vehiculo</h3>
              <label className="form-label">Placa</label>
              <input className="form-control" type="text" id="placa" placeholder="Placa" 
              value={vehiculo1.placa} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                placa: event.target.value
                            })
                        }></input>
              <label className="form-label">Prepietario</label>
              <input className="form-control" type="text"id="owner" placeholder="Nombre del propietario"
              value={vehiculo1.owner} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                owner: event.target.value
                            })
                        } ></input>
               <label className="form-label">Marca</label>
              <input className="form-control" type="text" id='marca' placeholder="Marca"
              value={vehiculo1.marca} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                marca: event.target.value
                            })
                        } ></input>
              
              <label className="form-label">Modelo</label>
              <input className="form-control" type="text" id='model' placeholder="Modelo"
              value={vehiculo1.modelo} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                modelo: event.target.value
                            })
                        } ></input>
               <label className="form-label">Año</label>
               <input className="form-control" id='year' type="text" placeholder="Año"
              value={vehiculo1.year} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                year: event.target.value
                            })
                        } ></input>
               <label className="form-label">Color</label>
               <input className="form-control" type="text" id="color" placeholder="Color"
              value={vehiculo1.color} 
              onChange={
                            (event) => setVehiculo1({
                                ...vehiculo1,
                                color: event.target.value
                            })
                        } ></input>
         </div>

         <button type="button" className="btn btn-primary"
         onClick={() => addCarResetPlaca()}
         >Enviar</button>
         <button type="button" className="btn btn-primary"
         onClick={() => actions.showCars()}
         >Carros guardados</button>

    </div>
  )
}

export default AddCar
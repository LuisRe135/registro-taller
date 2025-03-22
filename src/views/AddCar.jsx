import React, {useContext, useState} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";



const AddCar = () => {

    const location = useLocation();
    const placa = location.state?.placa || "";
    const navigate = useNavigate();
  
    const {store, actions} = useContext(Context)
    const [vehiculo, setVehiculo] = useState({
        placa: placa,
        owner: "",
        marca: "",
        modelo: "",
        year: "",
        color: "",
     })

    const addCarResetPlaca = () =>{
        actions.addCar(vehiculo)
        navigate("/car", { state: {vehiculo} })
        
    }    
  return (
    <div>AddCar
        {/* 
            Formulario para agregar un carro, que luego te envie a la vista "Car.jsx" si se agrego correctamente.
         */}
         <div className='container'>
              <h3>Informacion del Vehiculo</h3>
              <label for="placa" className="form-label">Placa</label>
              <input className="form-control" type="text" id="placa" placeholder="Placa" 
              value={vehiculo.placa} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
                                placa: event.target.value
                            })
                        }></input>
              <label for="owner" className="form-label">Prepietario</label>
              <input className="form-control" type="text"id="owner" placeholder="Nombre del propietario"
              value={vehiculo.owner} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
                                owner: event.target.value
                            })
                        } ></input>
               <label for="marca" className="form-label">Marca</label>
              <input className="form-control" type="text" id='marca' placeholder="Marca"
              value={vehiculo.marca} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
                                marca: event.target.value
                            })
                        } ></input>
              
              <label for="model" className="form-label">Modelo</label>
              <input className="form-control" type="text" id='model' placeholder="Modelo"
              value={vehiculo.modelo} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
                                modelo: event.target.value
                            })
                        } ></input>
               <label for="year" className="form-label">Año</label>
               <input className="form-control" id='year' type="text" placeholder="Año"
              value={vehiculo.year} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
                                year: event.target.value
                            })
                        } ></input>
               <label for="color" className="form-label">Color</label>
               <input className="form-control" type="text" id="color" placeholder="Color"
              value={vehiculo.color} 
              onChange={
                            (event) => setVehiculo({
                                ...vehiculo,
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
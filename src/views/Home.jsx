import React, { useContext, useState } from 'react'
import { Context } from '../js/store/appContext.js'
import { useNavigate } from "react-router-dom"

export const Home = () => {
  
  const {store, actions} = useContext(Context)
  const [placa, setPlaca] =useState("")
  
  const navigate = useNavigate();
  const token = store.token
  const findCarAndProceed = async(placa) =>{
    const found = await actions.findCar(placa)
    console.log(found)
    if (found){
            
      navigate("/car")
    }
    else {
      actions.resetStore() 
      console.log("Paso por aqui")
      console.log(placa)
      navigate("/addCar", {state : {placa}})
    }
  }
  return (
    <div className='d-flex container justify-content-center align-items-center m-5'>
       
        {/*     aqui agarrar la placa del carro.
                verificar que existe
                si existe: ir a una pagina que muestre la info del carro, con la opcion de iniciar una nueva revision
                si no existe: ir a un formulario  para agregar un carro.    
        */}

        <label>Inserte numero de placa
        </label>
        <input className='form-control' onChange={(event) => setPlaca(event.target.value)}></input>
        <button className="btn btn-info " onClick={()=>findCarAndProceed(placa) }>Buscar</button>

    </div>
  )
}

export default Home
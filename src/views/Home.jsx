import React, { useContext, useState } from 'react'
import { Context } from '../js/store/appContext.js'
import Navbar from '../components/Navbar.jsx'
import { useNavigate } from 'react-router-dom'

export const Home = () => {

  const {store, actions} = useContext(Context)
  const [placa, setPlaca] =useState("")
  
  const navigate = useNavigate();
  
  const findCarAndProceed = (placa) =>{
    if (actions.findCar(placa)){
      
      navigate("/car")
    }
    else {
      console.log("Paso por aqui")
      console.log(placa)
      navigate("/addCar", {state : {placa}})
    }
  }
  return (
    <div>Home
        <Navbar></Navbar>
        {/*     aqui agarrar la placa del carro.
                verificar que existe
                si existe: ir a una pagina que muestre la info del carro, con la opcion de iniciar una nueva revision
                si no existe: ir a un formulario  para agregar un carro.    
        */}

        <label>Inserte numero de placa
        </label>
        <input onChange={(event) => setPlaca(event.target.value)}></input>
        <button onClick={()=>findCarAndProceed(placa) }>Buscar</button>

    </div>
  )
}

export default Home
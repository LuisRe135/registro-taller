const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro","Maria"],
			vehiculos: [],
			revisiones: [],
			car: {}
		},
		actions: {

			// 		POST

			addCar: async(car) => {
				const response = await fetch("http://127.0.0.1:5000/public/car", {
					method: "POST",
					 headers: {
    					"Content-Type": "application/json"
  					},
					body: JSON.stringify(car)
				})

				const data = await response.json()
				console.log("Aqui se agregan carros", data)


				//    Con este codigo abajo se agrega en el store

				// const store = getStore()
				// setStore({ ...store, car: car });
				// setStore(prev => ({ ...prev, car }))
				setStore({ car: car });
				
			},
			addRevision: async(rev) =>{
				await fetch("http://127.0.0.1:5000/public/revision", {
					method: "POST",
					headers: {
    					"Content-Type": "application/json"
  					},
					body: JSON.stringify(rev)
				})

				// const data = await response.json()
				// console.log("Aqui se agregan revisiones", data)
				const response = await fetch("http://127.0.0.1:5000/public/revisions/" + rev.placa, {
					method: "GET"
				})
				const revisiones = await response.json()
				setStore({ revisiones: revisiones })

				//		Debajo: Agrega revision en store

				// const store = getStore();
				// console.log("despues del getStore")
				// let revision = {
				// 	placa: rev.placa,
				// 	razon: rev.razon,
				// 	fecha: rev.fecha,
				// 	hora: rev.hora,
				// 	estatus: 'En revision',
				// 	trabajo: ''
				// }
				// console.log("revision en el flux:", revision)

				// console.log("Before update, revisiones:", store.revisiones);
				// // agrega revision
				// let updatedRevisiones = store.revisiones;
				// updatedRevisiones.push(revision)
				// setStore({...store, revisiones: updatedRevisiones});

				// console.log("Revisiones actualizadas:", getStore().revisiones)
				
				
			},

			// 		GET

			findCar: async(plate) => {  //recordar poner el async
				
				
				console.log("Entro al findCar")
				const response = await fetch("http://127.0.0.1:5000/public/car/"+plate, {
					method: "GET"
				});
				console.log("Segundo checkpoint")
				const carro = await response.json()
				console.log("carro individual",carro.placa)
				
				
				//	MOSTRAR LA INFO DEL BACK-END EN EL FRONT-END
				
				if (!carro.error){
					const response = await fetch("http://127.0.0.1:5000/public/revisions/"+plate, {
						method: "GET"
					});
					const revisiones = await response.json()
					console.log("en findCar:", revisiones)
					setStore({ car: carro, revisiones: revisiones })
					// dispatch({
					// 	type: "find car",
					// 	payload: {}
					// })
					// const store = getStore()
					// console.log("fC carro:", store.car)
					// console.log("fC revisiones:", store. revisiones)
					
					console.log("fC 2 carro:", carro)

					console.log("en findCar:", getStore().revisiones)
					
					// const store = getStore()
					// setStore({ ...store, car: carro })
					
					return true
				}
				return  false

			},

			showRevisiones: async(plate) =>{
				const response = await fetch("http://127.0.0.1:5000/public/revisions/"+plate, {
					method: "GET"
				});
				const rev = await response.json()
				console.log("revisiones de la DB:", rev)
				// setStore({ revisiones });
				// const store = getStore()
				// setStore({...store, revisiones: rev})
				// console.log("dentro de showRevisiones", store)
				
				// setStore(prev => ({
				// 					...prev, 
				// 					revisiones: rev
				// 			}))
				// console.log("showing revisions123:", store)
			},
			showCars: () =>{
				const store = getStore()
				console.log("showing:", store.vehiculos)
			},


			// prev => {
			// 		console.log("Store antes:", prev)
			// 		const nuevo = { ...prev, revisiones: revisiones }
			// 		console.log("Store después:", nuevo)
			// 		return nuevo
			// 		}
			// 		PUT

			editRevision: async (rev, placa)=>{
				const response = await fetch(`http://127.0.0.1:5000/public/revision/${rev.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(rev)
				})
				
				console.log("revision en editar:", rev)
				if (!response.ok) {
					const data = await response.json();
					throw new Error(data.error || "Error updating user");
				}

				const data = await response.json();
				console.log("Revision updated:", data)
				const  actions = getActions()
				actions.findCar(placa)
			


				//		Debajo: edita revision en el store 

				// const store = getStore()
				// const revisionesActualizadas = store.revisiones.map(revision => {
				// if (
				// 	revision.placa === rev.placa &&
				// 	revision.fecha === rev.fecha &&
				// 	revision.hora === rev.hora
				// ) {
				// 	// Retorna una nueva revisión con los nuevos datos
				// 	return {
				// 		...revision,
				// 		estatus: rev.estatus,
				// 		trabajo: rev.trabajo
				// 	};
				// }
				// return revision; // Las demás revisiones se mantienen igual
				// });

				// setStore({ ...store, revisiones: revisionesActualizadas });
			},

			deleteRevision: async(rev, placa)=>{
				const response = await fetch(`http://127.0.0.1:5000/public/revision/${rev}`, {
					method: "DELETE",
					headers: {
							'Content-Type': 'application/json',
						}
				})
				if (!response.ok) {
					throw new Error('Error al eliminar el viaje');
				}
				const data = await response.json();
				console.log('revision eliminada:', data);
				const actions = getActions();

				actions.findCar(placa)

			}
			
		}
	};
};

export default getState;
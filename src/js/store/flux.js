const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro","Maria"],
			vehiculos: [],
			revisiones: [],
			car: {},
			taller: null,
			observaciones: [],
			token: localStorage.getItem("token") || null
		},
		actions: {

			// 		POST
			register: async(taller) => {
				const response = await fetch("http://127.0.0.1:5000/public/register", {
					method: "POST",
					 headers: {
    					"Content-Type": "application/json"
  					},
					body: JSON.stringify(taller)
				})

				const data = await response.json()
				console.log("Aqui se agregan carros", data)
				return response.ok ? { success: true } : { success: false, error: data.error }
			},
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

				setStore({ car: car, revisiones: [] });
				
			},
			addRevision: async(rev) =>{
				const token = getStore().token

				await fetch("http://127.0.0.1:5000/public/revision", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
					
  					},
					body: JSON.stringify(rev)
				})

				const response = await fetch("http://127.0.0.1:5000/public/revisions/" + rev.placa, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
  					}
				})
				const revisiones = await response.json()
				setStore({ revisiones: revisiones })

				return true
				
			},

			// 		GET

			findCar: async(plate) => {  //recordar poner el async
				
				const token = getStore().token
				const response = await fetch("http://127.0.0.1:5000/public/car/"+plate, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
  					}
				});
				const carro = await response.json()


				//	MOSTRAR LA INFO DEL BACK-END EN EL FRONT-END

				if (response.ok){
					const response = await fetch("http://127.0.0.1:5000/public/revisions/"+plate, {
						method: "GET",
					headers: {
						"Content-Type": "application/json",
						"Authorization": "Bearer " + token
  					}
					});
					const revisiones = await response.json()
					setStore({ car: carro, revisiones: revisiones })
					
							
					
					return true
				}
				return  false

			},

			showCars: () =>{
				const store = getStore()
				console.log("showing:", store.vehiculos)
			},


		
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
				
				const  actions = getActions()
				actions.findCar(placa)
			

			},
			getObservations: async (rev_id) => {
				const response = await fetch(`http://127.0.0.1:5000/public/observations/${rev_id}`, {
					method: "GET",
					headers: { "Content-Type": "application/json" }
				})
				const data = await response.json()
				if (response.ok) setStore({ observaciones: data })
			},
			addObservation: async (obs) => {
				const response = await fetch("http://127.0.0.1:5000/public/observation", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify(obs)
				})
				const data = await response.json()
				return response.ok ? { success: true, data } : { success: false, error: data.error }
			},
			resetStore: () => setStore({car: {}, revisiones: []}),
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

			},
			login: async (email, password) => {
				try {
					const response = await fetch("http://127.0.0.1:5000/public/login", {
						method: "POST",
						headers: {
							"Content-Type": "application/json"
						},
						body: JSON.stringify({ email, password })
					});
					const data = await response.json();
					if (response.ok) {
						localStorage.setItem("token", data.access_token);
						const payload = JSON.parse(atob(data.access_token.split('.')[1]))
						console.log("Token expira:", new Date(payload.exp * 1000))
						setStore({ taller: data.taller, token: data.access_token });
						return { success: true };
					} else {
						return { success: false, error: data.error };
					}
				} catch (error) {
					return { success: false, error: "Network error" };
				}
			},


		}
	};
}
export default getState;
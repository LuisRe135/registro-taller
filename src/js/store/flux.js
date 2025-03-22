const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			personas: ["Pedro","Maria"],
			vehiculos: [],
			revisiones: []
		},
		actions: {

			exampleFunction: () => {
                    console.log("hola")
                    return
			},
			addRevision: async(rev) =>{
				const store = getStore();
				console.log("despues del getStore")
				let revision = {
					placa: rev.placa,
					razon: rev.razon,
					fecha: rev.fecha,
					hora: rev.hora,
					causas: '',
					trabajo: ''
				}
				console.log("revision en el flux:", revision)

				console.log("Before update, revisiones:", store.revisiones);
				// agrega revision
				let updatedRevisiones = store.revisiones;
				updatedRevisiones.push(revision)
				setStore({...store, revisiones: updatedRevisiones});

				console.log("Revisiones actualizadas:", getStore().revisiones)
				
				
			},

			addCar: (car) => {
				const store = getStore()
				console.log("se agrego el carro", car)
				let updatedVehiculos = store.vehiculos;
				updatedVehiculos.push(car)
    
				setStore({ ...store, vehiculos: updatedVehiculos });
				
			},
			showRevisiones: () =>{
				const store = getStore()
				console.log("showing revisions:", store.revisiones)
			},
			showCars: () =>{
				const store = getStore()
				console.log("showing:", store.vehiculos)
			},
			findCar: (plate) => {
				const store = getStore()
				for (let i = 0; i<store.vehiculos.length; i++){
					if (store.vehiculos[i].placa === plate){
						return true
					}
				}
			}
			
		}
	};
};

export default getState;
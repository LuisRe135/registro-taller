import React, {useContext, useState, useEffect} from 'react'
import Navbar from '../components/Navbar'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";

const statusBadgeClass = (estatus) => {
  const map = { 'Terminado': 'badge-completed', 'En reparacion': 'badge-in-progress', 'En revision': 'badge-pending', 'No reparado': 'badge-failed' }
  return map[estatus] || 'badge-pending'
}

const StatusCheckIcon = ({ estatus }) => {
  if (estatus === 'Terminado') return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
    </svg>
  )
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a16207" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  )
}

const WrenchIcon = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#e5ff80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
  </svg>
)

const UserIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
)

const EditIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const TrashIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
)

const PlusIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)

const SendIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
  </svg>
)

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
)

const ChevronUp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="18 15 12 9 6 15"/>
  </svg>
)

const Car = () => {
  const location = useLocation();
  const {store, actions} = useContext(Context)

  const carro = store.car
  const [razon, setRazon] = useState('')
  const [observacionInicial, setObservacionInicial] = useState('')
  const [tipoObservacion, setTipoObservacion] = useState('general')
  const navigate = useNavigate();
  const [revisionesLocales, setRevisionesLocales] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [newObsText, setNewObsText] = useState({});
  const [newObsType, setNewObsType] = useState({});
  const [obsByRev, setObsByRev] = useState({});

  const loadObservations = async (revId) => {
    const response = await fetch(`http://127.0.0.1:5000/public/observations/${revId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    })
    if (response.ok) {
      const data = await response.json()
      setObsByRev(prev => ({ ...prev, [revId]: data }))
    }
  }

  const toggleExpanded = (id) => {
    const willOpen = !expandedItems[id]
    setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    if (willOpen && !obsByRev[id]) loadObservations(id)
  }

  const formatObservacion = (text, tipo) => (tipo === 'repuestos' ? `Repuestos: ${text}` : text);

  useEffect(() => {
    if (store.car && Object.keys(store.car).length > 0 && store.car.placa) {
    }
  }, [store.car?.placa]);

  const agregarRevision = async () => {
    const fecha = new Date();
    const formattedDate = fecha.getDate().toString().padStart(2, '0') + '/' +
                        (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        fecha.getFullYear();
    const formattedTime = fecha.toLocaleTimeString('en-GB');
    const infoRevision = {
      placa: carro.placa,
      razon: razon,
      fecha: formattedDate,
      hora: formattedTime,
      estatus: 'En revision',
      kilometraje: '',
      trabajo: ''
    }
    const created = await actions.addRevision(infoRevision)

    if (observacionInicial.trim() && created?.id) {
      await actions.addObservation({
        fecha: formattedDate,
        hora: formattedTime,
        observacion: formatObservacion(observacionInicial.trim(), tipoObservacion),
        revision_id: created.id
      })
      await loadObservations(created.id)
    }

    setRazon("")
    setObservacionInicial("")
    setTipoObservacion('general')
    setShowAlert(true)
    setTimeout(() => setShowAlert(false), 5000)
  }

  const agregarObservacionEnHistorial = async (revisionId) => {
    const text = (newObsText[revisionId] || '').trim()
    if (!text) return
    const tipo = newObsType[revisionId] || 'general'
    const fecha = new Date();
    const formattedDate = fecha.getDate().toString().padStart(2, '0') + '/' +
                        (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +
                        fecha.getFullYear();
    const formattedTime = fecha.toLocaleTimeString('en-GB');
    await actions.addObservation({
      fecha: formattedDate,
      hora: formattedTime,
      observacion: formatObservacion(text, tipo),
      revision_id: revisionId
    })
    setNewObsText(prev => ({ ...prev, [revisionId]: '' }))
    setNewObsType(prev => ({ ...prev, [revisionId]: 'general' }))
    await loadObservations(revisionId)
  }

  
  const today = new Date().toLocaleDateString('es-VE', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="car-page">
      <Navbar />
      <div className="car-page-body">

        <div>
          <button className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => navigate("/home")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Volver a búsqueda
          </button>
        </div>

        <div className="car-header-card">
          <div className="car-header-top">
            <div>
              <div className="car-title-row">
                <h2 className="car-name">{carro.marca} {carro.modelo}</h2>
                {carro.year && <span className="car-year-badge">{carro.year}</span>}
              </div>
              <div className="car-meta-row">
                <span className="car-meta-badge plate-text">{carro.placa}</span>
                {carro.color && <span className="car-meta-badge">{carro.color}</span>}
              </div>
            </div>
            <button className="btn btn-secondary btn-sm" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <EditIcon /> Editar
            </button>
          </div>
          <div className="car-owner-row">
            <UserIcon />
            <span>{carro.owner}</span>
          </div>
        </div>

        <div className="new-visit-card">
          <div className="nv-header">
            <div className="nv-icon-box"><WrenchIcon /></div>
            <div>
              <p className="nv-title">Ingresar vehículo</p>
              <p className="nv-subtitle">Registrar un nuevo ingreso al taller</p>
            </div>
          </div>
          <label className="nv-title">Motivo de ingreso *</label>
          <input
            type="text"
            className="form-control"
            placeholder="ej. ruido en frenos, luz de motor, cambio de aceite..."
            value={razon}
            onChange={(event) => setRazon(event.target.value)}
          />

          {razon.trim().length > 0 && (
            <>
              <label className="nv-title" style={{ marginTop: 12 }}>Primera observación (opcional)</label>
              <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                <button
                  type="button"
                  className={`btn btn-sm ${tipoObservacion === 'general' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTipoObservacion('general')}>
                  General
                </button>
                <button
                  type="button"
                  className={`btn btn-sm ${tipoObservacion === 'repuestos' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setTipoObservacion('repuestos')}>
                  Repuestos
                </button>
              </div>
              <textarea
                className="form-control"
                placeholder={tipoObservacion === 'repuestos'
                  ? "Lista de repuestos o materiales necesarios..."
                  : "Notas iniciales del mecánico al recibir el carro..."}
                value={observacionInicial}
                rows={3}
                onChange={(event) => setObservacionInicial(event.target.value)}
                style={{ resize: 'none' }}
              />
              <div className="nv-footer">
                <span className="nv-date">Hoy · {today}</span>
                <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  onClick={() => agregarRevision()}
                  disabled={!razon.trim()}>
                  <SendIcon /> Registrar visita
                </button>
              </div>
            </>
          )}
        </div>

        {showAlert && (
          <div className="alert alert-success alert-dismissible fade show d-flex align-items-center gap-2" role="alert">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Carro ingresado</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
            </svg>
            <button type="button" className="btn-close ms-auto" onClick={() => setShowAlert(false)} aria-label="Close" />
          </div>
        )}

        <div className="history-section">
          <div className="history-header">
            <h2 style={{ fontSize: 18, fontWeight: 800 }}>Historial de Servicios</h2>
            
          </div>
          <p className="history-count">
            {store.revisiones && store.revisiones.length > 0
              ? `${store.revisiones.length} revisión${store.revisiones.length !== 1 ? 'es' : ''} en registro`
              : 'Sin revisiones registradas'}
          </p>

          <div>
            {store.revisiones && store.revisiones.length > 0 ? (
              store.revisiones
                .slice()
                .sort((a, b) => b.id - a.id)
                .map((item, index) => (
                  <div key={index} className="revision-item">
                    <div className="revision-item-row">
                      <div className="revision-item-left">
                        <div className="revision-check"
                          style={{ background: item.estatus === 'Terminado' ? '#f0fdf4' : '#fefce8' }}>
                          <StatusCheckIcon estatus={item.estatus} />
                        </div>
                        <div className="revision-info">
                          <div className="revision-badges">
                            <span className={statusBadgeClass(item.estatus)}>{item.estatus}</span>
                            {index === 0 && <span className="badge-latest">Más reciente</span>}
                          </div>
                          <p className="revision-reason">{item.razon}</p>
                          <p className="revision-date">{item.fecha} · {item.hora}</p>
                        </div>
                      </div>
                      <div className="revision-item-right">
                        <div className="revision-actions">
                          <button className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: 4 }}
                            onClick={() => navigate("/revision", { state: {item} })}>
                            <EditIcon /> Abrir visita
                          </button>
                          <button className="btn btn-secondary btn-sm"
                            style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ef4444', borderColor: 'rgba(239,68,68,0.2)' }}
                            onClick={() => actions.deleteRevision(item.id, store.car.placa)}>
                            <TrashIcon /> Eliminar
                          </button>
                        </div>
                        <button className="btn btn-secondary btn-sm"
                          style={{ display: 'flex', alignItems: 'center', padding: '6px 8px' }}
                          onClick={() => toggleExpanded(item.id)}>
                          {expandedItems[item.id] ? <ChevronUp /> : <ChevronDown />}
                        </button>
                      </div>
                    </div>
                    {expandedItems[item.id] && (
                      <div className="revision-expanded">
                        {item.trabajo && (
                          <>
                            <p className="revision-expanded-label">Trabajo Realizado</p>
                            <p className="revision-expanded-text">{item.trabajo}</p>
                            <hr style={{ borderColor: 'rgba(41,41,41,0.1)', margin: '10px 0' }} />
                          </>
                        )}

                        <p className="revision-expanded-label">Última Observación</p>
                        <p className="revision-expanded-text">
                          {(obsByRev[item.id] && obsByRev[item.id].length > 0)
                            ? obsByRev[item.id].slice().sort((a, b) => b.id - a.id)[0].observacion
                            : <span style={{ color: 'rgba(41,41,41,0.3)', fontStyle: 'italic' }}>Sin observaciones registradas.</span>}
                        </p>
                        {!!item.kilometraje && (
                          <p className="revision-expanded-label">Kilometraje: {item.kilometraje}</p>
                        )}

                        {item.estatus !== 'Terminado' && (
                          <>
                            <hr style={{ borderColor: 'rgba(41,41,41,0.1)', margin: '10px 0' }} />
                            <p className="revision-expanded-label">Agregar observación</p>
                            <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
                              <button
                                type="button"
                                className={`btn btn-sm ${(newObsType[item.id] || 'general') === 'general' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setNewObsType(prev => ({ ...prev, [item.id]: 'general' }))}>
                                General
                              </button>
                              <button
                                type="button"
                                className={`btn btn-sm ${newObsType[item.id] === 'repuestos' ? 'btn-primary' : 'btn-secondary'}`}
                                onClick={() => setNewObsType(prev => ({ ...prev, [item.id]: 'repuestos' }))}>
                                Repuestos
                              </button>
                            </div>
                            <textarea
                              className="form-control"
                              rows={2}
                              placeholder={(newObsType[item.id] || 'general') === 'repuestos'
                                ? "Lista de repuestos o materiales..."
                                : "Agregar una nota a esta visita..."}
                              value={newObsText[item.id] || ''}
                              onChange={(event) => setNewObsText(prev => ({ ...prev, [item.id]: event.target.value }))}
                              style={{ resize: 'vertical' }}
                            />
                            <button
                              className="btn btn-secondary btn-sm"
                              style={{ marginTop: 6, display: 'inline-flex', alignItems: 'center', gap: 4 }}
                              onClick={() => agregarObservacionEnHistorial(item.id)}
                              disabled={!(newObsText[item.id] || '').trim()}>
                              <PlusIcon /> Agregar
                            </button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div style={{ textAlign: 'center', padding: '32px 0', color: 'rgba(41,41,41,0.3)', fontSize: 14 }}>
                No hay revisiones registradas.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Car

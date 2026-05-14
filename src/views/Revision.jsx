import React, {useContext, useState, useEffect} from 'react'
import { Context } from '../js/store/appContext.js'
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from '../components/Navbar'

const STATUS_OPTIONS = [
  {
    value: 'En revision',
    label: 'En Revisión',
    baseClass: 'base-pending',
    activeClass: 'active-pending',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    value: 'En reparacion',
    label: 'En Reparación',
    baseClass: 'base-in-progress',
    activeClass: 'active-in-progress',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
      </svg>
    ),
  },
  {
    value: 'Terminado',
    label: 'Completado',
    baseClass: 'base-completed',
    activeClass: 'active-completed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
  },
  {
    value: 'No reparado',
    label: 'No Reparado',
    baseClass: 'base-failed',
    activeClass: 'active-failed',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
    ),
  },
]

const TagIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
)

const DocIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#292929" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
  </svg>
)

const Revision = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [revision, setRevision] = useState(location.state.item)
  const {store, actions} = useContext(Context)
  const vehiculos = store.vehiculos
  let carro = (vehiculos.find(vehiculo => vehiculo.placa == revision.placa))
  const [observacion, setObservacion] = useState('')

  useEffect(() => {
    actions.getObservations(revision.id)
  }, [])

  const editarYRedireccionar = () => {
    actions.editRevision(revision, store.car.placa);
    navigate("/car")
  }
  const agregarObservacion = async () => {
      const fecha = new Date();
      const formattedDate = fecha.getDate().toString().padStart(2, '0') + '/' +
                          (fecha.getMonth() + 1).toString().padStart(2, '0') + '/' +
                          fecha.getFullYear();
      const formattedTime = fecha.toLocaleTimeString('en-GB');
      const infoObservacion = {
        fecha: formattedDate,
        hora: formattedTime,
        observacion: observacion,
        revision_id: revision.id
      }
      await actions.addObservation(infoObservacion)
      setObservacion('')
      actions.getObservations(revision.id)
    }
  return (
    <div className="revision-edit-page">
      <Navbar />
      <div className="revision-edit-body">
        <div style={{ marginBottom: 20 }}>
          <button className="btn btn-secondary btn-sm" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
            onClick={() => navigate("/car")}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
            </svg>
            Volver al vehículo
          </button>
        </div>

        <div className="revision-edit-header">
          <h1>Editar Revisión</h1>
          <p className="revision-edit-meta">
            {store.car.marca} {store.car.modelo}
            {store.car.placa && <> · <span className="plate-text">{store.car.placa}</span></>}
            {store.car.owner && <> · {store.car.owner}</>}
          </p>
        </div>

       
        <div className="details-card">
          <div className="details-card-title">
            <div className="icon-box-muted"><DocIcon /></div>
            <h3>Detalles del Servicio</h3>
          </div>

          <label className="form-label">Motivo de la Visita *</label>
          <input className="form-control" type="text" value={revision.razon}
            onChange={(event) => setRevision({ ...revision, razon: event.target.value })} />
          <label className="form-label">Observaciones *</label>
          <textarea
            className="form-control"
            rows={2}
            placeholder="Describe cualquier observación relevante..."
            value={observacion}
            onChange={(event) => setObservacion(event.target.value)}
            style={{ resize: 'vertical' }}
          />
          <button className="btn btn-secondary btn-sm" style={{ marginTop: 6 }} onClick={agregarObservacion} disabled={!observacion.trim()}>
            Agregar observación
          </button>

          {store.observaciones && store.observaciones.length > 0 && (
            <div style={{ marginTop: 12 }}>
              {store.observaciones.slice().sort((a, b) => b.id - a.id).map((obs) => (
                <div key={obs.id} className="revision-item" style={{ marginBottom: 8 }}>
                  <p className="revision-reason">{obs.observacion}</p>
                  <p className="revision-date">{obs.fecha} · {obs.hora}</p>
                </div>
              ))}
            </div>
          )}

          {revision.estatus === 'Terminado' && (
            <>
              <label className="form-label">Trabajo Realizado *</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Describe el trabajo realizado..."
                value={revision.trabajo}
                onChange={(event) => setRevision({ ...revision, trabajo: event.target.value })}
                style={{ resize: 'vertical' }}
              />
            </>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
            <span className="char-count">{(revision.trabajo || '').length} caracteres</span>
          </div>
          <div className="status-card">
                    <div className="status-card-title">
                      <div className="icon-box-muted"><TagIcon /></div>
                      <h3>Modificar Estado</h3>
                    </div>
                    <div className="status-grid">
                      {STATUS_OPTIONS.map((opt) => (
                        <div
                          key={opt.value}
                          className={`status-option ${revision.estatus === opt.value ? opt.activeClass : opt.baseClass}`}
                          onClick={() => setRevision({ ...revision, estatus: opt.value })}
                        >
                          <span>{opt.icon}</span>
                          <span>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

          <div className="details-card-footer">
            <button className="btn btn-primary" onClick={() => editarYRedireccionar()}>
              Guardar cambios
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Revision

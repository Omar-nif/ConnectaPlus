import React from 'react'

// ====== Modal ======
// - Por defecto NO cierra al hacer click fuera (para evitar cierres al escribir)
// - Puedes habilitar el cierre por backdrop con closeOnBackdrop
// - Puedes ocultar/transparentar el fondo oscuro con showBackdrop/backdropOpacity
export default function Modal({
  open,
  title,
  children,
  onClose,
  actions,
  closeOnBackdrop = false,
  showBackdrop = true,
  backdropOpacity = 0.4,
}) {
  if (!open) return null

  return (
    <div className="modal-portal" style={{ position: 'fixed', inset: 0, zIndex: 1000 }}>
      {/* Fondo (opcional) */}
      <div
        className="modal-backdrop"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,1)',
          opacity: showBackdrop ? backdropOpacity : 0,
          transition: 'opacity .2s',
          zIndex: 1000,
          // Si no queremos cerrar con backdrop, bloquea eventos para que no interfiera
          pointerEvents: closeOnBackdrop ? 'auto' : 'none',
        }}
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Contenedor modal */}
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          zIndex: 1001, // Asegura estar por encima del backdrop
          margin: '10dvh auto',
          maxWidth: 560,
          width: '90%',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 10px 30px rgba(0,0,0,.15)',
        }}
      >
        {/* Encabezado */}
        <div className="modal-head" style={{ padding: '16px 20px', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h3 style={{ margin: 0, fontSize: 18 }}>{title}</h3>
          <button className="btn-close" onClick={onClose} aria-label="Cerrar" />
        </div>

        {/* Cuerpo */}
        <div className="modal-body" style={{ padding: 20 }}>{children}</div>

        {/* Acciones (opcional) */}
        {actions && <div className="modal-foot" style={{ padding: 16, borderTop: '1px solid #eee', display: 'flex', gap: 12, justifyContent: 'flex-end' }}>{actions}</div>}
      </div>
    </div>
  )
}

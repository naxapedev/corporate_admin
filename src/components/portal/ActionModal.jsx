import { useEffect, useRef } from 'react'

export default function ActionModal({ open, title, description, onClose, children }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    if (!open) return undefined
    const previous = document.activeElement
    dialogRef.current?.querySelector('input, select, button')?.focus()
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab') return
      const focusable = [...dialogRef.current.querySelectorAll('button, input, select, [tabindex]:not([tabindex="-1"])')].filter((element) => !element.disabled)
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => { document.removeEventListener('keydown', handleKeyDown); previous?.focus?.() }
  }, [open, onClose])
  if (!open) return null
  return <div className="modal-backdrop" onMouseDown={onClose}>
    <section ref={dialogRef} className="edit-dialog action-dialog" role="dialog" aria-modal="true" aria-labelledby="action-dialog-title" aria-describedby="action-dialog-description" onMouseDown={(event) => event.stopPropagation()}>
      <div className="dialog-heading"><div><p className="eyebrow">Workspace action</p><h2 id="action-dialog-title">{title}</h2><p id="action-dialog-description">{description}</p></div><button type="button" className="dialog-close" aria-label="Close dialog" onClick={onClose}>×</button></div>
      {children}
    </section>
  </div>
}

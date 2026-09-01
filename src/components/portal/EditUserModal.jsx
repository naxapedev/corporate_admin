import { useEffect, useRef } from 'react'
import Field from '../Field.jsx'
import { DepartmentPicker } from './DepartmentControls.jsx'

export default function EditUserModal({ value, loading, onChange, onClose, onSubmit }) {
  const dialogRef = useRef(null)
  useEffect(() => {
    const previous = document.activeElement
    dialogRef.current?.querySelector('input')?.focus()
    const escape = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', escape)
    return () => { document.removeEventListener('keydown', escape); previous?.focus?.() }
  }, [onClose])
  const toggle = (id) => onChange({ ...value, departmentIds: value.departmentIds.includes(id) ? value.departmentIds.filter((item) => item !== id) : [...value.departmentIds, id] })
  return <div className="modal-backdrop" onMouseDown={onClose}><section ref={dialogRef} className="edit-dialog" role="dialog" aria-modal="true" aria-labelledby="edit-user-title" onMouseDown={(event) => event.stopPropagation()}>
    <div className="dialog-heading"><div><p className="eyebrow">Team member</p><h2 id="edit-user-title">Edit {value.role}</h2><p>Update the display name and department access.</p></div><button type="button" className="dialog-close" aria-label="Close edit dialog" onClick={onClose}>×</button></div>
    <form className="stacked-form" onSubmit={onSubmit}><Field label="Full name" minLength="2" required value={value.username} onChange={(event) => onChange({ ...value, username: event.target.value })} /><DepartmentPicker departments={value.availableDepartments} selectedIds={value.departmentIds} onToggle={toggle} disabled={value.role === 'employee' && value.availableDepartments.length === 1} /><div className="dialog-actions"><button type="button" className="button-secondary" onClick={onClose}>Cancel</button><button className="primary" disabled={loading}>{loading ? 'Saving…' : 'Save changes'}</button></div></form>
  </section></div>
}

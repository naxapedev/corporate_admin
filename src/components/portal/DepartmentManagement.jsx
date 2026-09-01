import { useState } from 'react'
import Field from '../Field.jsx'
import '../../styles/department-management.css'

export default function DepartmentManagement({ departments, value, onChange, onCreate, onUpdate, onDelete, loading, updatingId }) {
  const [editing, setEditing] = useState(null)
  const submitEdit = async (event) => {
    event.preventDefault()
    try { await onUpdate(editing.id, editing.name); setEditing(null) } catch { /* Page feedback shows the error. */ }
  }
  const remove = async (department) => {
    if (!window.confirm(`Delete the ${department.name} department? This is only possible when nobody is assigned to it.`)) return
    try { await onDelete(department.id) } catch { /* Page feedback shows the error. */ }
  }
  return <section className="management-card department-card">
    <div className="card-heading"><h2>Departments</h2><p>Create, rename, or remove workspace departments.</p></div>
    <form className="inline-create-form" onSubmit={onCreate}><Field label="New department" minLength="2" required value={value} onChange={(event) => onChange(event.target.value)} /><button className="primary" disabled={loading}>{loading ? 'Adding…' : 'Add'}</button></form>
    <div className="department-directory">
      {departments.map((department) => editing?.id === department.id ? <form className="department-edit-row" key={department.id} onSubmit={submitEdit}><label><span className="sr-only">Department name</span><input autoFocus minLength="2" required value={editing.name} onChange={(event) => setEditing({ ...editing, name: event.target.value })} /></label><button className="button-restore" disabled={updatingId === department.id}>Save</button><button type="button" className="button-secondary" onClick={() => setEditing(null)}>Cancel</button></form> : <div className="department-row" key={department.id}><span>{department.name}</span><div><button type="button" className="button-secondary" onClick={() => setEditing({ id: department.id, name: department.name })}>Rename</button><button type="button" className="button-danger" disabled={updatingId === department.id} onClick={() => remove(department)}>{updatingId === department.id ? 'Deleting…' : 'Delete'}</button></div></div>)}
      {!departments.length && <p className="department-empty">No departments created yet.</p>}
    </div>
  </section>
}

import Field from '../Field.jsx'
import { DepartmentPicker } from './DepartmentControls.jsx'

export default function UserForm({ title, description, submitLabel, value, onChange, onSubmit, departments, managers = [], showManager = false, loading = false, automaticDepartment }) {
  const update = (key, nextValue) => onChange({ ...value, [key]: nextValue })
  const toggleDepartment = (id) => update('departmentIds', value.departmentIds.includes(id) ? value.departmentIds.filter((item) => item !== id) : [...value.departmentIds, id])
  return <section className="management-card">
    <div className="card-heading"><h2>{title}</h2><p>{description}</p></div>
    <form className="stacked-form" onSubmit={onSubmit}>
      {showManager && <label className="field"><span>Manager</span><select required value={value.managerId} onChange={(event) => onChange({ ...value, managerId: event.target.value, departmentIds: [] })}><option value="">Select a manager</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.username}</option>)}</select></label>}
      <Field label="Full name" autoComplete="name" minLength="2" required value={value.username} onChange={(event) => update('username', event.target.value)} />
      <Field label="Email address" type="email" autoComplete="email" required value={value.email} onChange={(event) => update('email', event.target.value)} />
      <Field label="Temporary password" type="password" autoComplete="new-password" minLength="8" required value={value.password} onChange={(event) => update('password', event.target.value)} />
      {automaticDepartment ? <div className="assignment-note"><strong>Automatic assignment</strong><span>{automaticDepartment}</span></div> : departments.length > 0 && <DepartmentPicker departments={departments} selectedIds={value.departmentIds} onToggle={toggleDepartment} />}
      <button className="primary form-submit" disabled={loading}>{loading ? 'Saving…' : submitLabel}</button>
    </form>
  </section>
}

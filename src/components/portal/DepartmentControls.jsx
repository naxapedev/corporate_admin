export function DepartmentTags({ departments, emptyText = 'No departments assigned' }) {
  if (!departments?.length) return <span className="text-muted">{emptyText}</span>
  return <div className="tag-list">{departments.map((department) => <span className="tag" key={department.id}>{department.name}</span>)}</div>
}

export function DepartmentPicker({ departments, selectedIds, onToggle, disabled = false, legend = 'Departments' }) {
  if (!departments.length) return <p className="form-help">No departments available.</p>
  return <fieldset className="checkbox-group" disabled={disabled}>
    <legend>{legend}</legend>
    <div className="checkbox-grid">{departments.map((department) => <label className="checkbox-card" key={department.id}>
      <input type="checkbox" checked={selectedIds.includes(department.id)} onChange={() => onToggle(department.id)} />
      <span>{department.name}</span>
    </label>)}</div>
  </fieldset>
}

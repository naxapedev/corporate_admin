import { DepartmentTags } from './DepartmentControls.jsx'

export default function TeamTable({ title, members, loading, updatingId, onEdit, onChangeStatus, onDeletePermanently }) {
  return <section className="data-card">
    <div className="card-heading table-heading"><div><h2>{title}</h2><p>{members.length} team member{members.length === 1 ? '' : 's'}</p></div></div>
    {loading ? <div className="loading-state" role="status">Loading team members…</div> : <div className="table-scroll"><table><thead><tr><th scope="col">Team member</th><th scope="col">Role</th><th scope="col">Reports to</th><th scope="col">Departments</th><th scope="col">Status</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead><tbody>
      {members.map((member) => <tr key={member.id} className={member.isDeleted ? 'is-disabled' : undefined}>
        <td><div className="member-cell"><span className="member-avatar" aria-hidden="true">{member.username.slice(0, 1).toUpperCase()}</span><div><strong>{member.username}</strong><small>{member.email}</small></div></div></td>
        <td><span className={`role-badge ${member.role}`}>{member.role}</span></td>
        <td>{member.manager?.username ?? <span className="text-muted">Not applicable</span>}</td>
        <td><DepartmentTags departments={member.departments} /></td>
        <td><span className={`status-badge ${member.isDeleted ? 'disabled' : 'active'}`}><i aria-hidden="true" />{member.isDeleted ? 'Disabled' : 'Active'}</span></td>
        <td><div className="table-actions">
          <button type="button" className="button-secondary" onClick={() => onEdit(member)}>Edit</button>
          {member.isDeleted ? <>
            <button type="button" className="button-restore" disabled={updatingId === member.id} onClick={() => onChangeStatus(member)}>{updatingId === member.id ? 'Updating…' : 'Restore'}</button>
            <button type="button" className="button-danger permanent" disabled={updatingId === member.id} onClick={() => onDeletePermanently(member)}>Delete permanently</button>
          </> : <button type="button" className="button-danger" disabled={updatingId === member.id} onClick={() => onChangeStatus(member)}>{updatingId === member.id ? 'Updating…' : 'Disable'}</button>}
        </div></td>
      </tr>)}
      {!members.length && <tr><td colSpan="6"><div className="empty-state"><strong>No team members found</strong><span>Choose another department or add a new team member.</span></div></td></tr>}
    </tbody></table></div>}
  </section>
}

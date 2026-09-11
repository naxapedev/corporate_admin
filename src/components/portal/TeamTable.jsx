import { DepartmentTags } from './DepartmentControls.jsx'

export default function TeamTable({ title, members, loading, updatingId, pagination, onPageChange, onEdit, onChangeStatus, onChangeActiveStatus, onDeletePermanently }) {
  const page = pagination?.page ?? 1
  const totalPages = pagination?.totalPages ?? 1
  const total = pagination?.total ?? members.length

  return <section className="data-card">
    <div className="card-heading table-heading"><div><h2>{title}</h2><p>{total} team member{total === 1 ? '' : 's'}</p></div></div>
    {loading ? <div className="loading-state" role="status">Loading team members...</div> : <div className="table-scroll"><table><thead><tr><th scope="col">Team member</th><th scope="col">Role</th><th scope="col">Reports to</th><th scope="col">Departments</th><th scope="col">Login status</th><th scope="col">Delete status</th><th scope="col" className="actions-heading">Actions</th></tr></thead><tbody>
      {members.map((member) => <tr key={member.id} className={member.isDeleted ? 'is-disabled' : undefined}>
        <td><div className="member-cell"><span className="member-avatar" aria-hidden="true">{member.username.slice(0, 1).toUpperCase()}</span><div><strong>{member.username}</strong><small>{member.email}</small></div></div></td>
        <td><span className={`role-badge ${member.role}`}>{member.role}</span></td>
        <td>{member.manager?.username ?? <span className="text-muted">Not applicable</span>}</td>
        <td><DepartmentTags departments={member.departments} /></td>
        <td><span className={`status-badge ${member.isActive ? 'active' : 'disabled'}`}><i aria-hidden="true" />{member.isActive ? 'Active' : 'Inactive'}</span></td>
        <td><span className={`delete-badge ${member.isDeleted ? 'deleted' : 'kept'}`}>{member.isDeleted ? 'Deleted' : 'Not deleted'}</span></td>
        <td><div className="table-actions">
          {onEdit && <button type="button" className="button-secondary" onClick={() => onEdit(member)}>Edit</button>}
          {!member.isDeleted && onChangeActiveStatus && <button type="button" className={member.isActive ? 'button-secondary' : 'button-restore'} disabled={updatingId === member.id} onClick={() => onChangeActiveStatus(member)}>{updatingId === member.id ? 'Updating...' : member.isActive ? 'Make inactive' : 'Make active'}</button>}
          {member.isDeleted ? <>
            <button type="button" className="button-restore" disabled={updatingId === member.id} onClick={() => onChangeStatus(member)}>{updatingId === member.id ? 'Updating...' : 'Restore'}</button>
            {onDeletePermanently && <button type="button" className="button-danger permanent" disabled={updatingId === member.id} onClick={() => onDeletePermanently(member)}>Delete permanently</button>}
          </> : <button type="button" className="button-danger" disabled={updatingId === member.id} onClick={() => onChangeStatus(member)}>{updatingId === member.id ? 'Updating...' : 'Delete'}</button>}
        </div></td>
      </tr>)}
      {!members.length && <tr><td colSpan="7"><div className="empty-state"><strong>No team members found</strong><span>Choose another department or add a new team member.</span></div></td></tr>}
    </tbody></table>{onPageChange && totalPages > 1 && <div className="pagination-bar"><button type="button" className="button-secondary" disabled={page <= 1 || loading} onClick={() => onPageChange(page - 1)}>Previous</button><span>Page {page} of {totalPages}</span><button type="button" className="button-secondary" disabled={page >= totalPages || loading} onClick={() => onPageChange(page + 1)}>Next</button></div>}</div>}
  </section>
}

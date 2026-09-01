import { DepartmentTags } from './DepartmentControls.jsx'

export default function ProfileDetails({ user }) {
  return <section className="data-card profile-card"><div className="card-heading"><h2>Account details</h2><p>Your portal identity and department access.</p></div><dl><div><dt>Name</dt><dd>{user.username}</dd></div><div><dt>Email</dt><dd>{user.email}</dd></div><div><dt>Role</dt><dd className="capitalize">{user.role}</dd></div><div><dt>Departments</dt><dd><DepartmentTags departments={user.departments} /></dd></div></dl></section>
}

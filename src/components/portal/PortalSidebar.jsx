import { NavLink } from 'react-router-dom'

export default function PortalSidebar({ user, departments, selectedDepartment, onSelectDepartment, onSignOut }) {
  return <aside className="portal-sidebar">
    <div className="portal-brand"><span className="portal-logo" aria-hidden="true">A</span><div><strong>Admin portal</strong><small>Workspace console</small></div></div>
    <nav className="portal-nav" aria-label="Portal navigation">
      <NavLink to="/dashboard">Team overview</NavLink>
      {user.role === 'admin' && <div className="nav-section">
        <p>Departments</p>
        <button type="button" aria-pressed={selectedDepartment === 'all'} className={selectedDepartment === 'all' ? 'active' : ''} onClick={() => onSelectDepartment('all')}>All departments</button>
        {departments.map((department) => <button type="button" aria-pressed={selectedDepartment === department.id} key={department.id} className={selectedDepartment === department.id ? 'active' : ''} onClick={() => onSelectDepartment(department.id)}>{department.name}</button>)}
      </div>}
    </nav>
    <div className="sidebar-account"><span>{user.username.slice(0, 1).toUpperCase()}</span><div><strong>{user.username}</strong><small>{user.role}</small></div></div>
    <button type="button" className="signout-button" onClick={onSignOut}>Sign out</button>
  </aside>
}

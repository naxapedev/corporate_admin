import { NavLink } from 'react-router-dom'

export default function PortalSidebar({ user, onSignOut }) {
  return <aside className="portal-sidebar">
    <div className="portal-brand"><span className="portal-logo" aria-hidden="true">A</span><div><strong>Admin portal</strong><small>Workspace console</small></div></div>
    <nav className="portal-nav" aria-label="Portal navigation">
      <NavLink to="/dashboard">Team overview</NavLink>
      {user.role === 'admin' && <NavLink to="/departments">Departments</NavLink>}
      {user.role === 'admin' && <NavLink to="/deleted-users">Deleted users</NavLink>}
    </nav>
    <div className="sidebar-account"><span>{user.username.slice(0, 1).toUpperCase()}</span><div><strong>{user.username}</strong><small>{user.role}</small></div></div>
    <button type="button" className="signout-button" onClick={onSignOut}>Sign out</button>
  </aside>
}

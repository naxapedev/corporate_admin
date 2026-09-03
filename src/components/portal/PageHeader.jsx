export default function PageHeader({ user, title, description, actions }) {
  return <header className="page-header"><div><p className="eyebrow">Workspace</p><h1>{title}</h1><p>{description}</p></div><div className="header-side"><div className="header-actions">{actions}</div><div className="header-profile"><span>{user.username.slice(0, 1).toUpperCase()}</span><div><strong>{user.username}</strong><small>{user.role}</small></div></div></div></header>
}

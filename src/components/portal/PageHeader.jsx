export default function PageHeader({ title, description, actions }) {
  return <header className="page-header"><div><p className="eyebrow">Workspace</p><h1>{title}</h1><p>{description}</p></div>{actions && <div className="header-side"><div className="header-actions">{actions}</div></div>}</header>
}

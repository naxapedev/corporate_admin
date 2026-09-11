import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import ToastRegion from '../components/portal/ToastRegion.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'

export default function DepartmentsPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const signOut = () => { team.reset(); logout() }

  return <div className="portal-shell">
    <PortalSidebar user={user} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader title="Departments" description="Department management will be added here." />
      <section className="data-card empty-page-card" aria-label="Departments page">
        <div className="empty-state">
          <strong>Departments page</strong>
          <span>This page is ready for the next department workflow.</span>
        </div>
      </section>
      <ToastRegion error={team.error} success={team.success} onDismiss={team.clearStatus} />
    </main>
  </div>
}

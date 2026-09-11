import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import TeamTable from '../components/portal/TeamTable.jsx'
import ToastRegion from '../components/portal/ToastRegion.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'
import '../styles/team-management.css'

export default function DeletedUsersPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (user.role !== 'admin') return undefined
    const state = useTeamStore.getState()
    state.clearStatus()
    state.fetchUsers({ page, limit: state.pagination.limit, deleted: true })
    return state.clearStatus
  }, [page, user.role])

  const restoreUser = async (member) => {
    try { await team.setUserDeleted(member.id, false) } catch { /* Toast renders the store error. */ }
  }
  const dismissToast = useCallback(() => useTeamStore.getState().clearStatus(), [])
  const signOut = () => { team.reset(); logout() }

  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />

  return <div className="portal-shell">
    <PortalSidebar user={user} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader title="Deleted users" description="Restore soft-deleted accounts." />
      <TeamTable title="Deleted users" members={team.users} loading={team.loading} updatingId={team.updatingId} pagination={team.pagination} onPageChange={setPage} onChangeStatus={restoreUser} />
      <ToastRegion error={team.error} success={team.success} onDismiss={dismissToast} />
    </main>
  </div>
}

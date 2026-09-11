import { useCallback, useEffect, useState } from 'react'
import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import DepartmentManagement from '../components/portal/DepartmentManagement.jsx'
import ToastRegion from '../components/portal/ToastRegion.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'
import '../styles/team-management.css'

export default function DepartmentsPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const [departmentName, setDepartmentName] = useState('')

  useEffect(() => {
    const state = useTeamStore.getState()
    state.clearStatus()
    state.fetchDepartments()
    return state.clearStatus
  }, [])

  const submitDepartment = async (event) => {
    event.preventDefault()
    try { await team.createDepartment(departmentName); setDepartmentName('') } catch { /* Toast renders the store error. */ }
  }
  const dismissToast = useCallback(() => useTeamStore.getState().clearStatus(), [])
  const signOut = () => { team.reset(); logout() }

  return <div className="portal-shell">
    <PortalSidebar user={user} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader title="Departments" description="Create, rename, and remove workspace departments." />
      <DepartmentManagement departments={team.departments} value={departmentName} onChange={setDepartmentName} onCreate={submitDepartment} onUpdate={team.updateDepartment} onDelete={team.deleteDepartment} loading={team.creatingDepartment} updatingId={team.updatingId} />
      <ToastRegion error={team.error} success={team.success} onDismiss={dismissToast} />
    </main>
  </div>
}

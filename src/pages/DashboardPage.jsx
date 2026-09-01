import { useCallback, useEffect, useMemo, useState } from 'react'
import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import TeamTable from '../components/portal/TeamTable.jsx'
import UserForm from '../components/portal/UserForm.jsx'
import DepartmentManagement from '../components/portal/DepartmentManagement.jsx'
import EditUserModal from '../components/portal/EditUserModal.jsx'
import ProfileDetails from '../components/portal/ProfileDetails.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'
import '../styles/team-management.css'

const emptyUser = () => ({ username: '', email: '', password: '', departmentIds: [], managerId: '' })

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const [managerForm, setManagerForm] = useState(emptyUser)
  const [employeeForm, setEmployeeForm] = useState(emptyUser)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [editing, setEditing] = useState(null)

  useEffect(() => {
    const state = useTeamStore.getState()
    state.clearStatus()
    if (user.role !== 'employee') { state.fetchUsers(); state.fetchDepartments() }
    return state.clearStatus
  }, [user.role])

  const managers = useMemo(() => team.users.filter((member) => member.role === 'manager'), [team.users])
  const manageableUsers = useMemo(() => team.users.filter((member) => user.role === 'admin' ? member.role !== 'admin' : member.role === 'employee'), [team.users, user.role])
  const visibleUsers = useMemo(() => manageableUsers.filter((member) => departmentFilter === 'all' || member.departments?.some((department) => department.id === departmentFilter)), [manageableUsers, departmentFilter])
  const selectedDepartmentName = team.departments.find((item) => item.id === departmentFilter)?.name
  const employeeDepartments = user.role === 'manager' ? user.departments : managers.find((manager) => manager.id === employeeForm.managerId)?.departments ?? []

  const submitManager = async (event) => {
    event.preventDefault()
    try { await team.createManager(managerForm); setManagerForm(emptyUser()) } catch { /* Store renders errors. */ }
  }
  const submitEmployee = async (event) => {
    event.preventDefault()
    try { await team.createEmployee(employeeForm); setEmployeeForm(emptyUser()) } catch { /* Store renders errors. */ }
  }
  const submitDepartment = async (event) => {
    event.preventDefault()
    try { await team.createDepartment(departmentName); setDepartmentName('') } catch { /* Store renders errors. */ }
  }
  const closeEdit = useCallback(() => setEditing(null), [])
  const saveEdit = async (event) => {
    event.preventDefault()
    try { await team.updateUser(editing.id, { username: editing.username, departmentIds: editing.departmentIds }); closeEdit() } catch { /* Store renders errors. */ }
  }
  const openEdit = (member) => setEditing({
    id: member.id,
    username: member.username,
    role: member.role,
    departmentIds: member.departments.map((department) => department.id),
    availableDepartments: member.role === 'manager' ? team.departments : managers.find((manager) => manager.id === member.createdByManagerId)?.departments ?? user.departments,
  })
  const changeStatus = async (member) => {
    const disabling = !member.isDeleted
    if (disabling && !window.confirm(`Disable ${member.username}? They will no longer be able to sign in.`)) return
    try { await team.setUserDeleted(member.id, disabling) } catch { /* Store renders errors. */ }
  }
  const signOut = () => { team.reset(); logout() }

  return <div className="portal-shell">
    <PortalSidebar user={user} departments={team.departments} selectedDepartment={departmentFilter} onSelectDepartment={setDepartmentFilter} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader user={user} title={user.role === 'employee' ? 'My profile' : 'Team management'} description={user.role === 'admin' ? 'Manage managers, employees, and department access.' : user.role === 'manager' ? 'Manage the employees you have added.' : 'Review your account and department assignments.'} />
      {(team.error || team.success) && <div className={`feedback-banner ${team.error ? 'error' : 'success'}`} role={team.error ? 'alert' : 'status'}>{team.error || team.success}</div>}
      {user.role === 'employee' ? <ProfileDetails user={user} /> : <>
        <TeamTable title={selectedDepartmentName ? `${selectedDepartmentName} department` : 'Managers and employees'} members={visibleUsers} loading={team.loading} updatingId={team.updatingId} onEdit={openEdit} onChangeStatus={changeStatus} />
        <section className="management-section" aria-labelledby="add-team-heading"><div className="section-heading"><p className="eyebrow">Create access</p><h2 id="add-team-heading">Add team members</h2><p>New accounts receive a temporary password and the department access selected below.</p></div><div className={`management-grid ${user.role === 'manager' ? 'manager-only' : ''}`}>
          {user.role === 'admin' && <UserForm title="New manager" description="Assign at least one department." submitLabel="Add manager" value={managerForm} onChange={setManagerForm} onSubmit={submitManager} departments={team.departments} loading={team.creating} />}
          <UserForm title="New employee" description="Employees remain under their selected manager." submitLabel="Add employee" value={employeeForm} onChange={setEmployeeForm} onSubmit={submitEmployee} departments={employeeDepartments.length > 1 ? employeeDepartments : []} managers={managers.filter((manager) => !manager.isDeleted)} showManager={user.role === 'admin'} automaticDepartment={employeeDepartments.length === 1 ? employeeDepartments[0].name : ''} loading={team.creating} />
          {user.role === 'admin' && <DepartmentManagement departments={team.departments} value={departmentName} onChange={setDepartmentName} onCreate={submitDepartment} onUpdate={team.updateDepartment} onDelete={team.deleteDepartment} loading={team.creatingDepartment} updatingId={team.updatingId} />}
        </div></section>
      </>}
      {editing && <EditUserModal value={editing} loading={team.updatingId === editing.id} onChange={setEditing} onClose={closeEdit} onSubmit={saveEdit} />}
    </main>
  </div>
}

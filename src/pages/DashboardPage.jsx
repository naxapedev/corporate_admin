import { useCallback, useEffect, useMemo, useState } from 'react'
import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import TeamTable from '../components/portal/TeamTable.jsx'
import UserForm from '../components/portal/UserForm.jsx'
import DepartmentManagement from '../components/portal/DepartmentManagement.jsx'
import EditUserModal from '../components/portal/EditUserModal.jsx'
import ProfileDetails from '../components/portal/ProfileDetails.jsx'
import ActionModal from '../components/portal/ActionModal.jsx'
import ToastRegion from '../components/portal/ToastRegion.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'
import '../styles/team-management.css'

const emptyManager = () => ({ username: '', email: '', password: '', departmentIds: [] })
const emptyEmployee = () => ({ ...emptyManager(), managerId: '' })

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const [managerForm, setManagerForm] = useState(emptyManager)
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [dialog, setDialog] = useState(null)
  const [editing, setEditing] = useState(null)
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null)

  useEffect(() => {
    const state = useTeamStore.getState()
    state.clearStatus()
    if (user.role !== 'employee') { state.fetchUsers(); state.fetchDepartments() }
    return state.clearStatus
  }, [user.role])

  const managers = useMemo(() => team.users.filter((member) => member.role === 'manager'), [team.users])
  const manageableUsers = useMemo(() => team.users.filter((member) => user.role === 'admin' ? member.role !== 'admin' : member.role === 'employee'), [team.users, user.role])
  const visibleUsers = useMemo(() => manageableUsers.filter((member) => {
    const matchesDepartment = departmentFilter === 'all' || member.departments?.some((department) => department.id === departmentFilter)
    const matchesRole = roleFilter === 'all' || member.role === roleFilter
    return matchesDepartment && matchesRole
  }), [manageableUsers, departmentFilter, roleFilter])
  const counts = useMemo(() => ({
    total: manageableUsers.length,
    employees: manageableUsers.filter((member) => member.role === 'employee').length,
    managers: manageableUsers.filter((member) => member.role === 'manager').length,
    active: manageableUsers.filter((member) => !member.isDeleted).length,
  }), [manageableUsers])
  const selectedDepartmentName = team.departments.find((item) => item.id === departmentFilter)?.name
  const employeeDepartments = user.role === 'manager' ? user.departments : managers.find((manager) => manager.id === employeeForm.managerId)?.departments ?? []

  const submitManager = async (event) => {
    event.preventDefault()
    try { await team.createManager(managerForm); setManagerForm(emptyManager()); setDialog(null) } catch { /* Toast renders the store error. */ }
  }
  const submitEmployee = async (event) => {
    event.preventDefault()
    try { await team.createEmployee(employeeForm); setEmployeeForm(emptyEmployee()); setDialog(null) } catch { /* Toast renders the store error. */ }
  }
  const submitDepartment = async (event) => {
    event.preventDefault()
    try { await team.createDepartment(departmentName); setDepartmentName('') } catch { /* Toast renders the store error. */ }
  }
  const closeEdit = useCallback(() => setEditing(null), [])
  const dismissToast = useCallback(() => useTeamStore.getState().clearStatus(), [])
  const saveEdit = async (event) => {
    event.preventDefault()
    try { await team.updateUser(editing.id, { username: editing.username, departmentIds: editing.departmentIds }); closeEdit() } catch { /* Toast renders the store error. */ }
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
    try { await team.setUserDeleted(member.id, disabling) } catch { /* Toast renders the store error. */ }
  }
  const permanentlyDelete = async () => {
    if (!permanentDeleteTarget || team.updatingId) return
    try {
      await team.permanentlyDeleteUser(permanentDeleteTarget.id)
      setPermanentDeleteTarget(null)
    } catch { /* Toast renders the store error and the dialog stays open. */ }
  }
  const signOut = () => { team.reset(); logout() }
  const closeDialog = useCallback(() => setDialog(null), [])

  const headerActions = user.role === 'employee' ? null : <>
    {user.role === 'admin' && <button type="button" className="header-action secondary" onClick={() => setDialog('departments')}>Departments</button>}
    {user.role === 'admin' && <button type="button" className="header-action secondary" onClick={() => setDialog('manager')}>Add manager</button>}
    <button type="button" className="header-action primary-action" onClick={() => setDialog('employee')}>Add employee</button>
  </>

  return <div className="portal-shell">
    <PortalSidebar user={user} departments={team.departments} selectedDepartment={departmentFilter} onSelectDepartment={setDepartmentFilter} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader user={user} actions={headerActions} title={user.role === 'employee' ? 'My profile' : user.role === 'manager' ? 'My team' : 'Team management'} description={user.role === 'admin' ? 'Manage managers, employees, and department access.' : user.role === 'manager' ? 'Manage your employees and their department assignments.' : 'Review your account and department assignments.'} />
      {user.role === 'employee' ? <ProfileDetails user={user} /> : <>
        <section className="team-summary" aria-label="Team filters">
          <div className="summary-stats">
            <FilterStat label={user.role === 'manager' ? 'Employees' : 'Total members'} value={counts.total} selected={roleFilter === 'all'} onClick={() => setRoleFilter('all')} />
            {user.role === 'admin' ? <>
              <FilterStat label="Employees" value={counts.employees} selected={roleFilter === 'employee'} onClick={() => setRoleFilter('employee')} />
              <FilterStat label="Managers" value={counts.managers} selected={roleFilter === 'manager'} onClick={() => setRoleFilter('manager')} />
            </> : <FilterStat label="Active" value={counts.active} selected={false} />}
          </div>
          <div className="department-filter" role="group" aria-label="Filter by department">
            <button type="button" className={departmentFilter === 'all' ? 'active' : ''} aria-pressed={departmentFilter === 'all'} onClick={() => setDepartmentFilter('all')}>All departments</button>
            {team.departments.map((department) => <button type="button" key={department.id} className={departmentFilter === department.id ? 'active' : ''} aria-pressed={departmentFilter === department.id} onClick={() => setDepartmentFilter(department.id)}>{department.name}</button>)}
          </div>
        </section>
        <TeamTable title={selectedDepartmentName ? `${selectedDepartmentName} ${roleFilter === 'all' ? 'team' : `${roleFilter}s`}` : roleFilter === 'all' ? user.role === 'manager' ? 'My employees' : 'Managers and employees' : `${roleFilter.charAt(0).toUpperCase()}${roleFilter.slice(1)}s`} members={visibleUsers} loading={team.loading} updatingId={team.updatingId} onEdit={openEdit} onChangeStatus={changeStatus} onDeletePermanently={setPermanentDeleteTarget} />
      </>}

      <ActionModal open={dialog === 'manager'} title="Add manager" description="Create manager access and assign at least one department." onClose={closeDialog}>
        <UserForm title="New manager" description="Assign at least one department." submitLabel="Add manager" value={managerForm} onChange={setManagerForm} onSubmit={submitManager} departments={team.departments} loading={team.creating} />
      </ActionModal>
      <ActionModal open={dialog === 'employee'} title="Add employee" description={user.role === 'manager' ? 'This employee will report to you.' : 'Choose the employee’s manager and department access.'} onClose={closeDialog}>
        <UserForm title="New employee" description="Employees remain under their selected manager." submitLabel="Add employee" value={employeeForm} onChange={setEmployeeForm} onSubmit={submitEmployee} departments={employeeDepartments.length > 1 ? employeeDepartments : []} managers={managers.filter((manager) => !manager.isDeleted)} showManager={user.role === 'admin'} automaticDepartment={employeeDepartments.length === 1 ? employeeDepartments[0].name : ''} loading={team.creating} />
      </ActionModal>
      <ActionModal open={dialog === 'departments'} title="Departments" description="Create, rename, and organize workspace departments." onClose={closeDialog}>
        <DepartmentManagement departments={team.departments} value={departmentName} onChange={setDepartmentName} onCreate={submitDepartment} onUpdate={team.updateDepartment} onDelete={team.deleteDepartment} loading={team.creatingDepartment} updatingId={team.updatingId} />
      </ActionModal>
      {editing && <EditUserModal value={editing} loading={team.updatingId === editing.id} onChange={setEditing} onClose={closeEdit} onSubmit={saveEdit} />}
      <ActionModal open={Boolean(permanentDeleteTarget)} title="Delete user permanently?" description="This irreversible action removes the portal account and all linked chat data from PostgreSQL." onClose={() => !team.updatingId && setPermanentDeleteTarget(null)}>
        <div className="permanent-delete-content">
          <div className="danger-summary"><strong>{permanentDeleteTarget?.username}</strong><span>{permanentDeleteTarget?.email}</span></div>
          <p>Direct conversations, messages, friend links, and group membership belonging to this user will be deleted. This cannot be undone.</p>
          <div className="dialog-actions"><button type="button" className="button-secondary" disabled={Boolean(team.updatingId)} onClick={() => setPermanentDeleteTarget(null)}>Cancel</button><button type="button" className="button-danger permanent-confirm" disabled={Boolean(team.updatingId)} onClick={permanentlyDelete}>{team.updatingId ? 'Deleting…' : 'Delete permanently'}</button></div>
        </div>
      </ActionModal>
      <ToastRegion error={team.error} success={team.success} onDismiss={dismissToast} />
    </main>
  </div>
}

function FilterStat({ label, value, selected = false, onClick }) {
  const content = <><span>{value}</span><small>{label}</small></>
  return onClick ? <button type="button" className={`summary-stat ${selected ? 'active' : ''}`} aria-pressed={selected} onClick={onClick}>{content}</button> : <div className="summary-stat static">{content}</div>
}

import { useCallback, useEffect, useMemo, useState } from 'react'
import PortalSidebar from '../components/portal/PortalSidebar.jsx'
import PageHeader from '../components/portal/PageHeader.jsx'
import TeamTable from '../components/portal/TeamTable.jsx'
import UserForm from '../components/portal/UserForm.jsx'
import EditUserModal from '../components/portal/EditUserModal.jsx'
import ProfileDetails from '../components/portal/ProfileDetails.jsx'
import ActionModal from '../components/portal/ActionModal.jsx'
import ToastRegion from '../components/portal/ToastRegion.jsx'
import { useAuthStore } from '../stores/authStore.js'
import { useTeamStore } from '../stores/teamStore.js'
import '../styles/team-management.css'

const emptyManager = () => ({ username: '', email: '', password: '', departmentIds: [] })
const emptyAdmin = () => ({ username: '', email: '', password: '' })
const emptyEmployee = () => ({ ...emptyManager(), managerId: '' })

export default function DashboardPage() {
  const { user, logout } = useAuthStore()
  const team = useTeamStore()
  const [managerForm, setManagerForm] = useState(emptyManager)
  const [adminForm, setAdminForm] = useState(emptyAdmin)
  const [employeeForm, setEmployeeForm] = useState(emptyEmployee)
  const [departmentFilter, setDepartmentFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [dialog, setDialog] = useState(null)
  const [editing, setEditing] = useState(null)
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null)

  useEffect(() => {
    const state = useTeamStore.getState()
    state.clearStatus()
    if (user.role !== 'employee') { state.fetchDepartments(); state.fetchManagerOptions() }
    return state.clearStatus
  }, [user.role])

  useEffect(() => {
    if (user.role === 'employee') return
    useTeamStore.getState().fetchUsers({
      page,
      limit: team.pagination.limit,
      deleted: false,
      role: roleFilter === 'all' ? undefined : roleFilter,
      departmentId: departmentFilter === 'all' ? undefined : departmentFilter,
    })
  }, [departmentFilter, page, roleFilter, team.pagination.limit, user.role])

  useEffect(() => {
    setPage(1)
  }, [departmentFilter, roleFilter])

  const managers = team.managerOptions
  const counts = team.totals
  const selectedDepartmentName = team.departments.find((item) => item.id === departmentFilter)?.name
  const employeeDepartments = user.role === 'manager' ? user.departments : managers.find((manager) => manager.id === employeeForm.managerId)?.departments ?? []

  const submitManager = async (event) => {
    event.preventDefault()
    try { await team.createManager(managerForm); setManagerForm(emptyManager()); setDialog(null) } catch { /* Toast renders the store error. */ }
  }
  const submitAdmin = async (event) => {
    event.preventDefault()
    try { await team.createAdmin(adminForm); setAdminForm(emptyAdmin()); setDialog(null) } catch { /* Toast renders the store error. */ }
  }
  const submitEmployee = async (event) => {
    event.preventDefault()
    try { await team.createEmployee(employeeForm); setEmployeeForm(emptyEmployee()); setDialog(null) } catch { /* Toast renders the store error. */ }
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
    const deleting = !member.isDeleted
    if (deleting && !window.confirm(`Delete ${member.username}? You can restore this account later, or permanently delete it afterward.`)) return
    try { await team.setUserDeleted(member.id, deleting) } catch { /* Toast renders the store error. */ }
  }
  const changeActiveStatus = async (member) => {
    const activating = !member.isActive
    if (!activating && !window.confirm(`Mark ${member.username} inactive? They will no longer be able to sign in.`)) return
    try { await team.setUserActive(member.id, activating) } catch { /* Toast renders the store error. */ }
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
    {/* {user.role === 'admin' && <button type="button" className="header-action secondary" onClick={() => setDialog('admin')}>Add admin</button>} */}
    {user.role === 'admin' && <button type="button" className="header-action secondary" onClick={() => setDialog('manager')}>Add manager</button>}
    <button type="button" className="header-action primary-action" onClick={() => setDialog('employee')}>Add employee</button>
  </>

  return <div className="portal-shell">
    <PortalSidebar user={user} onSignOut={signOut} />
    <main className="portal-main" id="main-content">
      <PageHeader actions={headerActions} title={user.role === 'employee' ? 'My profile' : user.role === 'manager' ? 'My team' : 'Team management'} description={user.role === 'admin' ? 'Manage managers, employees, and department access.' : user.role === 'manager' ? 'Manage your employees and their department assignments.' : 'Review your account and department assignments.'} />
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
        <TeamTable title={selectedDepartmentName ? `${selectedDepartmentName} ${roleFilter === 'all' ? 'team' : `${roleFilter}s`}` : roleFilter === 'all' ? user.role === 'manager' ? 'My employees' : 'Managers and employees' : `${roleFilter.charAt(0).toUpperCase()}${roleFilter.slice(1)}s`} members={team.users} loading={team.loading} updatingId={team.updatingId} pagination={team.pagination} onPageChange={setPage} onEdit={openEdit} onChangeStatus={changeStatus} onChangeActiveStatus={changeActiveStatus} onDeletePermanently={setPermanentDeleteTarget} />
      </>}

      <ActionModal open={dialog === 'manager'} title="Add manager" description="Create manager access and assign at least one department." onClose={closeDialog}>
        <UserForm title="New manager" description="Assign at least one department." submitLabel="Add manager" value={managerForm} onChange={setManagerForm} onSubmit={submitManager} departments={team.departments} loading={team.creating} />
      </ActionModal>
      <ActionModal open={dialog === 'admin'} title="Add administrator" description="Create another account with full workspace administration access." onClose={closeDialog}>
        <UserForm title="New administrator" description="This account will have full portal access." submitLabel="Add administrator" value={adminForm} onChange={setAdminForm} onSubmit={submitAdmin} departments={[]} loading={team.creating} />
      </ActionModal>
      <ActionModal open={dialog === 'employee'} title="Add employee" description={user.role === 'manager' ? 'This employee will report to you.' : 'Choose the employee’s manager and department access.'} onClose={closeDialog}>
        <UserForm title="New employee" description="Employees remain under their selected manager." submitLabel="Add employee" value={employeeForm} onChange={setEmployeeForm} onSubmit={submitEmployee} departments={employeeDepartments.length > 1 ? employeeDepartments : []} managers={managers.filter((manager) => !manager.isDeleted)} showManager={user.role === 'admin'} automaticDepartment={employeeDepartments.length === 1 ? employeeDepartments[0].name : ''} loading={team.creating} />
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

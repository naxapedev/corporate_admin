import { create } from 'zustand'
import { portalApi } from '../api/portalApi.js'

export const useTeamStore = create((set, get) => ({
  users: [], departments: [], loading: false, creating: false, creatingDepartment: false, updatingId: null, error: '', success: '',
  fetchUsers: async () => {
    set({ loading: true, error: '' })
    try {
      const users = await portalApi.getUsers()
      set({ users, loading: false })
    } catch (error) {
      set({ loading: false, error: error.message })
    }
  },
  fetchDepartments: async () => {
    try {
      const departments = await portalApi.getDepartments()
      set({ departments })
    } catch (error) {
      set({ error: error.message })
    }
  },
  createManager: async (manager) => {
    set({ creating: true, error: '', success: '' })
    try {
      const result = await portalApi.createManager(manager)
      set({ creating: false, success: `${result.user.username} was added as a manager.` })
      await get().fetchUsers()
      return result.user
    } catch (error) {
      set({ creating: false, error: error.message })
      throw error
    }
  },
  createEmployee: async (employee) => {
    set({ creating: true, error: '', success: '' })
    try {
      const result = await portalApi.createEmployee(employee)
      set({ creating: false, success: `${result.user.username} was added as an employee.` })
      await get().fetchUsers()
      return result.user
    } catch (error) {
      set({ creating: false, error: error.message })
      throw error
    }
  },
  updateUser: async (userId, changes) => {
    set({ updatingId: userId, error: '', success: '' })
    try {
      const result = await portalApi.updateUser(userId, changes)
      set((state) => ({
        users: state.users.map((user) => user.id === userId ? result.user : user),
        updatingId: null,
        success: `${result.user.username} was updated.`,
      }))
      return result.user
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  setUserDeleted: async (userId, isDeleted) => {
    set({ updatingId: userId, error: '', success: '' })
    try {
      const result = await portalApi.setUserDeleted(userId, isDeleted)
      set((state) => ({
        users: state.users.map((user) => user.id === userId ? result.user : user),
        updatingId: null,
        success: `${result.user.username} was ${isDeleted ? 'deleted' : 'restored'}.`,
      }))
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  setManagerDeleted: async (managerId, isDeleted) => {
    set({ updatingId: managerId, error: '', success: '' })
    try {
      const result = await portalApi.setManagerDeleted(managerId, isDeleted)
      set((state) => ({
        users: state.users.map((user) => user.id === managerId ? result.user : user),
        updatingId: null,
        success: `${result.user.username} was ${isDeleted ? 'deleted' : 'restored'}.`,
      }))
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  permanentlyDeleteUser: async (userId) => {
    set({ updatingId: userId, error: '', success: '' })
    const target = get().users.find((user) => user.id === userId)
    try {
      await portalApi.permanentlyDeleteUser(userId)
      set((state) => ({
        users: state.users.filter((user) => user.id !== userId),
        updatingId: null,
        success: `${target?.username ?? 'User'} and their chat data were permanently deleted.`,
      }))
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  createDepartment: async (name) => {
    set({ creatingDepartment: true, error: '', success: '' })
    try {
      const department = await portalApi.createDepartment(name)
      set((state) => ({
        departments: [...state.departments, department].sort((a, b) => a.name.localeCompare(b.name)),
        creatingDepartment: false,
        success: `${department.name} department was created.`,
      }))
      return department
    } catch (error) {
      set({ creatingDepartment: false, error: error.message })
      throw error
    }
  },
  updateDepartment: async (departmentId, name) => {
    set({ updatingId: departmentId, error: '', success: '' })
    try {
      const department = await portalApi.updateDepartment(departmentId, name)
      set((state) => ({
        departments: state.departments.map((item) => item.id === departmentId ? department : item).sort((a, b) => a.name.localeCompare(b.name)),
        users: state.users.map((user) => ({ ...user, departments: user.departments.map((item) => item.id === departmentId ? department : item) })),
        updatingId: null,
        success: `${department.name} was updated.`,
      }))
      return department
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  deleteDepartment: async (departmentId) => {
    set({ updatingId: departmentId, error: '', success: '' })
    try {
      const department = get().departments.find((item) => item.id === departmentId)
      await portalApi.deleteDepartment(departmentId)
      set((state) => ({
        departments: state.departments.filter((item) => item.id !== departmentId),
        updatingId: null,
        success: `${department?.name ?? 'Department'} was deleted.`,
      }))
    } catch (error) {
      set({ updatingId: null, error: error.message })
      throw error
    }
  },
  clearStatus: () => set({ error: '', success: '' }),
  reset: () => set({ users: [], departments: [], loading: false, creating: false, creatingDepartment: false, updatingId: null, error: '', success: '' }),
}))

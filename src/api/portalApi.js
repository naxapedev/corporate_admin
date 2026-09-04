import { apiRequest } from './client.js'
import { endpoints } from './endpoints.js'

export const portalApi = {
  getUsers: () => apiRequest(endpoints.portal.users),
  createAdmin: (admin) => apiRequest(endpoints.portal.admins, {
    method: 'POST',
    body: JSON.stringify(admin),
  }),
  createManager: (manager) => apiRequest(endpoints.portal.managers, {
    method: 'POST',
    body: JSON.stringify(manager),
  }),
  createEmployee: (employee) => apiRequest(endpoints.portal.employees, {
    method: 'POST',
    body: JSON.stringify(employee),
  }),
  updateUser: (userId, changes) => apiRequest(endpoints.portal.user(userId), {
    method: 'PATCH',
    body: JSON.stringify(changes),
  }),
  setUserDeleted: (userId, isDeleted) => apiRequest(endpoints.portal.userStatus(userId), {
    method: 'PATCH',
    body: JSON.stringify({ isDeleted }),
  }),
  permanentlyDeleteUser: (userId) => apiRequest(endpoints.portal.permanentUser(userId), {
    method: 'DELETE',
  }),
  setManagerDeleted: (managerId, isDeleted) => apiRequest(
    endpoints.portal.managerStatus(managerId),
    { method: 'PATCH', body: JSON.stringify({ isDeleted }) },
  ),
  getDepartments: () => apiRequest(endpoints.portal.departments),
  createDepartment: (name) => apiRequest(endpoints.portal.departments, {
    method: 'POST',
    body: JSON.stringify({ name }),
  }),
  updateDepartment: (departmentId, name) => apiRequest(endpoints.portal.department(departmentId), {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  }),
  deleteDepartment: (departmentId) => apiRequest(endpoints.portal.department(departmentId), {
    method: 'DELETE',
  }),
}

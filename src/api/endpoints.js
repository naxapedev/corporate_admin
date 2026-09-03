export const endpoints = {
  auth: {
    login: '/portal/auth/login',
    profile: '/portal/profile',
    refresh: '/portal/auth/access-token',
    logout: '/portal/auth/logout',
  },
  portal: {
    users: '/portal/users',
    managers: '/portal/managers',
    employees: '/portal/employees',
    user: (userId) => `/portal/users/${userId}`,
    userStatus: (userId) => `/portal/users/${userId}/status`,
    permanentUser: (userId) => `/portal/users/${userId}/permanent`,
    managerStatus: (managerId) => `/portal/managers/${managerId}/status`,
    departments: '/portal/departments',
    department: (departmentId) => `/portal/departments/${departmentId}`,
  },
}

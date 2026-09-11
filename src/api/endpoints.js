export const endpoints = {
  auth: {
    signup: '/portal/auth/signup',
    setupStatus: '/portal/auth/setup-status',
    login: '/portal/auth/login',
    profile: '/portal/profile',
    refresh: '/portal/auth/access-token',
    logout: '/portal/auth/logout',
  },
  portal: {
    users: '/portal/users',
    admins: '/portal/admins',
    managers: '/portal/managers',
    employees: '/portal/employees',
    user: (userId) => `/portal/users/${userId}`,
    userStatus: (userId) => `/portal/users/${userId}/status`,
    userActive: (userId) => `/portal/users/${userId}/active`,
    permanentUser: (userId) => `/portal/users/${userId}/permanent`,
    managerStatus: (managerId) => `/portal/managers/${managerId}/status`,
    departments: '/portal/departments',
    department: (departmentId) => `/portal/departments/${departmentId}`,
  },
}

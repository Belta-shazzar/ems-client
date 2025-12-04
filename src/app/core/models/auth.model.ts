export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  employeeId: string;
  email: string;
  accessToken: string;
  expiresIn: number;
}

export interface SetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

// export interface User {
//   userId: string;
//   email: string;
//   role: EmployeeRole;
//   accessToken: string;
// }

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;

  status: 'ACTIVE' | 'INACTIVE' | string;
  role: 'EMPLOYEE' | 'MANAGER' | 'ADMIN' | string;

  departmentId: string;
  departmentName: string;

  createdAt: Date;
  updatedAt: Date;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: EmployeeStatus;
  role: EmployeeRole;
  departmentId: string;
  departmentName: string;
  createdAt: string;
  updatedAt: string;
}

export interface EmployeeRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: EmployeeRole;
  departmentId: string;
}

export interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface PaginatedEmployees {
  content: Employee[];
  pagination: Pagination;
}

export interface DashboardData {
  totalEmployees: number;
  activeEmployees: number;
  pendingEmployees: number;
  activeDepartment: number;
}

export enum EmployeeStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

export enum EmployeeRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  EMPLOYEE = 'EMPLOYEE',
}

export interface Department {
  id: string;
  name: string;
  active?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentRequest {
  name: string;
}

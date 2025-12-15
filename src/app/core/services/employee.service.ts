import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  DashboardData,
  Employee,
  EmployeeRequest,
  PaginatedEmployees,
} from '../models/employee.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private http = inject(HttpClient);
  // private authService = inject(AuthService);

  getEmployeesStatData(): Observable<DashboardData> {
    return this.http.get<DashboardData>(
      `${environment.employeeUrl}/employees/dashboard`
    );
  }

  getAllEmployees(params?: any): Observable<PaginatedEmployees> {
    return this.http.get<PaginatedEmployees>(
      `${environment.employeeUrl}/employees`,
      { params }
    );
  }

  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(
      `${environment.employeeUrl}/employees/${id}`
    );
  }

  createEmployee(request: EmployeeRequest): Observable<Employee> {
    return this.http.post<Employee>(
      `${environment.employeeUrl}/employees`,
      request
    );
  }

  updateEmployee(id: string, request: EmployeeRequest): Observable<Employee> {
    return this.http.put<Employee>(
      `${environment.employeeUrl}/employees/${id}`,
      request
    );
  }

  deleteEmployee(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.employeeUrl}/employees/${id}`);
  }
}

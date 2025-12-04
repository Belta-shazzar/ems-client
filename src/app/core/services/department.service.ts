import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Department, DepartmentRequest } from '../models/department.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  private getHeaders(): HttpHeaders {
    const user = this.authService.currentEmployeeValue;
    return new HttpHeaders({
      'X-User-Role': user?.role || '',
    });
  }

  getAllDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(
      `${environment.employeeUrl}/departments`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  getDepartmentById(id: string): Observable<Department> {
    return this.http.get<Department>(
      `${environment.employeeUrl}/departments/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  createDepartment(request: DepartmentRequest): Observable<Department> {
    return this.http.post<Department>(
      `${environment.employeeUrl}/departments`,
      request,
      {
        headers: this.getHeaders(),
      }
    );
  }

  updateDepartment(
    id: string,
    request: DepartmentRequest
  ): Observable<Department> {
    return this.http.put<Department>(
      `${environment.employeeUrl}/departments/${id}`,
      request,
      {
        headers: this.getHeaders(),
      }
    );
  }

  deleteDepartment(id: string): Observable<void> {
    return this.http.delete<void>(
      `${environment.employeeUrl}/departments/${id}`,
      {
        headers: this.getHeaders(),
      }
    );
  }
}

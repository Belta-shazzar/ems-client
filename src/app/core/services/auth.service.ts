import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  Observable,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import {
  ChangePasswordRequest,
  Employee,
  LoginRequest,
  LoginResponse,
} from '../models/auth.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private currentEmployeeSubject = new BehaviorSubject<Employee | null>(
    this.getEmployeeFromStorage()
  );
  public currentEmployee = this.currentEmployeeSubject.asObservable();

  private getEmployeeFromStorage(): Employee | null {
    const employeeStr = localStorage.getItem('currentEmployee');
    return employeeStr ? JSON.parse(employeeStr) : null;
  }

  get currentEmployeeValue(): Employee | null {
    return this.currentEmployeeSubject.value;
  }

  login(request: LoginRequest): Observable<Employee> {
    return this.http
      .post<LoginResponse>(`${environment.authUrl}/auth/login`, request)
      .pipe(
        tap((response) => {
          localStorage.setItem('accessToken', response.accessToken);
        }),
        switchMap((response) => {
          return this.getAuthenticatedEmployee(response.accessToken);
        }),
        tap((employee) => {
          localStorage.setItem('currentEmployee', JSON.stringify(employee));
          this.currentEmployeeSubject.next(employee);
        }),
        catchError((err) => {
          // clean up tokens if anything fails
          localStorage.removeItem('accessToken');
          // rethrow or map to a friendly error
          return throwError(
            () => new Error('Login failed: ' + (err?.message || err))
          );
        })
      );
  }

  getAuthenticatedEmployee(token: string): Observable<Employee> {
    // const headers = new HttpHeaders({
    //   Authorization: `Bearer ${token}`,
    // });

    return this.http.get<Employee>(
      `${environment.employeeUrl}/employees/authenticated`,
      // { headers }
    );
  }

  changePassword(request: ChangePasswordRequest): Observable<any> {
    return this.http.post(
      `${environment.authUrl}/auth/change-password`,
      request
    );
  }

  logout(): void {
    localStorage.removeItem('currentEmployee');
    localStorage.removeItem('accessToken');
    this.currentEmployeeSubject.next(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.currentEmployeeValue;
  }

  hasRole(roles: string[]): boolean {
    const user = this.currentEmployeeValue;
    return user ? roles.includes(user.role) : false;
  }
}

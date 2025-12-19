import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { EmployeeService } from '../../core/services/employee.service';
import { DepartmentService } from '../../core/services/department.service';
import { Employee } from '../../core/models/employee.model';
import { Department } from '../../core/models/department.model';
import {
  LucideAngularModule,
  Users,
  Building2,
  UserPlus,
  FolderPlus,
  TrendingUp,
  Activity,
} from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterLink],
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);
  private departmentService = inject(DepartmentService);

  readonly Users = Users;
  readonly Building2 = Building2;
  readonly UserPlus = UserPlus;
  // readonly FolderPlus = FolderPlus;
  readonly TrendingUp = TrendingUp;
  readonly Activity = Activity;

  currentEmployee = this.authService.currentEmployeeValue;
  employees: Employee[] = [];
  departments: Department[] = [];
  loading = true;

  stats = {
    totalEmployees: 0,
    totalDepartments: 0,
    activeEmployees: 0,
    pendingEmployees: 0,
  };

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;

    this.employeeService.getEmployeesStatData().subscribe({
      next: (data) => {
        // this.employees = employees?.content;
        // this.calculateStats();
        this.stats.totalEmployees = data.totalEmployees;
        this.stats.activeEmployees = data.activeEmployees;
        this.stats.pendingEmployees = data.pendingEmployees;
        this.stats.totalDepartments = data.activeDepartment;

        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });

    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees.content;
      },
    });

    if (this.isAdmin) {
      this.departmentService.getAllDepartments().subscribe({
        next: (departments) => {
          this.departments = departments;
          // this.stats.totalDepartments = departments.length;
        },
      });
    }
  }

  // calculateStats(): void {
  //   this.stats.totalEmployees = this.employees.length;
  //   this.stats.activeEmployees = this.employees.filter(
  //     (e) => e.status === 'ACTIVE'
  //   ).length;
  //   this.stats.pendingEmployees = this.employees.filter(
  //     (e) => e.status === 'PENDING'
  //   ).length;
  // }

  get isAdmin(): boolean {
    return this.currentEmployee?.role === 'ADMIN';
  }

  get isManager(): boolean {
    return this.currentEmployee?.role === 'MANAGER';
  }

  get recentEmployees(): Employee[] {
    return this.employees.slice(0, 5);
  }
}

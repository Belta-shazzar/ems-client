import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import { Employee, EmployeeStatus } from '../../../core/models/employee.model';
import { EmployeeRole } from '../../../core/models/auth.model';
import {
  LucideAngularModule,
  Users,
  Search,
  Filter,
  Plus,
  Grid,
  List,
} from 'lucide-angular';
// import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LucideAngularModule],
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private employeeService = inject(EmployeeService);
  private authService = inject(AuthService);
  // private router = inject(Router);
  // private dialog = inject(MatDialog);

  readonly Users = Users;
  readonly Search = Search;
  // readonly Filter = Filter;
  readonly Plus = Plus;
  readonly Grid = Grid;
  readonly List = List;
  // readonly EmployeeRole = EmployeeRole;

  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  loading = false;//true;
  searchTerm = '';
  viewMode: 'grid' | 'list' = 'grid';

  currentUser = this.authService.currentEmployeeValue;

  ngOnInit(): void {
      this.loadEmployees();
  }

  loadEmployees(): void {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (employees) => {
        this.employees = employees;
        this.filteredEmployees = employees;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch(): void {
      const term = this.searchTerm.toLowerCase();
      this.filteredEmployees = this.employees.filter(emp =>
        emp.firstName.toLowerCase().includes(term) ||
        emp.lastName.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term) ||
        (emp.departmentName && emp.departmentName.toLowerCase().includes(term))
      );
  }

  toggleViewMode(): void {
      this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
  }

  get isAdmin(): boolean {
      return this.currentUser?.role === EmployeeRole.ADMIN;
  }

  // onEmployeeDeleted(id: string): void {
  //   this.employees = this.employees.filter(e => e.id !== id);
  //   this.filteredEmployees = this.filteredEmployees.filter(e => e.id !== id);
  // }

  deleteEmployee(id: string): void {
  //   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
  //     width: '400px',
  //     data: {
  //       title: 'Delete Employee',
  //       message: 'Are you sure you want to delete this employee? This action cannot be undone.'
  //     }
  //   });

  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //       this.employeeService.deleteEmployee(id).subscribe({
  //         next: () => {
  //           this.onEmployeeDeleted(id);
  //         },
  //         error: (err) => {
  //           console.error('Error deleting employee:', err);
  //         }
  //       });
  //     }
  //   });
  }

  getStatusBadgeClass(status: EmployeeStatus): string {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'SUSPENDED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  getRoleBadgeClass(role: EmployeeRole): string {
    switch (role) {
      case EmployeeRole.ADMIN:
        return 'bg-purple-100 text-purple-800';
      case EmployeeRole.MANAGER:
        return 'bg-blue-100 text-blue-800';
      case EmployeeRole.EMPLOYEE:
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

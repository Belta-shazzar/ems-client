import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EmployeeService } from '../../../core/services/employee.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  Employee,
  EmployeeStatus,
  Pagination,
} from '../../../core/models/employee.model';
import { EmployeeRole } from '../../../core/models/auth.model';
import {
  LucideAngularModule,
  Users,
  Search,
  Filter,
  Plus,
  Grid,
  List,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';
import { CommonModule } from '@angular/common';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
// import { ConfirmationDialogComponent } from '../../../shared/components/confirmation-dialog/confirmation-dialog.component';
// import { MatDialog } from '@angular/material/dialog';

export type ViewMode = 'grid' | 'list';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    LucideAngularModule,
    CommonModule,
    Dropdown,
  ],
  templateUrl: './employee-list.html',
})
export class EmployeeList implements OnInit {
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  // private dialog = inject(MatDialog);

  readonly Users = Users;
  readonly Search = Search;
  // readonly Filter = Filter;
  readonly Plus = Plus;
  readonly Grid = Grid;
  readonly List = List;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  // readonly EmployeeRole = EmployeeRole;

  loading = true;
  searchTerm = '';
  displayedPages: number = 0;
  currentPage: number = 1;
  totalPages: number = 0;
  employeeCount: number = 0;
  viewMode: ViewMode | undefined;
  employees: Employee[] = [];
  filteredEmployees: Employee[] = [];
  selectedStatus: EmployeeStatus | 'ALL' = 'ALL';
  employeeStatuses: EmployeeStatus[] = Object.values(EmployeeStatus);
  selectedRole: EmployeeRole | 'ALL' = 'ALL';
  employeeRoles: EmployeeRole[] = Object.values(EmployeeRole);

  currentUser = this.authService.currentEmployeeValue;

  filters = {
    keyword: null as string | null,
    status: null as EmployeeStatus | null,
    role: null as EmployeeRole | null,
    page: this.currentPage,
    size: 12,
  };

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.currentPage = Number(params.get('page')) || 1;

      // this.fetchEmployees();
      this.loadEmployees();
    });
  }

  loadEmployees(): void {
    this.loading = true;
    const viewMode =
      (localStorage.getItem('employeeView') as ViewMode) || 'list';
    this.viewMode = viewMode;

    this.fetchEmployees();
    // this.displayedPages = this.totalPages < 5 ? this.totalPages : 5;

    // this.loading = false;
  }

  onSearch(): void {
    const term = this.searchTerm.toLowerCase();
    this.filters.keyword = term;
    this.fetchEmployees();
  }

  private buildQueryParams() {
    const params: any = {};

    Object.entries(this.filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        params[key] = value;
      }
    });

    return params;
  }

  fetchEmployees() {
    const params = this.buildQueryParams();

    this.employeeService.getAllEmployees(params).subscribe({
      next: (employees) => {
        this.employees = employees.content;
        this.filteredEmployees = employees.content;
        this.totalPages = employees.pagination.totalPages;
        this.employeeCount = employees.pagination.totalElements;
        this.currentPage = employees.pagination.page;
        this.displayedPages = this.totalPages < 5 ? this.totalPages : 5;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  toggleViewMode(): void {
    this.viewMode = this.viewMode === 'grid' ? 'list' : 'grid';
    localStorage.setItem('employeeView', this.viewMode);
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

  get pages(): number[] {
    if (this.totalPages <= this.displayedPages) {
      // Show all pages if total is small
      return Array.from({ length: this.totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(this.displayedPages / 2);

    let start = this.currentPage - half;
    let end = this.currentPage + half;

    // Clamp start
    if (start < 1) {
      start = 1;
      end = this.displayedPages;
    }

    // Clamp end
    if (end > this.totalPages) {
      end = this.totalPages;
      start = this.totalPages - this.displayedPages + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  onStatusChange(status: EmployeeStatus | 'ALL') {
    this.selectedStatus = status;
    this.filters.status = status === 'ALL' ? null : status;
    this.filters.page = 1;
    this.fetchEmployees();
  }

  onRoleChange(role: EmployeeRole | 'ALL') {
    this.selectedRole = role;
    this.filters.role = role === 'ALL' ? null : role;
    this.filters.page = 1;
    this.fetchEmployees();
  }

  updatePage(newPage: number) {
    this.currentPage = newPage;
    this.filters.page = newPage;
    console.log('The filter: ', this.filters);
    this.fetchEmployees();
  }
}

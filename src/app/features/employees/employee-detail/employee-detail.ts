import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee, EmployeeStatus } from '../../../core/models/employee.model';
import { EmployeeRole } from '../../../core/models/auth.model';
import {
  LucideAngularModule,
  ArrowLeft,
  Edit,
  Trash2,
  Mail,
  Phone,
  Calendar,
  Building2,
  User,
  UserCog,
} from 'lucide-angular';

@Component({
  selector: 'app-employee-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './employee-detail.html',
})
export class EmployeeDetail implements OnInit {
  employee: Employee | null = null;
  loading = false; //true;
  error = '';

  readonly ArrowLeft = ArrowLeft;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;
  readonly Mail = Mail;
  // readonly Phone = Phone;
  // readonly Calendar = Calendar;
  readonly Building2 = Building2;
  // readonly User = User;
  readonly UserCog = UserCog;
  // readonly EmployeeRole = EmployeeRole;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadEmployee(id);
    }
  }

  loadEmployee(id: string): void {
    this.loading = true;
    this.employeeService.getEmployeeById(id).subscribe({
      next: (employee) => {
        this.employee = employee;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee details';
        this.loading = false;
      },
    });
  }

  deleteEmployee(): void {
    //   if (confirm('Are you sure you want to delete this employee?')) {
    //     if (this.employee) {
    //       this.employeeService.deleteEmployee(this.employee.id).subscribe({
    //         next: () => {
    //           this.router.navigate(['/employees']);
    //         },
    //         error: (err) => {
    //           this.error = 'Failed to delete employee';
    //         }
    //       });
    //     }
    //   }
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

  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}

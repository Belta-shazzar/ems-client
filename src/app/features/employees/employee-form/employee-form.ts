import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';
import { DepartmentService } from '../../../core/services/department.service';
import {
  Employee,
  EmployeeRequest,
  EmployeeStatus,
  EmployeeRole,
} from '../../../core/models/employee.model';
import { Department } from '../../../core/models/department.model';
import {
  LucideAngularModule,
  Save,
  X,
  User,
  Mail,
  Lock,
  UserCog,
  Building2,
} from 'lucide-angular';

@Component({
  selector: 'app-employee-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    RouterLink,
    LucideAngularModule,
  ],
  templateUrl: './employee-form.html',
})
export class EmployeeForm implements OnInit {
  employeeForm: FormGroup;
  isEditMode = false;
  employeeId: string | null = null;
  loading = false; //true;
  error = '';
  departments: Department[] = [];
  roles = Object.values(EmployeeRole);
  statuses = Object.values(EmployeeStatus);

  readonly Save = Save;
  readonly X = X;
  // readonly User = User;
  readonly Mail = Mail;
  readonly Lock = Lock;
  readonly UserCog = UserCog;
  readonly Building2 = Building2;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private employeeService: EmployeeService,
    private departmentService: DepartmentService
  ) {
    this.employeeForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(8)]],
      role: [EmployeeRole.EMPLOYEE, [Validators.required]],
      status: [EmployeeStatus.ACTIVE, [Validators.required]],
      departmentId: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
      this.employeeId = this.route.snapshot.paramMap.get('id');
      this.isEditMode = !!this.employeeId;
      this.loadDepartments();
      if (this.isEditMode) {
        this.loadEmployee();
        this.employeeForm.get('password')?.clearValidators();
      } else {
        this.employeeForm.get('password')?.setValidators([Validators.required, Validators.minLength(8)]);
      }
  }

  loadEmployee(): void {
    if (!this.employeeId) return;

    this.loading = true;
    this.employeeService.getEmployeeById(this.employeeId).subscribe({
      next: (employee) => {
        this.employeeForm.patchValue({
          firstName: employee.firstName,
          lastName: employee.lastName,
          email: employee.email,
          role: employee.role,
          status: employee.status,
          departmentId: employee.departmentId
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load employee';
        this.loading = false;
      }
    });
  }

  loadDepartments(): void {
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (err) => {
        this.error = 'Failed to load departments';
      }
    });
  }

  cancel() {
    this.router.navigate(['/dashboard']);
  }

  onSubmit(): void {
    //   if (this.employeeForm.invalid) {
    //     this.employeeForm.markAllAsTouched();
    //     return;
    //   }
    //   this.loading = true;
    //   this.error = '';
    //   const employeeData: EmployeeRequest = {
    //     ...this.employeeForm.value
    //   };
    //   // Remove password if it's empty (edit mode)
    //   if (this.isEditMode && !employeeData.password) {
    //     delete employeeData.password;
    //   }
    //   const request = this.isEditMode && this.employeeId
    //     ? this.employeeService.updateEmployee(this.employeeId, employeeData)
    //     : this.employeeService.createEmployee(employeeData);
    //   request.subscribe({
    //     next: () => {
    //       this.router.navigate(['/employees']);
    //     },
    //     error: (err) => {
    //       this.error = err.error?.message || 'An error occurred';
    //       this.loading = false;
    //     }
    //   });
  }

  get f() {
    return this.employeeForm.controls;
  }
}

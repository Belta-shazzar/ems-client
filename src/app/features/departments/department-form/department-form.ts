import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
  FormsModule,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DepartmentService } from '../../../core/services/department.service';
import {
  LucideAngularModule,
  Save,
  X,
  Building2,
  Loader2,
} from 'lucide-angular';
import { Error } from "../../../shared/components/error/error";

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    LucideAngularModule,
    Error
],
  templateUrl: './department-form.html',
})
export class DepartmentForm implements OnInit {
  departmentForm: FormGroup;
  isEditMode = false;
  departmentId: string | null = null;
  loading = false;
  error = '';
  submitted = false;

  readonly Save = Save;
  readonly X = X;
  readonly Building2 = Building2;
  readonly Loader2 = Loader2;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private departmentService: DepartmentService
  ) {
    this.departmentForm = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      description: ['', [Validators.maxLength(500)]],
      status: [true],
    });
  }

  ngOnInit(): void {
    this.departmentId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.departmentId;

    if (this.isEditMode) {
      this.loadDepartment();
    }
  }

  loadDepartment(): void {
    if (!this.departmentId) return;
    this.loading = true;

    this.departmentService.getDepartmentById(this.departmentId).subscribe({
      next: (department) => {
        this.departmentForm.patchValue({
          name: department.name,
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load department';
        this.loading = false;
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.departmentForm.invalid) return;

    this.loading = true;
    this.error = '';

    const payload = this.departmentForm.value;

    const request = this.isEditMode
      ? this.departmentService.updateDepartment(this.departmentId!, payload)
      : this.departmentService.createDepartment(payload);

    request.subscribe({
      next: () => this.router.navigate(['/departments']),
      error: (err) => {
        this.error = err.error?.message || 'An error occurred';
        this.loading = false;
      },
    });
  }

  onReset(): void {
    this.submitted = false;

    if (this.isEditMode) {
      this.loadDepartment();
    } else {
      this.departmentForm.reset({
        name: '',
        description: '',
        status: true,
      });
    }
  }

  onCancel(): void {
    this.router.navigate(['/departments']);
  }

  get name() {
    return this.departmentForm.get('name');
  }

  get description() {
    return this.departmentForm.get('description');
  }

  get status() {
    return this.departmentForm.get('status');
  }

  get f() {
    return this.departmentForm.controls;
  }
}

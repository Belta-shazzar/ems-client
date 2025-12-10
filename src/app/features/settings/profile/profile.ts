import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { finalize } from 'rxjs/operators';
import { LucideAngularModule, User, Mail, Save, X } from 'lucide-angular';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './profile.html',
})
export class Profile implements OnInit {
  profileForm: FormGroup;
  loading = false;
  error = '';
  success = false;

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      // Add more profile fields as needed
    });
  }

  ngOnInit(): void {
    // Load current user data
    const currentEmployee = this.authService.currentEmployeeValue;
    if (currentEmployee) {
      this.profileForm.patchValue({
        firstName: currentEmployee.firstName || '',
        lastName: currentEmployee.lastName || '',
        email: currentEmployee.email || '',
      });
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';
    this.success = false;

    // Simulate API call
    setTimeout(() => {
      this.loading = false;
      this.success = true;
      // Reset success message after 3 seconds
      setTimeout(() => (this.success = false), 3000);
    }, 1000);

    // In a real app, you would call your user service to update the profile
    // this.userService.updateProfile(this.profileForm.value).pipe(
    //   finalize(() => this.loading = false)
    // ).subscribe({
    //   next: () => {
    //     this.success = true;
    //     // Update user in auth service
    //     const currentUser = { ...this.authService.currentUserValue, ...this.profileForm.value };
    //     localStorage.setItem('currentUser', JSON.stringify(currentUser));
    //     this.authService.currentUserSubject.next(currentUser);
    //     // Reset success message after 3 seconds
    //     setTimeout(() => this.success = false, 3000);
    //   },
    //   error: (err) => {
    //     this.error = err.error?.message || 'Failed to update profile. Please try again.';
    //     console.error('Profile update error:', err);
    //   }
    // });
  }

  onCancel() {
    // Reset form to original values
    const currentEmployee = this.authService.currentEmployeeValue;
    if (currentEmployee) {
      this.profileForm.patchValue({
        firstName: currentEmployee.firstName || '',
        lastName: currentEmployee.lastName || '',
        email: currentEmployee.email || '',
      });
    }
  }
}

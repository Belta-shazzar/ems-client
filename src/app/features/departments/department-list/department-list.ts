import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../../core/services/department.service';
import { Department } from '../../../core/models/department.model';
import {
  LucideAngularModule,
  Building2,
  Plus,
  Search,
  Edit,
  Trash2,
} from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { StoreService } from '../../../core/services/store.service';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [RouterLink, LucideAngularModule, FormsModule],
  templateUrl: './department-list.html',
})
export class DepartmentList implements OnInit {
  private router = inject(Router);
  private storeService = inject(StoreService);
  private departmentService = inject(DepartmentService);

  departments: Department[] = [];
  filteredDepartments: Department[] = [];
  loading = false; // true;
  searchTerm = '';

  readonly Building2 = Building2;
  readonly Plus = Plus;
  readonly Search = Search;
  readonly Edit = Edit;
  readonly Trash2 = Trash2;

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.loading = true;
    this.departmentService.getAllDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
        this.filteredDepartments = [...departments];
        this.storeService.setDepartments(departments);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  onSearch(): void {
    if (!this.searchTerm) {
      this.filteredDepartments = [...this.departments];
      return;
    }
    const term = this.searchTerm.toLowerCase();
    this.filteredDepartments = this.departments.filter((dept) =>
      dept.name.toLowerCase().includes(term)
    );
  }

  editDepartment(id: string, event: Event): void {
    event.stopPropagation();
    this.router.navigate(['/departments', id, 'edit']);
  }

  deleteDepartment(id: string, event: Event): void {
    event.stopPropagation();
    //   if (confirm('Are you sure you want to delete this department?')) {
    //     this.departmentService.deleteDepartment(id).subscribe({
    //       next: () => {
    //         this.departments = this.departments.filter(dept => dept.id !== id);
    //         this.filteredDepartments = this.filteredDepartments.filter(dept => dept.id !== id);
    //       },
    //       error: (err) => {
    //         console.error('Error deleting department:', err);
    //       }
    //     });
    // }
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }
}

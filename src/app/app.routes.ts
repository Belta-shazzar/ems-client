import { Routes } from '@angular/router';
// import { authGuard } from './core/guards/auth.guard';
import { EmployeeRole } from './core/models/auth.model';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login').then((m) => m.Login),
  },
  {
    path: '',
    loadComponent: () =>
      import('./shared/layouts/main/main-layout').then((m) => m.Main),
    canActivate: [authGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./features/dashboard/dashboard').then((m) => m.Dashboard),
      },
      {
        path: 'employees',
        loadComponent: () =>
          import('./features/employees/employee-list/employee-list').then(
            (m) => m.EmployeeList
          ),
        data: { roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER] },
      },
      {
        path: 'employees/new',
        loadComponent: () =>
          import('./features/employees/employee-form/employee-form').then(
            (m) => m.EmployeeForm
          ),
        data: { roles: [EmployeeRole.ADMIN] },
      },
      {
        path: 'employees/:id',
        loadComponent: () =>
          import('./features/employees/employee-detail/employee-detail').then(
            (m) => m.EmployeeDetail
          ),
      },
      {
        path: 'employees/:id/edit',
        loadComponent: () =>
          import('./features/employees/employee-form/employee-form').then(
            (m) => m.EmployeeForm
          ),
        data: { roles: [EmployeeRole.ADMIN] },
      },
      {
        path: 'departments',
        loadComponent: () =>
          import('./features/departments/department-list/department-list').then(
            (m) => m.DepartmentList
          ),
        data: { roles: [EmployeeRole.ADMIN] },
      },
      {
        path: 'departments/new',
        loadComponent: () =>
          import('./features/departments/department-form/department-form').then(
            (m) => m.DepartmentForm
          ),
        data: { roles: [EmployeeRole.ADMIN] },
      },
      {
        path: 'departments/:id/edit',
        loadComponent: () =>
          import('./features/departments/department-form/department-form').then(
            (m) => m.DepartmentForm
          ),
        data: { roles: [EmployeeRole.ADMIN] },
      },
      // ⭐ Lazy load the settings module
      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.routes').then(
            (m) => m.SETTINGS_ROUTES
          ),
      },
      {
        path: 'chat',
        loadChildren: () =>
          import('./features/chat/chat.routes').then((m) => m.CHAT_ROUTES),
        canActivate: [authGuard],
        data: { roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER] },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '/dashboard',
  },
];

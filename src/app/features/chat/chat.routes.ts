// src/app/features/chat/chat.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';
import { EmployeeRole } from '../../core/models/auth.model';

export const CHAT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./chat').then(m => m.Chat),
    canActivate: [authGuard],
    data: { roles: [EmployeeRole.ADMIN, EmployeeRole.MANAGER] }
  }
];
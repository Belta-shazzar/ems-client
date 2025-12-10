import { Routes } from '@angular/router';
import { authGuard } from '../../core/guards/auth.guard';

export const SETTINGS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./settings').then((m) => m.Settings),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'profile',
        pathMatch: 'full',
      },
      {
        path: 'profile',
        loadComponent: () => import('./profile/profile').then((m) => m.Profile),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./password/password').then((m) => m.Password),
      },
      {
        path: 'appearance',
        loadComponent: () =>
          import('./appearance/appearance').then((m) => m.Appearance),
      },
    ],
  },
];

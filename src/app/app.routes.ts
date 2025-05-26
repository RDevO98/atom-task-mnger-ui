import { Routes } from '@angular/router';
import { loginRedirectGuard } from './core/guards/login-redirect.guard';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./features/login/presentation/pages/login/login.component').then(
        (m) => m.LoginComponent
      ),
    canActivate: [loginRedirectGuard],
  },
  {
    path: 'tasks',
    loadComponent: () =>
      import('./features/tasks/presentation/pages/tasks/tasks.component').then(
        (m) => m.TasksComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];

// app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent) },
  { path: 'register', loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent) },
  { 
    path: '', 
    loadComponent: () => import('./components/loan-list/loan-list.component').then(c => c.LoanListComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'loans/new', 
    loadComponent: () => import('./components/loan-form/loan-form.component').then(c => c.LoanFormComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'loans/:id', 
    loadComponent: () => import('./components/loan-details/loan-details.component').then(c => c.LoanDetailsComponent),
    canActivate: [authGuard]
  },
  { 
    path: 'admin/pending', 
    loadComponent: () => import('./components/pending-loans/pending-loans.component').then(c => c.PendingLoansComponent),
    canActivate: [adminGuard]
  },
  { 
    path: 'loans/:id/schedule', 
    loadComponent: () => import('./components/emi-schedule/emi-schedule.component').then(c => c.EmiScheduleComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];
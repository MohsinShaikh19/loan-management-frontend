import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Observable, tap } from 'rxjs';

interface AuthState {
  token: string | null;
  userId: string | null;
  fullName: string | null;
  isAdmin: boolean;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private state = signal<AuthState>({
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    fullName: localStorage.getItem('fullName'),
    isAdmin: localStorage.getItem('isAdmin') === 'true'
  });

  // Computed values
  token = computed(() => this.state().token);
  isAuthenticated = computed(() => !!this.state().token);
  userId = computed(() => this.state().userId);
  fullName = computed(() => this.state().fullName);
  isAdmin = computed(() => this.state().isAdmin);

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>(`${environment.apiUrl}/Auth/login`, { email, password })
      .pipe(
        tap(response => {
          const token = response.token;
          const payload = JSON.parse(atob(token.split('.')[1]));
          
          // this.state.set({
          //   token,
          //   userId: payload.nameid,
          //   fullName: payload.unique_name,
          //   isAdmin: payload.role === 'Admin'
          // });

          // localStorage.setItem('token', token);
          // localStorage.setItem('userId', payload.nameid);
          // localStorage.setItem('fullName', payload.unique_name);
          // localStorage.setItem('isAdmin', payload.role === 'Admin' ? 'true' : 'false');

          this.state.set({
            token,
            userId: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            fullName: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
            isAdmin: payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin'
          });


          localStorage.setItem('token', token);
          localStorage.setItem('userId', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']);
          localStorage.setItem('fullName', payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name']);
          localStorage.setItem('isAdmin', payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] === 'Admin' ? 'true' : 'false');
        })
      );
  }

  register(email: string, password: string, fullName: string): Observable<void> {
    return this.http.post<void>(`${environment.apiUrl}/auth/register`, { email, password, fullName });
  }

  logout(): void {
    this.state.set({ token: null, userId: null, fullName: null, isAdmin: false });
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
// services/emi.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { EMISchedule } from '../models/loan.model';
import { map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class EMIService {
  private http = inject(HttpClient);

  getEMISchedule(loanId: number) {
    return this.http.get<EMISchedule[]>(`${environment.apiUrl}/loans/${loanId}/schedule`);
  }
}
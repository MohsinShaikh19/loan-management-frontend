import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Loan, CreateLoanRequest } from '../models/loan.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private http = inject(HttpClient);
  private loans = signal<Loan[]>([]);
  private pendingLoans = signal<Loan[]>([]);

  getLoans() {
    return this.loans.asReadonly();
  }

  getPendingLoans() {
    return this.pendingLoans.asReadonly();
  }

  fetchLoans(userId?: string) {
    const url = userId 
      ? `${environment.apiUrl}/loans/user/${userId}`
      : `${environment.apiUrl}/loans/user`;
    
    this.http.get<Loan[]>(url).subscribe(loans => {
      this.loans.set(loans);
    });

    // this.http.get<any>(url).subscribe(response => {
    //   const extractedLoans: Loan[] = response?.$values || [];
    //   this.loans.set(extractedLoans);
    // });
    
  }

  fetchPendingLoans() {
    this.http.get<Loan[]>(`${environment.apiUrl}/loans/pending`).subscribe(loans => {
      this.loans.set(loans);
    });

    // this.http.get<any>(`${environment.apiUrl}/loans/pending`).subscribe(response => {
    //   const extractedLoans: Loan[] = response?.$values || []; // Extract the loans from $values
    //   this.loans.set(extractedLoans); // Set the extracted loans
    // });
    
  }

  createLoan(request: CreateLoanRequest) {
    return this.http.post<Loan>(`${environment.apiUrl}/loans`, request).pipe(
      tap(loan => {
        this.loans.update(loans => [...loans, loan]);
      })
    );
  }

  approveLoan(loanId: number) {
    return this.http.post(`${environment.apiUrl}/loans/${loanId}/approve`, null).pipe(
      tap(() => {
        this.pendingLoans.update(loans => loans.filter(l => l.id !== loanId));
        // this.fetchLoans();
        this.fetchPendingLoans();
      })
    );
  }

  rejectLoan(loanId: number) {
    return this.http.post(`${environment.apiUrl}/loans/${loanId}/reject`, null).pipe(
      tap(() => {
        this.pendingLoans.update(loans => loans.filter(l => l.id !== loanId));
        this.fetchPendingLoans();
      })
    );
  }

  getLoanDetails(loanId: number) {
    return this.http.get<Loan>(`${environment.apiUrl}/loans/${loanId}`);
  }
}
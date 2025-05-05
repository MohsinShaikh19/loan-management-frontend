import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Loan, CreateLoanRequest, PaginatedResponse } from '../models/loan.model';
import { Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoanService {
  private http = inject(HttpClient);
  private loans = signal<Loan[]>([]);
  private pendingLoans = signal<Loan[]>([]);

  //Pagination stage
  private pagination = signal({
    currentPage : 1,
    pageSize : 10,
    totalItems : 0
  });

  getLoans() {
    return this.loans.asReadonly();
  }

  getPendingLoans() {
    return this.pendingLoans.asReadonly();
  }

  getPagination() {
    return this.pagination.asReadonly();
  }

  fetchLoans(userId?: string, page: number = 1, pageSize: number = 10) {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    const url = userId 
      ? `${environment.apiUrl}/loans/user/${userId}`
      : `${environment.apiUrl}/loans/user`;
    
    this.http.get<PaginatedResponse<Loan>>(url, { params }).subscribe(response => {
      this.loans.set(response.items);
      this.pagination.set({
        currentPage: response.pageNumber,
        pageSize: response.pageSize,
        totalItems: response.totalCount
      });
    });  
  }

  fetchPendingLoans(page: number = 1, pageSize: number = 10) {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    this.http.get<PaginatedResponse<Loan>>(`${environment.apiUrl}/loans/pending`, { params })
      .subscribe(response => {
        this.loans.set(response.items);
        this.pagination.set({
          currentPage: response.pageNumber,
          pageSize: response.pageSize,
          totalItems: response.totalCount
        });
      });  
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
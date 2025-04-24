import { Component, OnInit, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterLink } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { AuthService } from '../../services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-loan-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    RouterLink,
    MatProgressSpinnerModule,
  ],
  templateUrl: './loan-list.component.html',
  styleUrls: ['./loan-list.component.scss']
})
export class LoanListComponent implements OnInit {
  private loanService = inject(LoanService);
  private authService = inject(AuthService);
  private router = inject(Router);

  displayedColumns = ['id', 'amount', 'term', 'purpose', 'status', 'actions'];
  loans = this.loanService.getLoans();
  isAdmin = this.authService.isAdmin;

  ngOnInit(): void {
    if (this.isAdmin()) {
      this.loanService.fetchPendingLoans();
      this.displayedColumns = ['id', 'amount', 'term', 'purpose', 'user', 'status', 'actions'];
    } else {
      this.loanService.fetchLoans();
    }
  }
  
  viewDetails(loanId: number) {
    this.router.navigate(['/loans', loanId]);
  }

  approveLoan(loanId: number) {
    this.loanService.approveLoan(loanId).subscribe();
  }

  rejectLoan(loanId: number) {
    this.loanService.rejectLoan(loanId).subscribe();
  }
}
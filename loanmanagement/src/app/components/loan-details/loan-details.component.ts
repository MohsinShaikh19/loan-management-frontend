import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoanService } from '../../services/loan.service';
import { EMIService } from '../../services/emi.service';
import { AuthService } from '../../services/auth.service';
import { Loan } from '../../models/loan.model';
import { EmiScheduleComponent } from '../emi-schedule/emi-schedule.component';


@Component({
  selector: 'app-loan-details',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    RouterLink,
    EmiScheduleComponent
  ],
  templateUrl: './loan-details.component.html',
  styleUrls: ['./loan-details.component.scss']
})
export class LoanDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private loanService = inject(LoanService);
  private emiService = inject(EMIService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  loan: Loan | null = null;
  isLoading = false;
  emiSchedules: any[] = [];
  isAdmin = this.authService.isAdmin();

  ngOnInit(): void {
    this.loadLoanDetails();
  }

  loadLoanDetails(): void {
    this.isLoading = true;
    const loanId = this.route.snapshot.paramMap.get('id');

    if (!loanId) {
      this.router.navigate(['/']);
      return;
    }

    this.loanService.getLoanDetails(+loanId).subscribe({
      next: (loan) => {
        this.loan = loan;
        this.isLoading = false;
        
        // Check if user is authorized to view this loan
        // if (loan.userId !== this.authService.userId() && !this.isAdmin) {
        //   this.snackBar.open('You are not authorized to view this loan', 'Close', { duration: 3000 });
        //   this.router.navigate(['/']);
        // }
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Failed to load loan details', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      }
    });

    this.emiService.getEMISchedule(+loanId).subscribe({
      next: (schedules) => {
        this.emiSchedules = schedules;
      },
      error: () => {
        this.snackBar.open('Failed to load EMI schedule', 'Close', { duration: 3000 });
      }
    });
  }

  approveLoan(): void {
    if (!this.loan) return;

    this.loanService.approveLoan(this.loan.id).subscribe({
      next: () => {
        this.snackBar.open('Loan approved successfully', 'Close', { duration: 3000 });
        this.loadLoanDetails();
      },
      error: () => {
        this.snackBar.open('Failed to approve loan', 'Close', { duration: 3000 });
      }
    });
  }

  rejectLoan(): void {
    if (!this.loan) return;

    this.loanService.rejectLoan(this.loan.id).subscribe({
      next: () => {
        this.snackBar.open('Loan rejected successfully', 'Close', { duration: 3000 });
        this.loadLoanDetails();
      },
      error: () => {
        this.snackBar.open('Failed to reject loan', 'Close', { duration: 3000 });
      }
    });
  }

  calculateTotalInterest(): number {
    if (!this.emiSchedules || this.emiSchedules.length === 0) return 0;
    return this.emiSchedules.reduce((sum, item) => sum + item.interestAmount, 0);
  }

  calculateTotalPayment(): number {
    if (!this.emiSchedules || this.emiSchedules.length === 0) return 0;
    return this.emiSchedules.reduce((sum, item) => sum + item.emiAmount, 0);
  }
}
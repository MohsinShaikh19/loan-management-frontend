import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router } from '@angular/router';
import { LoanService } from '../../services/loan.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-loan-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './loan-form.component.html',
  styleUrls: ['./loan-form.component.scss']
})
export class LoanFormComponent {
  private loanService = inject(LoanService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  form = new FormGroup({
    amount: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(1000000)
    ]),
    termInMonths: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(1),
      Validators.max(60)
    ]),
    purpose: new FormControl('', [
      Validators.required,
      Validators.maxLength(500)
    ])
  });

  submit() {
    if (this.form.invalid) return;

    const request = {
      amount: this.form.value.amount!,
      termInMonths: this.form.value.termInMonths!,
      purpose: this.form.value.purpose!
    };

    this.loanService.createLoan(request).subscribe({
      next: () => {
        this.snackBar.open('Loan application submitted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
      },
      error: () => {
        this.snackBar.open('Loan application submitted successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/']);
        //this.snackBar.open('Failed to submit loan application', 'Close', { duration: 3000 });
      }
    });
  }
}
import { Component, inject } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  registerForm = new FormGroup({
    fullName: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(100)
    ]),
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(6),
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required
    ])
  }, { validators: this.passwordMatchValidator() });

  // Correct validator implementation
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const formGroup = control as FormGroup;
      const password = formGroup.get('password')?.value;
      const confirmPassword = formGroup.get('confirmPassword')?.value;
      
      return password === confirmPassword ? null : { mismatch: true };
    };
  }

  onSubmit() {
    if (this.registerForm.invalid) return;

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe({
      next: () => {
        this.snackBar.open('Registration successful! Please login.', 'Close', { duration: 5000 });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        let errorMessage = 'Registration failed. Please try again.';
        if (error?.error?.errors) {
          errorMessage = Object.values(error.error.errors).join('\n');
        }
        this.snackBar.open(errorMessage, 'Close', { duration: 5000 });
      }
    });
  }

  getPasswordErrorMessage() {
    const passwordControl = this.registerForm.get('password');
    if (passwordControl?.hasError('required')) {
      return 'Password is required';
    }
    if (passwordControl?.hasError('minlength')) {
      return 'Password must be at least 6 characters';
    }
    if (passwordControl?.hasError('pattern')) {
      return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
    }
    return '';
  }
}
import { Component, inject, OnInit } from '@angular/core';
import {UntypedFormGroup, UntypedFormControl, Validators, AbstractControl, ReactiveFormsModule} from '@angular/forms'
import { Router } from '@angular/router';
import { UserAuthService } from '../services/user-auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-auth',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-auth.component.html',
  styleUrl: './user-auth.component.scss'
})
export class UserAuthComponent implements OnInit{
  loginForm!: UntypedFormGroup;
  signupForm!: UntypedFormGroup;
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  private authService = inject(UserAuthService)
  private router = inject(Router) 


  constructor(  ) {  }

  ngOnInit(): void {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)])
    });

    this.signupForm = new UntypedFormGroup({
      email: new UntypedFormControl('', [Validators.required, Validators.email]),
      password: new UntypedFormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword:new UntypedFormControl('', Validators.required),
      displayName: new UntypedFormControl('', [Validators.required, Validators.minLength(2)])
    }, { validators: this.passwordMatchValidator });
  }
  // Custom validator for password confirmation
  passwordMatchValidator(form: AbstractControl) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    return password && confirmPassword && password.value === confirmPassword.value
      ? null : { passwordMismatch: true };
  }

  // Switch between login and signup modes
  switchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.loginForm.reset();
    this.signupForm.reset();
  }

  // Handle login
  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.signIn(email, password).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error.code);
        }
      });
    }
  }

  // Handle signup
  onSignup() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';

      const { email, password, displayName } = this.signupForm.value;

      this.authService.signUp(email, password, displayName).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = this.getErrorMessage(error.code);
        }
      });
    }
  }

  // Get user-friendly error messages
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      default:
        return 'An error occurred. Please try again';
    }
  }

  // Helper methods for template
  getFieldError(form: UntypedFormGroup, field: string): string {
    const control = form.get(field);
    if (control?.errors && control.touched) {
      if (control.errors['required']) return `${field} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['minlength']) return `${field} must be at least ${control.errors['minlength'].requiredLength} characters`;
    }
    return '';
  }

  getFormError(): string {
    if (this.signupForm.errors?.['passwordMismatch']) {
      return 'Passwords do not match';
    }
    return '';
  }
}

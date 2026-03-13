import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, RouterLink],
    template: `
    <div class="auth-container">
      <div class="auth-card">
        <div class="auth-header">
          <span class="auth-icon">✨</span>
          <h1>Create Account</h1>
          <p>Join the meeting room booking system</p>
        </div>
        <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input id="name" type="text" formControlName="name" placeholder="Enter your name">
            <span class="error" *ngIf="registerForm.get('name')?.touched && registerForm.get('name')?.invalid">Name is required</span>
          </div>
          <div class="form-group">
            <label for="email">Email</label>
            <input id="email" type="email" formControlName="email" placeholder="Enter your email">
            <span class="error" *ngIf="registerForm.get('email')?.touched && registerForm.get('email')?.invalid">Valid email is required</span>
          </div>
          <div class="form-group">
            <label for="password">Password</label>
            <input id="password" type="password" formControlName="password" placeholder="Min 6 characters">
            <span class="error" *ngIf="registerForm.get('password')?.touched && registerForm.get('password')?.invalid">Password must be at least 6 characters</span>
          </div>
          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>
          <button type="submit" class="btn-primary" [disabled]="registerForm.invalid || loading">
            {{ loading ? 'Creating...' : 'Create Account' }}
          </button>
        </form>
        <p class="auth-footer">Already have an account? <a routerLink="/login">Sign In</a></p>
      </div>
    </div>
  `,
    styles: [`
    .auth-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: calc(100vh - 100px);
    }
    .auth-card {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.2);
      border-radius: 16px;
      padding: 2.5rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.3);
    }
    .auth-header { text-align: center; margin-bottom: 2rem; }
    .auth-icon { font-size: 2.5rem; }
    .auth-header h1 { color: #f1f5f9; font-size: 1.75rem; margin: 0.5rem 0 0.25rem; }
    .auth-header p { color: #94a3b8; font-size: 0.9rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; color: #cbd5e1; font-size: 0.85rem; margin-bottom: 0.4rem; font-weight: 500; }
    .form-group input {
      width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px;
      color: #e2e8f0; font-size: 0.95rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;
    }
    .form-group input:focus { border-color: #818cf8; }
    .form-group input::placeholder { color: #475569; }
    .error { color: #f87171; font-size: 0.75rem; margin-top: 0.25rem; display: block; }
    .error-message {
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem;
      margin-bottom: 1rem; text-align: center;
    }
    .btn-primary {
      width: 100%; padding: 0.8rem; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 10px; color: white; font-size: 1rem;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
    .auth-footer { text-align: center; color: #94a3b8; font-size: 0.85rem; margin-top: 1.5rem; }
    .auth-footer a { color: #818cf8; text-decoration: none; font-weight: 500; }
    .auth-footer a:hover { text-decoration: underline; }
  `]
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    errorMessage = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.registerForm = this.fb.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(6)]]
        });
    }

    onSubmit() {
        if (this.registerForm.invalid) return;
        this.loading = true;
        this.errorMessage = '';
        this.auth.register(this.registerForm.value).subscribe({
            next: () => this.router.navigate(['/dashboard']),
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Registration failed.';
            }
        });
    }
}

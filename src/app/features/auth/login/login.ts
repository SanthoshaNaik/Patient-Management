import { Component, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth';
import type { LoginResponse } from '../../../shared/models/login.model';


@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  onLogin(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email.trim() || !this.password) {
      this.errorMessage.set('Please enter your email and password.');
      return;
    }

    this.isLoading.set(true);

    this.authService.login(this.email.trim(), this.password).subscribe({
      next: (response: LoginResponse) => {
        sessionStorage.setItem('authToken', response.token);
        sessionStorage.setItem('userName', response.name);
        sessionStorage.setItem('userEmail', response.email);

        this.successMessage.set('Login successful!');
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);

        // We'll configure the dashboard route in a later step.
      },
      error: (error) => {
        this.isLoading.set(false);

        this.errorMessage.set(
          typeof error.error === 'string'
            ? error.error
            : 'Login failed. Please check your credentials and try again.'
        );
      }
    });
  }
}
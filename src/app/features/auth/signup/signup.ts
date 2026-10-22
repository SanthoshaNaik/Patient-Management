
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth';
import { SignupRequest } from '../../../shared/models/signup.model';

@Component({
  selector: 'app-signup',
  imports: [FormsModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css'
})
export class Signup {
  user = {
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(private authService: AuthService) {}

  signup() {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.user.password !== this.user.confirmPassword) {
      this.errorMessage = 'Passwords do not match.';
      return;
    }

    const signupData: SignupRequest = {
      name: this.user.name,
      email: this.user.email,
      password: this.user.password
    };

    this.isLoading = true;

    this.authService.signup(signupData).subscribe({
      next: (response) => {
        this.successMessage = response || 'Account created successfully.';
        this.isLoading = false;
        this.user = {
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        };
      },
      error: (error) => {
        this.errorMessage =
          error.error || 'Signup failed. Please try again.';
        this.isLoading = false;
      }
    });
  }
}

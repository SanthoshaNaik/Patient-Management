import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName = sessionStorage.getItem('userName') || 'User';

  onLogout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
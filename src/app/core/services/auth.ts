
import { Injectable, inject } from '@angular/core';
import type { SignupRequest } from '../../shared/models/signup.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import type { LoginResponse } from '../../shared/models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5182/api/auth';

  private http = inject(HttpClient);

  signup(user: SignupRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/signup`,
      user,
      { responseType: 'text' }
    );
  }

  login(email: string, password: string): Observable<LoginResponse> {
  return this.http.post<LoginResponse>(
    `${this.apiUrl}/login`,
    { email, password }
  );
}

logout():void{
  sessionStorage.removeItem('authToken')
  sessionStorage.removeItem('userEmail')
  sessionStorage.removeItem('userName')
}
}

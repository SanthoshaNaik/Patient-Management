import { Service } from '@angular/core';
import type { SignupRequest } from '../../shared/models/signup.model';
import type { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';

@Service()
export class AuthService {
      private apiUrl = 'http://localhost:5000/api/auth';

  constructor(private http: HttpClient) {}

  signup(user: SignupRequest): Observable<string> {
    return this.http.post(
      `${this.apiUrl}/signup`,
      user,
      { responseType: 'text' }
    );
  }
}

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PatientList } from './features/patients/patient-list/patient-list';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';

@Component({
  imports: [RouterOutlet, PatientList, Login, Signup],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('patient-management');
}

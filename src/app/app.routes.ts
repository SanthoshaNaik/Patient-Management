import { Routes } from '@angular/router';
import { Login } from './features/auth/login/login';
import { Signup } from './features/auth/signup/signup';
import { PatientList } from './features/patients/patient-list/patient-list';
import { Dashboard } from './features/dashboard/dashboard';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: Login
  },
  {
    path: 'signup',
    component: Signup
  },
  {
    path: 'patients',
    component: PatientList
  },
  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
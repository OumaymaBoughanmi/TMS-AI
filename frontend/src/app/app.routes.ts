import { Routes } from '@angular/router';
import { JobsList } from './components/jobs-list/jobs-list';
import { UsersList } from './components/users-list/users-list';
import { IncidentsList } from './components/incidents-list/incidents-list';
import { Login } from './components/login/login';
import { LogsList } from './components/logs-list/logs-list';
import { EscalationHistory } from './components/escalation-history/escalation-history';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'jobs', component: JobsList, canActivate: [authGuard] },
  { path: 'users', component: UsersList, canActivate: [authGuard] },
  { path: 'incidents', component: IncidentsList, canActivate: [authGuard] },
  { path: 'logs', component: LogsList, canActivate: [authGuard] },
  { path: 'escalations', component: EscalationHistory, canActivate: [authGuard] },
];
import { Routes } from '@angular/router';
import { UsersPage } from './components/users-page/users-page';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'users', component: UsersPage, canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'login' }
];

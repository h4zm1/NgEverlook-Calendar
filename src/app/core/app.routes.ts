import { Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'zgenchants',
    loadComponent: () =>
      import('../enchant/enchant.component').then((m) => m.EnchantComponent),
  },

  {
    path: 'config',
    loadComponent: () =>
      import('../config/config.component').then((m) => m.ConfigComponent),
    canActivate: [authGuard],
  },

  {
    path: 'login',
    loadComponent: () =>
      import('../login/login.component').then((m) => m.LoginComponent),
  },
];

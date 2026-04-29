import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/form', pathMatch: 'full' },
  { path: 'form', loadComponent: () => import('./form/form').then((m) => m.FormComponent) },
  {
    path: 'summary',
    loadComponent: () => import('./summary/summary').then((m) => m.SummaryComponent),
  },
];

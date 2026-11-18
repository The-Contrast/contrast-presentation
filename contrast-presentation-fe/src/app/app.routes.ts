import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/deck/deck').then((m) => m.Deck), title: 'The Contrast | Scan. Meet. Build.' },
  { path: 'site', loadComponent: () => import('./pages/home/home').then((m) => m.Home), title: 'The Contrast' },
  { path: 'qr', loadComponent: () => import('./pages/qr/qr').then((m) => m.QrPage), title: 'Booth QR | The Contrast' },
  { path: 'leads', loadComponent: () => import('./pages/leads/leads').then((m) => m.LeadsPage), title: 'Leads | The Contrast' },
  { path: '**', redirectTo: '' },
];

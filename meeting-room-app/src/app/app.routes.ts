import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent) },
    { path: 'register', loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent) },
    { path: 'dashboard', loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [authGuard] },
    { path: 'rooms', loadComponent: () => import('./features/rooms/room-list/room-list.component').then(m => m.RoomListComponent), canActivate: [authGuard] },
    { path: 'bookings/new', loadComponent: () => import('./features/bookings/booking-form/booking-form.component').then(m => m.BookingFormComponent), canActivate: [authGuard] },
    { path: 'bookings/history', loadComponent: () => import('./features/bookings/booking-history/booking-history.component').then(m => m.BookingHistoryComponent), canActivate: [authGuard] },
    { path: 'bookings/schedule/:roomId', loadComponent: () => import('./features/bookings/room-schedule/room-schedule.component').then(m => m.RoomScheduleComponent), canActivate: [authGuard] },
    { path: 'admin', loadComponent: () => import('./features/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent), canActivate: [authGuard, adminGuard] },
    { path: '**', redirectTo: 'login' }
];

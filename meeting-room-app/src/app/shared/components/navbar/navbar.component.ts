import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <nav class="navbar" *ngIf="auth.isLoggedIn">
      <div class="nav-brand">
        <span class="brand-icon">📅</span>
        <span class="brand-text">MeetingRoom</span>
      </div>
      <div class="nav-links">
        <a routerLink="/dashboard" class="nav-link">Dashboard</a>
        <a routerLink="/rooms" class="nav-link">Rooms</a>
        <a routerLink="/bookings/new" class="nav-link">Book Room</a>
        <a routerLink="/bookings/history" class="nav-link">My Bookings</a>
        <a routerLink="/admin" class="nav-link" *ngIf="auth.isAdmin">Admin</a>
      </div>
      <div class="nav-user">
        <span class="user-name">{{ auth.currentUser?.name }}</span>
        <span class="user-role badge">{{ auth.currentUser?.role }}</span>
        <button class="btn-logout" (click)="logout()">Logout</button>
      </div>
    </nav>
  `,
    styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 2rem;
      height: 64px;
      background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
      border-bottom: 1px solid rgba(99, 102, 241, 0.2);
      position: sticky;
      top: 0;
      z-index: 100;
    }
    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .brand-icon { font-size: 1.5rem; }
    .brand-text {
      font-size: 1.25rem;
      font-weight: 700;
      background: linear-gradient(135deg, #818cf8, #c084fc);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .nav-links {
      display: flex;
      gap: 0.25rem;
    }
    .nav-link {
      padding: 0.5rem 1rem;
      color: #94a3b8;
      text-decoration: none;
      border-radius: 8px;
      font-size: 0.9rem;
      transition: all 0.2s;
    }
    .nav-link:hover {
      color: #e2e8f0;
      background: rgba(99, 102, 241, 0.1);
    }
    .nav-user {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-name {
      color: #e2e8f0;
      font-size: 0.9rem;
    }
    .badge {
      padding: 0.2rem 0.6rem;
      border-radius: 12px;
      font-size: 0.7rem;
      text-transform: uppercase;
      font-weight: 600;
      background: rgba(99, 102, 241, 0.2);
      color: #818cf8;
    }
    .btn-logout {
      padding: 0.4rem 1rem;
      border: 1px solid rgba(239, 68, 68, 0.3);
      background: transparent;
      color: #f87171;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.85rem;
      transition: all 0.2s;
    }
    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.1);
    }
  `]
})
export class NavbarComponent {
    constructor(public auth: AuthService, private router: Router) { }

    logout() {
        this.auth.logout();
        this.router.navigate(['/login']);
    }
}

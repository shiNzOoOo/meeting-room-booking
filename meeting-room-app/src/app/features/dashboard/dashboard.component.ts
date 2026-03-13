import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../core/services/room.service';
import { BookingService } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { Room } from '../../core/models/room.model';
import { Booking } from '../../core/models/booking.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="dashboard">
      <div class="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back, <strong>{{ auth.currentUser?.name }}</strong></p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">🏢</div>
          <div class="stat-info">
            <span class="stat-number">{{ rooms.length }}</span>
            <span class="stat-label">Available Rooms</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <span class="stat-number">{{ myBookings.length }}</span>
            <span class="stat-label">My Bookings</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">📅</div>
          <div class="stat-info">
            <span class="stat-number">{{ todayBookings.length }}</span>
            <span class="stat-label">Today's Bookings</span>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <a routerLink="/bookings/new" class="action-btn primary">
          <span>➕</span> Book a Room
        </a>
        <a routerLink="/rooms" class="action-btn secondary">
          <span>🏢</span> View Rooms
        </a>
        <a routerLink="/bookings/history" class="action-btn secondary">
          <span>📜</span> Booking History
        </a>
      </div>

      <div class="section" *ngIf="todayBookings.length > 0">
        <h2>Today's Schedule</h2>
        <div class="booking-list">
          <div class="booking-item" *ngFor="let b of todayBookings">
            <div class="booking-time">
              <span>{{ b.startTime }}</span>
              <span class="time-sep">–</span>
              <span>{{ b.endTime }}</span>
            </div>
            <div class="booking-details">
              <strong>{{ b.title }}</strong>
              <span class="room-badge">{{ b.roomName }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .dashboard { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; font-size: 1rem; }
    .page-header strong { color: #818cf8; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 2rem; }
    .stat-card {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px;
      padding: 1.5rem; display: flex; align-items: center; gap: 1rem;
      transition: transform 0.2s, border-color 0.2s;
    }
    .stat-card:hover { transform: translateY(-2px); border-color: rgba(99, 102, 241, 0.4); }
    .stat-icon { font-size: 2rem; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-number { font-size: 1.75rem; font-weight: 700; color: #f1f5f9; }
    .stat-label { font-size: 0.8rem; color: #94a3b8; margin-top: 0.1rem; }
    .quick-actions { display: flex; gap: 1rem; margin-bottom: 2rem; flex-wrap: wrap; }
    .action-btn {
      padding: 0.75rem 1.5rem; border-radius: 10px; text-decoration: none;
      font-weight: 600; font-size: 0.9rem; display: flex; align-items: center; gap: 0.5rem;
      transition: all 0.2s;
    }
    .action-btn.primary { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; }
    .action-btn.primary:hover { box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3); transform: translateY(-1px); }
    .action-btn.secondary { background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(99, 102, 241, 0.2); color: #cbd5e1; }
    .action-btn.secondary:hover { border-color: #818cf8; color: #f1f5f9; }
    .section h2 { color: #f1f5f9; font-size: 1.25rem; margin-bottom: 1rem; }
    .booking-list { display: flex; flex-direction: column; gap: 0.75rem; }
    .booking-item {
      display: flex; align-items: center; gap: 1.5rem;
      background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(99, 102, 241, 0.1);
      border-radius: 10px; padding: 1rem 1.25rem;
    }
    .booking-time { color: #818cf8; font-weight: 600; font-size: 0.9rem; white-space: nowrap; }
    .time-sep { margin: 0 0.25rem; color: #475569; }
    .booking-details { display: flex; align-items: center; gap: 0.75rem; }
    .booking-details strong { color: #e2e8f0; font-size: 0.95rem; }
    .room-badge {
      padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem;
      background: rgba(99, 102, 241, 0.15); color: #a5b4fc;
    }
  `]
})
export class DashboardComponent implements OnInit {
    rooms: Room[] = [];
    myBookings: Booking[] = [];
    todayBookings: Booking[] = [];

    constructor(
        public auth: AuthService,
        private roomService: RoomService,
        private bookingService: BookingService
    ) { }

    ngOnInit() {
        this.roomService.getActiveRooms().subscribe(rooms => this.rooms = rooms);
        this.bookingService.getMyHistory().subscribe(bookings => {
            this.myBookings = bookings;
            const today = new Date().toISOString().split('T')[0];
            this.todayBookings = bookings.filter(b => b.bookingDate === today);
        });
    }
}

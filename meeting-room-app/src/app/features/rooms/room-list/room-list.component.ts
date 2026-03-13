import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { AuthService } from '../../../core/services/auth.service';
import { Room } from '../../../core/models/room.model';

@Component({
    selector: 'app-room-list',
    standalone: true,
    imports: [CommonModule, RouterLink],
    template: `
    <div class="rooms-page">
      <div class="page-header">
        <h1>Meeting Rooms</h1>
        <p>Browse available rooms and view schedules</p>
      </div>

      <div class="rooms-grid">
        <div class="room-card" *ngFor="let room of rooms" [class.inactive]="!room.isActive">
          <div class="room-header">
            <span class="room-icon">🏢</span>
            <span class="status-badge" [class.active]="room.isActive">
              {{ room.isActive ? 'Active' : 'Inactive' }}
            </span>
          </div>
          <h3>{{ room.name }}</h3>
          <div class="room-meta">
            <span class="capacity">👥 {{ room.capacity }} people</span>
          </div>
          <div class="room-actions">
            <a [routerLink]="['/bookings/schedule', room.id]" class="btn-outline">View Schedule</a>
            <a routerLink="/bookings/new" class="btn-book">Book Now</a>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="rooms.length === 0">
        <span class="empty-icon">🏢</span>
        <p>No rooms available</p>
      </div>
    </div>
  `,
    styles: [`
    .rooms-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; }
    .rooms-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 1.25rem; }
    .room-card {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px;
      padding: 1.5rem; transition: all 0.2s;
    }
    .room-card:hover { transform: translateY(-3px); border-color: rgba(99, 102, 241, 0.4); box-shadow: 0 12px 30px rgba(0,0,0,0.2); }
    .room-card.inactive { opacity: 0.5; }
    .room-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem; }
    .room-icon { font-size: 1.5rem; }
    .status-badge {
      padding: 0.2rem 0.6rem; border-radius: 8px; font-size: 0.7rem;
      text-transform: uppercase; font-weight: 600;
      background: rgba(239, 68, 68, 0.15); color: #f87171;
    }
    .status-badge.active { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
    .room-card h3 { color: #f1f5f9; font-size: 1.2rem; margin: 0 0 0.75rem; }
    .room-meta { margin-bottom: 1.25rem; }
    .capacity { color: #94a3b8; font-size: 0.85rem; }
    .room-actions { display: flex; gap: 0.75rem; }
    .btn-outline {
      flex: 1; padding: 0.5rem; text-align: center; border: 1px solid rgba(99, 102, 241, 0.3);
      background: transparent; color: #a5b4fc; border-radius: 8px; text-decoration: none;
      font-size: 0.85rem; font-weight: 500; transition: all 0.2s;
    }
    .btn-outline:hover { background: rgba(99, 102, 241, 0.1); border-color: #818cf8; }
    .btn-book {
      flex: 1; padding: 0.5rem; text-align: center;
      background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
      border-radius: 8px; text-decoration: none; font-size: 0.85rem; font-weight: 600;
      transition: all 0.2s;
    }
    .btn-book:hover { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
    .empty-state { text-align: center; padding: 4rem 0; color: #94a3b8; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
  `]
})
export class RoomListComponent implements OnInit {
    rooms: Room[] = [];

    constructor(private roomService: RoomService, public auth: AuthService) { }

    ngOnInit() {
        this.roomService.getActiveRooms().subscribe(rooms => this.rooms = rooms);
    }
}

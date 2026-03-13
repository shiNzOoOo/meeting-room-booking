import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RoomService } from '../../../core/services/room.service';
import { BookingService } from '../../../core/services/booking.service';
import { Room, CreateUpdateRoom } from '../../../core/models/room.model';
import { Booking } from '../../../core/models/booking.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="admin-page">
      <div class="page-header">
        <h1>Admin Dashboard</h1>
        <p>Manage rooms, bookings, and monitor schedules</p>
      </div>

      <!-- Tabs -->
      <div class="tabs">
        <button class="tab" [class.active]="activeTab === 'rooms'" (click)="activeTab = 'rooms'">🏢 Manage Rooms</button>
        <button class="tab" [class.active]="activeTab === 'bookings'" (click)="activeTab = 'bookings'">📋 All Bookings</button>
        <button class="tab" [class.active]="activeTab === 'users'" (click)="activeTab = 'users'; loadUsers()">👥 Users</button>
      </div>

      <!-- Rooms Tab -->
      <div *ngIf="activeTab === 'rooms'" class="tab-content">
        <div class="section-header">
          <h2>Rooms</h2>
          <button class="btn-add" (click)="showRoomForm = !showRoomForm; editingRoom = null; resetRoomForm()">
            {{ showRoomForm ? 'Cancel' : '+ Add Room' }}
          </button>
        </div>

        <div class="form-card" *ngIf="showRoomForm">
          <h3>{{ editingRoom ? 'Edit Room' : 'Add New Room' }}</h3>
          <form [formGroup]="roomForm" (ngSubmit)="saveRoom()">
            <div class="form-row">
              <div class="form-group">
                <label>Room Name</label>
                <input type="text" formControlName="name" placeholder="e.g., Conference Room A">
              </div>
              <div class="form-group">
                <label>Capacity</label>
                <input type="number" formControlName="capacity" placeholder="e.g., 10">
              </div>
            </div>
            <div class="form-group checkbox-group">
              <label><input type="checkbox" formControlName="isActive"> Active</label>
            </div>
            <div class="error-message" *ngIf="roomError">{{ roomError }}</div>
            <button type="submit" class="btn-primary" [disabled]="roomForm.invalid">
              {{ editingRoom ? 'Update Room' : 'Add Room' }}
            </button>
          </form>
        </div>

        <div class="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Capacity</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let room of rooms">
                <td><strong>{{ room.name }}</strong></td>
                <td>{{ room.capacity }}</td>
                <td>
                  <span class="status-badge" [class.active]="room.isActive">
                    {{ room.isActive ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td>
                  <button class="btn-edit" (click)="editRoom(room)">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Bookings Tab -->
      <div *ngIf="activeTab === 'bookings'" class="tab-content">
        <h2>All Bookings</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Title</th><th>Room</th><th>User</th><th>Date</th><th>Time</th><th>Actions</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let b of bookings">
                <td><strong>{{ b.title }}</strong></td>
                <td><span class="room-badge">{{ b.roomName }}</span></td>
                <td>{{ b.userName }}</td>
                <td>{{ b.bookingDate }}</td>
                <td>{{ b.startTime }} – {{ b.endTime }}</td>
                <td>
                  <button class="btn-delete" (click)="deleteBooking(b.id)">Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="empty-state" *ngIf="bookings.length === 0">
          <p>No bookings yet.</p>
        </div>
      </div>

      <!-- Users Tab -->
      <div *ngIf="activeTab === 'users'" class="tab-content">
        <h2>Registered Users</h2>
        <div class="table-container">
          <table>
            <thead>
              <tr><th>Name</th><th>Email</th><th>Role</th><th>Registered</th></tr>
            </thead>
            <tbody>
              <tr *ngFor="let u of users">
                <td><strong>{{ u.name }}</strong></td>
                <td>{{ u.email }}</td>
                <td><span class="role-badge">{{ u.role }}</span></td>
                <td>{{ u.createdAt | date:'mediumDate' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .admin-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; }
    .tabs { display: flex; gap: 0.5rem; margin-bottom: 1.5rem; }
    .tab {
      padding: 0.6rem 1.25rem; background: rgba(30, 41, 59, 0.5);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 10px;
      color: #94a3b8; cursor: pointer; font-size: 0.9rem; transition: all 0.2s;
    }
    .tab.active { background: rgba(99, 102, 241, 0.15); color: #a5b4fc; border-color: rgba(99, 102, 241, 0.4); }
    .tab:hover { color: #e2e8f0; }
    .tab-content h2 { color: #f1f5f9; margin-bottom: 1rem; font-size: 1.25rem; }
    .section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
    .btn-add {
      padding: 0.5rem 1.25rem; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 8px; color: white; font-weight: 600;
      cursor: pointer; font-size: 0.85rem; transition: all 0.2s;
    }
    .btn-add:hover { box-shadow: 0 4px 15px rgba(99, 102, 241, 0.3); }
    .form-card {
      background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 14px; padding: 1.5rem; margin-bottom: 1.5rem;
    }
    .form-card h3 { color: #f1f5f9; margin: 0 0 1rem; font-size: 1.1rem; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1rem; }
    .form-group label { display: block; color: #cbd5e1; font-size: 0.85rem; margin-bottom: 0.4rem; font-weight: 500; }
    .form-group input[type="text"], .form-group input[type="number"] {
      width: 100%; padding: 0.6rem 0.75rem; background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px;
      color: #e2e8f0; font-size: 0.9rem; outline: none; box-sizing: border-box;
    }
    .form-group input:focus { border-color: #818cf8; }
    .checkbox-group label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .checkbox-group input[type="checkbox"] { accent-color: #818cf8; }
    .error-message {
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; padding: 0.6rem; border-radius: 8px; font-size: 0.85rem; margin-bottom: 1rem;
    }
    .btn-primary {
      padding: 0.6rem 1.5rem; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 8px; color: white; font-weight: 600;
      cursor: pointer; font-size: 0.9rem;
    }
    .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
    .table-container {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px; overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th {
      background: rgba(15, 23, 42, 0.5); color: #94a3b8; font-size: 0.8rem;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 0.85rem 1.25rem; text-align: left; font-weight: 600;
    }
    td { padding: 0.85rem 1.25rem; color: #e2e8f0; font-size: 0.9rem; border-top: 1px solid rgba(99, 102, 241, 0.08); }
    tr:hover td { background: rgba(99, 102, 241, 0.04); }
    .status-badge {
      padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.7rem;
      font-weight: 600; text-transform: uppercase;
      background: rgba(239, 68, 68, 0.15); color: #f87171;
    }
    .status-badge.active { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
    .room-badge { padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; background: rgba(99, 102, 241, 0.15); color: #a5b4fc; }
    .role-badge { padding: 0.2rem 0.5rem; border-radius: 6px; font-size: 0.75rem; background: rgba(168, 85, 247, 0.15); color: #c084fc; text-transform: uppercase; }
    .btn-edit {
      padding: 0.3rem 0.75rem; background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.3);
      color: #a5b4fc; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s;
    }
    .btn-edit:hover { background: rgba(99, 102, 241, 0.25); }
    .btn-delete {
      padding: 0.3rem 0.75rem; background: rgba(239, 68, 68, 0.15); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; border-radius: 6px; cursor: pointer; font-size: 0.8rem; transition: all 0.2s;
    }
    .btn-delete:hover { background: rgba(239, 68, 68, 0.25); }
    .empty-state { text-align: center; padding: 3rem 0; color: #94a3b8; }
  `]
})
export class AdminDashboardComponent implements OnInit {
    activeTab = 'rooms';
    rooms: Room[] = [];
    bookings: Booking[] = [];
    users: any[] = [];
    showRoomForm = false;
    editingRoom: Room | null = null;
    roomForm: FormGroup;
    roomError = '';

    constructor(
        private fb: FormBuilder,
        private roomService: RoomService,
        private bookingService: BookingService
    ) {
        this.roomForm = this.fb.group({
            name: ['', Validators.required],
            capacity: [1, [Validators.required, Validators.min(1)]],
            isActive: [true]
        });
    }

    ngOnInit() {
        this.loadRooms();
        this.loadBookings();
    }

    loadRooms() {
        this.roomService.getAllRooms().subscribe(rooms => this.rooms = rooms);
    }

    loadBookings() {
        this.bookingService.getAllBookings().subscribe(bookings => this.bookings = bookings);
    }

    loadUsers() {
        const http = (this.roomService as any).http;
        http.get('http://localhost:5158/api/admin/users').subscribe((users: any[]) => this.users = users);
    }

    resetRoomForm() {
        this.roomForm.reset({ name: '', capacity: 1, isActive: true });
        this.roomError = '';
    }

    editRoom(room: Room) {
        this.editingRoom = room;
        this.showRoomForm = true;
        this.roomForm.patchValue({ name: room.name, capacity: room.capacity, isActive: room.isActive });
    }

    saveRoom() {
        if (this.roomForm.invalid) return;
        this.roomError = '';
        const dto: CreateUpdateRoom = this.roomForm.value;

        if (this.editingRoom) {
            this.roomService.updateRoom(this.editingRoom.id, dto).subscribe({
                next: () => { this.loadRooms(); this.showRoomForm = false; this.editingRoom = null; },
                error: (err) => this.roomError = err.error?.message || 'Update failed.'
            });
        } else {
            this.roomService.createRoom(dto).subscribe({
                next: () => { this.loadRooms(); this.showRoomForm = false; },
                error: (err) => this.roomError = err.error?.message || 'Failed to create room.'
            });
        }
    }

    deleteBooking(id: number) {
        if (confirm('Are you sure you want to delete this booking?')) {
            this.bookingService.deleteBooking(id).subscribe(() => this.loadBookings());
        }
    }
}

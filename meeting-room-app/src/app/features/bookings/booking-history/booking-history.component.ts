import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../core/models/booking.model';

@Component({
    selector: 'app-booking-history',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="history-page">
      <div class="page-header">
        <h1>My Booking History</h1>
        <p>View all your meeting room bookings</p>
      </div>

      <div class="table-container" *ngIf="bookings.length > 0">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Room</th>
              <th>Date</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let b of bookings">
              <td><strong>{{ b.title }}</strong></td>
              <td><span class="room-badge">{{ b.roomName }}</span></td>
              <td>{{ b.bookingDate }}</td>
              <td>{{ b.startTime }}</td>
              <td>{{ b.endTime }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="empty-state" *ngIf="bookings.length === 0">
        <span class="empty-icon">📋</span>
        <p>No bookings yet. <a routerLink="/bookings/new">Book a room</a> to get started!</p>
      </div>
    </div>
  `,
    styles: [`
    .history-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; }
    .table-container {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px;
      overflow: hidden;
    }
    table { width: 100%; border-collapse: collapse; }
    th {
      background: rgba(15, 23, 42, 0.5); color: #94a3b8; font-size: 0.8rem;
      text-transform: uppercase; letter-spacing: 0.05em;
      padding: 0.85rem 1.25rem; text-align: left; font-weight: 600;
    }
    td { padding: 1rem 1.25rem; color: #e2e8f0; font-size: 0.9rem; border-top: 1px solid rgba(99, 102, 241, 0.08); }
    tr:hover td { background: rgba(99, 102, 241, 0.04); }
    .room-badge {
      padding: 0.2rem 0.6rem; border-radius: 6px; font-size: 0.75rem;
      background: rgba(99, 102, 241, 0.15); color: #a5b4fc;
    }
    .empty-state { text-align: center; padding: 4rem 0; color: #94a3b8; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .empty-state a { color: #818cf8; text-decoration: none; }
  `]
})
export class BookingHistoryComponent implements OnInit {
    bookings: Booking[] = [];

    constructor(private bookingService: BookingService) { }

    ngOnInit() {
        this.bookingService.getMyHistory().subscribe(bookings => this.bookings = bookings);
    }
}

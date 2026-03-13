import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { BookingSchedule } from '../../../core/models/booking.model';

@Component({
    selector: 'app-room-schedule',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="schedule-page">
      <div class="page-header">
        <h1>Room Schedule</h1>
        <p *ngIf="schedule">{{ schedule.roomName }} — {{ schedule.date }}</p>
      </div>

      <div class="date-picker-card">
        <label for="scheduleDate">Select Date:</label>
        <input id="scheduleDate" type="date" [formControl]="dateControl" (change)="loadSchedule()">
      </div>

      <div class="timeline" *ngIf="schedule && schedule.bookings.length > 0">
        <div class="timeline-item" *ngFor="let b of schedule.bookings">
          <div class="time-block">
            <span class="time-start">{{ b.startTime }}</span>
            <div class="time-line"></div>
            <span class="time-end">{{ b.endTime }}</span>
          </div>
          <div class="booking-block">
            <strong>{{ b.title }}</strong>
            <span class="booked-by">by {{ b.userName }}</span>
          </div>
        </div>
      </div>

      <div class="empty-state" *ngIf="schedule && schedule.bookings.length === 0">
        <span class="empty-icon">✅</span>
        <p>No bookings for this date. The room is available!</p>
      </div>
    </div>
  `,
    styles: [`
    .schedule-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 1.5rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; }
    .date-picker-card {
      display: flex; align-items: center; gap: 1rem;
      background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(99, 102, 241, 0.15);
      border-radius: 12px; padding: 1rem 1.5rem; margin-bottom: 2rem;
    }
    .date-picker-card label { color: #cbd5e1; font-weight: 500; font-size: 0.9rem; }
    .date-picker-card input {
      padding: 0.5rem 1rem; background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 8px;
      color: #e2e8f0; font-size: 0.9rem; outline: none;
    }
    .date-picker-card input:focus { border-color: #818cf8; }
    .timeline { display: flex; flex-direction: column; gap: 1rem; }
    .timeline-item {
      display: flex; gap: 1.5rem;
      background: rgba(30, 41, 59, 0.5); border: 1px solid rgba(99, 102, 241, 0.1);
      border-radius: 12px; padding: 1.25rem;
    }
    .time-block {
      display: flex; flex-direction: column; align-items: center; min-width: 70px;
    }
    .time-start, .time-end { color: #818cf8; font-weight: 600; font-size: 0.85rem; }
    .time-line { width: 2px; height: 20px; background: rgba(99, 102, 241, 0.3); margin: 0.25rem 0; }
    .booking-block { display: flex; flex-direction: column; gap: 0.25rem; }
    .booking-block strong { color: #f1f5f9; font-size: 1rem; }
    .booked-by { color: #94a3b8; font-size: 0.8rem; }
    .empty-state { text-align: center; padding: 4rem 0; color: #94a3b8; }
    .empty-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
  `]
})
export class RoomScheduleComponent implements OnInit {
    schedule: BookingSchedule | null = null;
    roomId = 0;
    dateControl: FormControl;

    constructor(private route: ActivatedRoute, private bookingService: BookingService) {
        this.dateControl = new FormControl(new Date().toISOString().split('T')[0]);
    }

    ngOnInit() {
        this.roomId = +this.route.snapshot.paramMap.get('roomId')!;
        this.loadSchedule();
    }

    loadSchedule() {
        const date = this.dateControl.value;
        if (!date || !this.roomId) return;
        this.bookingService.getRoomSchedule(this.roomId, date).subscribe({
            next: (schedule) => this.schedule = schedule,
            error: () => this.schedule = null
        });
    }
}

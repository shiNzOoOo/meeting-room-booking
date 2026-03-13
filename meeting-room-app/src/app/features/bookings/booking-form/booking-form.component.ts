import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RoomService } from '../../../core/services/room.service';
import { BookingService } from '../../../core/services/booking.service';
import { Room } from '../../../core/models/room.model';

@Component({
    selector: 'app-booking-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="booking-page">
      <div class="page-header">
        <h1>Book a Meeting Room</h1>
        <p>Select a room, date, and time to make a booking</p>
      </div>

      <div class="booking-card">
        <form [formGroup]="bookingForm" (ngSubmit)="onSubmit()">
          <div class="form-row">
            <div class="form-group">
              <label for="roomId">Meeting Room</label>
              <select id="roomId" formControlName="roomId">
                <option value="">Select a room</option>
                <option *ngFor="let room of rooms" [value]="room.id">
                  {{ room.name }} (Capacity: {{ room.capacity }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="bookingDate">Date</label>
              <input id="bookingDate" type="date" formControlName="bookingDate">
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startTime">Start Time</label>
              <input id="startTime" type="time" formControlName="startTime">
            </div>
            <div class="form-group">
              <label for="endTime">End Time</label>
              <input id="endTime" type="time" formControlName="endTime">
            </div>
          </div>

          <div class="form-group">
            <label for="title">Meeting Title</label>
            <input id="title" type="text" formControlName="title" placeholder="e.g., Sprint Planning">
          </div>

          <div class="success-message" *ngIf="successMessage">{{ successMessage }}</div>
          <div class="error-message" *ngIf="errorMessage">{{ errorMessage }}</div>

          <button type="submit" class="btn-primary" [disabled]="bookingForm.invalid || loading">
            {{ loading ? 'Booking...' : 'Confirm Booking' }}
          </button>
        </form>
      </div>
    </div>
  `,
    styles: [`
    .booking-page { animation: fadeIn 0.3s ease; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .page-header { margin-bottom: 2rem; }
    .page-header h1 { color: #f1f5f9; font-size: 2rem; margin: 0 0 0.25rem; }
    .page-header p { color: #94a3b8; }
    .booking-card {
      background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(10px);
      border: 1px solid rgba(99, 102, 241, 0.15); border-radius: 14px;
      padding: 2rem; max-width: 600px;
    }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .form-group { margin-bottom: 1.25rem; }
    .form-group label { display: block; color: #cbd5e1; font-size: 0.85rem; margin-bottom: 0.4rem; font-weight: 500; }
    .form-group input, .form-group select {
      width: 100%; padding: 0.75rem 1rem; background: rgba(15, 23, 42, 0.6);
      border: 1px solid rgba(99, 102, 241, 0.2); border-radius: 10px;
      color: #e2e8f0; font-size: 0.95rem; outline: none; transition: border-color 0.2s; box-sizing: border-box;
    }
    .form-group input:focus, .form-group select:focus { border-color: #818cf8; }
    .form-group select option { background: #1e293b; color: #e2e8f0; }
    .success-message {
      background: rgba(34, 197, 94, 0.1); border: 1px solid rgba(34, 197, 94, 0.3);
      color: #4ade80; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem;
      margin-bottom: 1rem; text-align: center;
    }
    .error-message {
      background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171; padding: 0.75rem; border-radius: 8px; font-size: 0.85rem;
      margin-bottom: 1rem; text-align: center;
    }
    .btn-primary {
      width: 100%; padding: 0.8rem; background: linear-gradient(135deg, #6366f1, #8b5cf6);
      border: none; border-radius: 10px; color: white; font-size: 1rem;
      font-weight: 600; cursor: pointer; transition: all 0.3s;
    }
    .btn-primary:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 8px 25px rgba(99, 102, 241, 0.3); }
    .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
  `]
})
export class BookingFormComponent implements OnInit {
    bookingForm: FormGroup;
    rooms: Room[] = [];
    loading = false;
    errorMessage = '';
    successMessage = '';

    constructor(
        private fb: FormBuilder,
        private roomService: RoomService,
        private bookingService: BookingService,
        private router: Router
    ) {
        const today = new Date().toISOString().split('T')[0];
        this.bookingForm = this.fb.group({
            roomId: ['', Validators.required],
            bookingDate: [today, Validators.required],
            startTime: ['', Validators.required],
            endTime: ['', Validators.required],
            title: ['', [Validators.required, Validators.maxLength(200)]]
        });
    }

    ngOnInit() {
        this.roomService.getActiveRooms().subscribe(rooms => this.rooms = rooms);
    }

    onSubmit() {
        if (this.bookingForm.invalid) return;
        this.loading = true;
        this.errorMessage = '';
        this.successMessage = '';

        const val = this.bookingForm.value;
        const payload = {
            roomId: +val.roomId,
            bookingDate: val.bookingDate,
            startTime: val.startTime + ':00',
            endTime: val.endTime + ':00',
            title: val.title
        };

        this.bookingService.createBooking(payload).subscribe({
            next: () => {
                this.loading = false;
                this.successMessage = 'Room booked successfully!';
                this.bookingForm.reset();
                setTimeout(() => this.router.navigate(['/bookings/history']), 1500);
            },
            error: (err) => {
                this.loading = false;
                this.errorMessage = err.error?.message || 'Booking failed. The time slot may overlap with an existing booking.';
            }
        });
    }
}

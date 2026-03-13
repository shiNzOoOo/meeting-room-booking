import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking, CreateBooking, BookingSchedule } from '../models/booking.model';

@Injectable({ providedIn: 'root' })
export class BookingService {
    private apiUrl = 'http://localhost:5158/api/bookings';
    private adminUrl = 'http://localhost:5158/api/admin';

    constructor(private http: HttpClient) { }

    createBooking(booking: CreateBooking): Observable<Booking> {
        return this.http.post<Booking>(this.apiUrl, booking);
    }

    getMyHistory(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.apiUrl}/my-history`);
    }

    getRoomSchedule(roomId: number, date: string): Observable<BookingSchedule> {
        const params = new HttpParams().set('date', date);
        return this.http.get<BookingSchedule>(`${this.apiUrl}/room/${roomId}`, { params });
    }

    getAllBookings(): Observable<Booking[]> {
        return this.http.get<Booking[]>(`${this.adminUrl}/bookings`);
    }

    deleteBooking(id: number): Observable<any> {
        return this.http.delete(`${this.adminUrl}/bookings/${id}`);
    }
}

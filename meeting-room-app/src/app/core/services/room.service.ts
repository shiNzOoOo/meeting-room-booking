import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Room, CreateUpdateRoom } from '../models/room.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
    private apiUrl = 'http://localhost:5158/api/rooms';
    private adminUrl = 'http://localhost:5158/api/admin';

    constructor(private http: HttpClient) { }

    getActiveRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(this.apiUrl);
    }

    getRoomById(id: number): Observable<Room> {
        return this.http.get<Room>(`${this.apiUrl}/${id}`);
    }

    createRoom(room: CreateUpdateRoom): Observable<Room> {
        return this.http.post<Room>(this.apiUrl, room);
    }

    updateRoom(id: number, room: CreateUpdateRoom): Observable<Room> {
        return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
    }

    getAllRooms(): Observable<Room[]> {
        return this.http.get<Room[]>(`${this.adminUrl}/rooms`);
    }
}

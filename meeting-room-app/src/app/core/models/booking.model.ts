export interface Booking {
    id: number;
    roomId: number;
    roomName: string;
    userId: number;
    userName: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    title: string;
    createdAt?: string;
}

export interface CreateBooking {
    roomId: number;
    bookingDate: string;
    startTime: string;
    endTime: string;
    title: string;
}

export interface BookingSchedule {
    date: string;
    roomName: string;
    bookings: Booking[];
}

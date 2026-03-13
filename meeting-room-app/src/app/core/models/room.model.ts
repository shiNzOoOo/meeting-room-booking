export interface Room {
    id: number;
    name: string;
    capacity: number;
    isActive: boolean;
    createdAt?: string;
}

export interface CreateUpdateRoom {
    name: string;
    capacity: number;
    isActive: boolean;
}

import dayjs, { Dayjs } from 'dayjs';

export interface GlobalService {
    id: number;
    name: string;
    description: String;
}

export interface MainService {
    id: number;
    description: string;
    subServices: SubService[];
    globalService: GlobalService;
    providerId: number;
}

export interface NewMainService {
    id: number | null;
    description: string;
    subServices: SubService[];
    globalService: GlobalService;
    providerId: number;
}

export interface SubService {
    id: number;
    name: string;
    duration: string;
    price: string;
}

export interface Provider extends User{
    businessAddress: string;
}

export interface User {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    bio: string;
}


export interface Appointment {
    id: number | null;
    date: Dayjs;
    customerId: number;
    providerId: number;
    subServiceId: number;
}

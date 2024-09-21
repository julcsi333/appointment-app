import dayjs, { Dayjs } from 'dayjs';

export interface MainService {
    id: number;
    name: string;
    subServices: SubService[];
}


export interface SubService {
    id: number;
    name: string;
    duration: string;
    price: string;
    portfolioImageUrls: string[];
}

export interface Provider extends User{
    businessAddress: string;
    services: MainService[]
}

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    profileImageUrl: string;
    bio: string;
}


export interface Appointment {
    date: Dayjs;
    serviceId: string;
    customerId: string;
}

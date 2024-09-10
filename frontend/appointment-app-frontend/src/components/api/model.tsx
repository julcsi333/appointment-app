import dayjs, { Dayjs } from 'dayjs';

export interface Provider {
    id: string;
    name: string;
    businessAddress: string;
    phoneNumber: string;
    imageUrl: string;
}

export interface User {
    id: string;
    name: string;
    phoneNumber: string;
    email: string;
    profilePicture: string;
    bio: string;
}


export interface Appointment {
    date: Dayjs;
    serviceId: string;
    customerId: string;
}

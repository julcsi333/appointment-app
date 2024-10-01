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
    duration: number;
    price: number;
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

export class EditedSubService {
    id: number | null;
    name: string;
    duration: string;
    price: string;
    errors: SubServiceError = new SubServiceError();
    isValid: boolean = false
    constructor(id: number | null, name: string, duration: string, price: string) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.price = price;
    }
    validate(): void {
        this.isValid = this.validateName() && this.validateDuration() && this.validatePrice()
    }
    private validateName(): boolean {
        if (this.name.trim()  === "") {
            this.errors.name = "Name is required"
            return false
        }
        return true
    }
    private validateDuration(): boolean {
        const trimmed = this.duration.trim()
        if (trimmed  === "") {
            this.errors.duration = "Duration is required"
            return false
        }
        const duration = parseInt(trimmed)
        if (Number.isInteger(duration)|| duration >= 180) {
            this.errors.duration = "Duration is required"
        } else if (duration <= 0 ) {
            this.errors.duration = "Duration should be greater than 0 minutes"
        } else if (duration > 180) {
            this.errors.duration = "Duration should be less than 180 minutes"
        } else {
            return true
        }
        return false
    }
    private validatePrice(): boolean {
        if (this.name.trim()  === "") {
            this.errors.name = "Price is required"
            return false
        }
        return true
    }
}

export class SubServiceError {
    name: string = "";
    duration: string = "";
    price: string = "";
}
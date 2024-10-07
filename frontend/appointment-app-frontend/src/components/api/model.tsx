import { DayPilot } from '@daypilot/daypilot-lite-react';
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

export interface NewSubService {
    id: number | null;
    name: string;
    duration: number;
    price: number;
}

export class User {
    id: number;
    name: string;
    phoneNumber: string;
    email: string;
    bio: string;
    constructor(id: number, name: string, phoneNumber: string, email: string, bio: string) {
        this.id = id;
        this.name = name;
        this.phoneNumber = phoneNumber;
        this.email = email;
        this.bio = bio;
    }
}

export class Provider extends User{
    businessAddress: string;
    constructor(id: number, name: string, phoneNumber: string, email: string, bio: string, businessAddress: string) {
        super(id, name, phoneNumber, email, bio)
        this.businessAddress = businessAddress;
    }
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
    constructor(id: number | null, name: string, duration: string, price: string, isValid: boolean = false, errors: SubServiceError = new SubServiceError()) {
        this.id = id;
        this.name = name;
        this.duration = duration;
        this.price = price;
        this.isValid = isValid;
        this.errors.name = errors.name;
        this.errors.duration = errors.duration;
        this.errors.price = errors.price;
    }
    validate(): void {
        this.isValid = this.validateName()
        this.isValid = this.validateDuration() && this.isValid
        this.isValid = this.validatePrice() && this.isValid
    }
    private validateName(): boolean {
        if (this.name.trim()  === "") {
            this.errors.name = "Name is required"
            return false
        }
        return true
    }
    private validateDuration(): boolean {
        if (this.duration === null || this.duration === undefined || this.duration.trim()  === "") {
            this.errors.duration = "Duration is required"
            return false
        }
        const duration = parseInt(this.duration.trim())
        if (!Number.isInteger(duration)) {
            this.errors.duration = "Duration should be a number"
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
        if (this.price === null || this.price === undefined || this.price.trim()  === "") {
            this.errors.price = "Price is required"
            return false
        }
        const price = parseFloat(this.price.trim())
        if (isNaN(price)) {
            this.errors.price = "Price should be a number"
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

export interface AppointmentEvent {
    start: DayPilot.Date;
    end: DayPilot.Date;
    id: String;
    providerId: string;
    customerId: string;
    serviceId: string;
}

/*export enum AvailableEventType {
    SINGLE = 1,
    RULE = 2
}*/

export interface AvailableEvent {
    //type: AvailableEventType;
    start: DayPilot.Date;
    end: DayPilot.Date;
    id: string | null;
    providerId: string;
    repeatEveryWeek: boolean;
    repeatMonthsCount: number | null;
}

export interface AvailableEventData extends DayPilot.EventData {
    //type: AvailableEventType;
    start: DayPilot.Date;
    end: DayPilot.Date;
    id: string | number;
    providerId: string;
    repeatEveryWeek: boolean;
    repeatMonthsCount: number | null;
}
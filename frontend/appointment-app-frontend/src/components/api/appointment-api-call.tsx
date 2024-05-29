import { secureApiPostCall } from "./api-call";
import { Appointment, User } from "./model";


export const bookAppointment = async (provider_id: string, appointment: Appointment, token: string ): Promise<User> => {
    const response = await secureApiPostCall(`http://localhost:8080/book/${provider_id}`, JSON.stringify(appointment), token);
    return response.data;
};
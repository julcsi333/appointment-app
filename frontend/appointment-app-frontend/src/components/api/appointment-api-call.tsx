import { getBaseUrl } from "../../config";
import { secureApiPostCall } from "./api-call";
import { Appointment, User } from "./model";


export const bookAppointment = async (provider_id: number, appointment: Appointment, token: string ): Promise<User> => {
    const response = await secureApiPostCall(`${getBaseUrl()}/book/${provider_id.toString()}`, JSON.stringify(appointment), token);
    return response.data;
};
import { getBaseUrl } from "../../config/config";
import { secureApiDeleteCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { Appointment, NewAppointment } from "./model";


export const bookAppointment = async (appointment: NewAppointment, token: string ): Promise<Appointment> => {
    const response = await secureApiPostCall(`${getBaseUrl()}/book`, JSON.stringify(appointment), token);
    return response.data;
};

export const modifyAppointment = async (appointment: Appointment, token: string ): Promise<Appointment> => {
    const response = await secureApiPutCall(`${getBaseUrl()}/book/${appointment.id!.toString()}`, JSON.stringify(appointment), token);
    return response.data;
};

export const deleteAppointment = async (id: number, token: string ): Promise<Appointment> => {
    const response = await secureApiDeleteCall(`${getBaseUrl()}/book/${id.toString()}`, token);
    return response.data;
};
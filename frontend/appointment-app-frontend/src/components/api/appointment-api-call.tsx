import { getBaseUrl } from "../../config/config";
import { apiGetCall, secureApiDeleteCall, secureApiPostCall, secureApiPutCall } from "./api-call";
import { Appointment, NewAppointment } from "./model";

export const getAppointments = async (userId: number): Promise<Appointment[]> => {
    const response = await apiGetCall(`${getBaseUrl()}/appointments/customer/${userId}`);
    return response.data;
};

export const getHostedAppointments = async (userId: number): Promise<Appointment[]> => {
    const response = await apiGetCall(`${getBaseUrl()}/appointments/provider/${userId}`);
    return response.data;
};

export const bookAppointment = async (appointment: NewAppointment, token: string ): Promise<Appointment> => {
    const response = await secureApiPostCall(`${getBaseUrl()}/appointments/book`, JSON.stringify(appointment), token);
    return response.data;
};

export const modifyAppointment = async (appointment: Appointment, token: string ): Promise<Appointment> => {
    const response = await secureApiPutCall(`${getBaseUrl()}/appointments/${appointment.id!.toString()}`, JSON.stringify(appointment), token);
    return response.data;
};

export const deleteAppointment = async (id: number, customerCancelled: boolean, token: string): Promise<Appointment> => {
    const response = await secureApiDeleteCall(`${getBaseUrl()}/appointments/${id.toString()}?customerCancelled=${customerCancelled}`, token);
    return response.data;
};
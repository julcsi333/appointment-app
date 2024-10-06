import { User } from "./model";
import { secureApiFileUploadCall, secureApiGetCall } from "./api-call";
import { getBaseUrl } from "../../config";

export const getUser = async (id: string, token: string): Promise<User> => {
    const response = await secureApiGetCall(`${getBaseUrl()}/users/${id}`, token);
    return response.data;
};

export const getUserByExternalId = async (id: string, token: string): Promise<User> => {
    const response = await secureApiGetCall(`${getBaseUrl()}/users/auth/${id}`, token);
    return response.data;
};

export const uploadProfilePicture = async (id: string, file: File, token: string) => {
    await secureApiFileUploadCall(`${getBaseUrl()}/users/${id}/profile-picture`, file, token);
};
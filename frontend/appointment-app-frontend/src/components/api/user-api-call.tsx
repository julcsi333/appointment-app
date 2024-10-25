import { User } from "./model";
import { secureApiFileUploadCall, secureApiGetCall, secureApiPutCall } from "./api-call";
import { getBaseUrl } from "../../config/config";

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

export const updateUser = async (user: User, token: string): Promise<User> => {
    const response = await secureApiPutCall(getBaseUrl() + '/users/'+ user.id.toString(), JSON.stringify(user), token);
    return response.data;
};
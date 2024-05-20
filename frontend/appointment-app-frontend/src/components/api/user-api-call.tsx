import { User } from "./model";
import { secureApiCall } from "./api-call";

export const getUser = async (id: string, token: string): Promise<User> => {
    const response = await secureApiCall(`http://localhost:8080/users/${id}`, token);
    return response.data;
};

export const getUserByExternalId = async (id: string, token: string): Promise<User> => {
    const response = await secureApiCall(`http://localhost:8080/users/auth/${id}`, token);
    return response.data;
};
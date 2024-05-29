import { User } from "./model";
import { secureApiGetCall } from "./api-call";

export const getUser = async (id: string, token: string): Promise<User> => {
    const response = await secureApiGetCall(`http://localhost:8080/users/${id}`, token);
    return response.data;
};

export const getUserByExternalId = async (id: string, token: string): Promise<User> => {
    const response = await secureApiGetCall(`http://localhost:8080/users/auth/${id}`, token);
    return response.data;
};
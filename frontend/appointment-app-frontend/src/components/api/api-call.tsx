import axios, { AxiosResponse } from "axios";

export const apiCall = async (url: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.get(
            url,
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const secureApiCall = async (url: string, token: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.get(
            url, 
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};
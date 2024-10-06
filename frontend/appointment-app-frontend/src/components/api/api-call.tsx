import axios, { AxiosResponse } from "axios";

export const apiGetCall = async (url: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.get(
            url,
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};


export const secureApiGetCall = async (url: string, token: string): Promise<AxiosResponse<any, any>> => {
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

export const secureApiPostCall = async (url: string, body: string, token: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.post(
            url,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const secureApiPutCall = async (url: string, body: string, token: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.put(
            url,
            body,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const secureApiDeleteCall = async (url: string, token: string): Promise<AxiosResponse<any, any>> => {
    try {
        return await axios.delete(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const secureApiFileUploadCall = async (url: string, file: File, token: string) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        const response =  await axios.post(
            url,
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        alert('File uploaded successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed!');
    }
};

/*
export const secureApiFileGetCall = async (url: string, token: string): Promise<AxiosResponse<any, any>> => {
    try {
        const response =  await axios.get(
            url,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            }
        );
        alert('File uploaded successfully!');
        console.log('Response:', response.data);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('File upload failed!');
    }
};*/
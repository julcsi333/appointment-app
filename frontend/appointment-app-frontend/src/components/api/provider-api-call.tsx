import { Provider } from './model';
import { apiGetCall, secureApiPostCall, secureApiPutCall } from './api-call';
import { AxiosError } from 'axios';

export const getProviders = async (): Promise<Array<Provider>> => {
  const response = await apiGetCall('http://localhost:8080/providers');
  return response.data;
};

export const getProvider = async (id: string): Promise<Provider | null> => {
  try {
    const response = await apiGetCall(`http://localhost:8080/providers/${id}`);
    return response.data;
  } catch(err) {
    const error = err as AxiosError;
    if (error.response?.status === 404) {
      return null;
    }
    throw error;
  }
};

export const createProvider = async (provider: Provider, token: string): Promise<Provider> => {
  const response = await secureApiPostCall('http://localhost:8080/providers', JSON.stringify(provider), token);
  return response.data;
};

export const updateProvider = async (provider: Provider, token: string): Promise<Provider> => {
  console.log("Provider update call:")
  console.log(provider)
  const response = await secureApiPutCall('http://localhost:8080/providers/'+provider.id.toString(), JSON.stringify(provider), token);
  return response.data;
};
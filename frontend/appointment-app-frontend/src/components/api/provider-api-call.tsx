import { Provider } from './model';
import { apiGetCall, secureApiPostCall, secureApiPutCall } from './api-call';
import { AxiosError } from 'axios';
import { getBaseUrl } from '../../config';

export const getProviders = async (): Promise<Array<Provider>> => {
  const response = await apiGetCall(getBaseUrl() +'/providers');
  return response.data;
};

export const getProvider = async (id: string): Promise<Provider | null> => {
  try {
    const response = await apiGetCall(`${getBaseUrl()}/providers/${id}`);
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
  const response = await secureApiPostCall(getBaseUrl() + '/providers', JSON.stringify(provider), token);
  return response.data;
};

export const updateProvider = async (provider: Provider, token: string): Promise<Provider> => {
  console.log("Provider update call:")
  console.log(provider)
  const response = await secureApiPutCall(getBaseUrl() + '/providers/'+ provider.id.toString(), JSON.stringify(provider), token);
  return response.data;
};
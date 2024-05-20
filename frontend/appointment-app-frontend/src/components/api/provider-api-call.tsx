import { Provider } from './model';
import { apiCall } from './api-call';

export const getProviders = async (): Promise<Array<Provider>> => {
  const response = await apiCall('http://localhost:8080/providers');
  return response.data;
};

export const getProvider = async (id: string): Promise<Provider> => {
  const response = await apiCall(`http://localhost:8080/providers/${id}`);
  return response.data;
};
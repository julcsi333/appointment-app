import axios from 'axios';
import { Provider } from './model';

export const getProviders = async () => {
  try {
    const response = await axios.get('http://localhost:8080/providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

export const getProvider = async (id: string) => {
  try {
    const response = await axios.get(`http://localhost:8080/providers/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
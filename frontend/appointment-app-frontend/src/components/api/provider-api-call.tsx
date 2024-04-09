import axios from 'axios';

export const getProviders = async () => {
  try {
    const response = await axios.get('http://localhost:8080/providers');
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};
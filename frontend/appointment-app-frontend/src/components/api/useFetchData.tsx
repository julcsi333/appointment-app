import { useEffect } from 'react';

const useFetchData = (getData: () => Promise<[]>, setFunction: (data: []) => void) => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setFunction(data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData();

    return () => {
      // Cleanup function if needed
    };
  }, [getData, setFunction]);
};

export default useFetchData;
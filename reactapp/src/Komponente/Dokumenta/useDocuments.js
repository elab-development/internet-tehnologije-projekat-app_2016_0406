import { useState, useEffect } from 'react';
import axios from 'axios';

const useDocuments = (url) => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const token = sessionStorage.getItem('access_token');
        const response = await axios.get(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDocuments(response.data.data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [url]);

  return [documents, setDocuments];
};

export default useDocuments;

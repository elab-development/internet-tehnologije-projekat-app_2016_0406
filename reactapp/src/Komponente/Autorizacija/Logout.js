import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = sessionStorage.getItem('access_token');

    if (token) {
      // Pozivamo logout API sa tokenom
      axios.post('http://127.0.0.1:8000/api/logout', {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        console.log('Logout successful:', response.data);
        // Brisanje tokena iz session storage-a
        sessionStorage.clear();
        // Navigacija na početnu stranicu
        navigate('/');
      })
      .catch(error => {
        console.error('Error during logout:', error);
        // U slučaju greške takođe brišemo token i vraćamo se na početnu stranicu
        sessionStorage.removeItem('access_token');
        navigate('/');
      });
    } else {
      navigate('/');
    }
  }, [navigate]);

  return <p>Logging out...</p>;
};

export default Logout;

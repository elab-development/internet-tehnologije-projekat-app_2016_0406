import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigacioniMeni.css';

const NavigacioniMeni = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Proveravamo da li postoji token u session storage-u
    const token = sessionStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <nav className="navigacioni-meni">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigacioniMeni;

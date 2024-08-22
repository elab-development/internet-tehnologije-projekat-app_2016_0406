import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigacioniMeni.css';

const NavigacioniMeni = ({ isLoggedIn, setIsLoggedIn ,userRole,setUserRole}) => {
 
  useEffect(() => {
    // Učitavanje korisnika iz sessionStorage kada se promeni isLoggedIn
    const user = JSON.parse(sessionStorage.getItem('user'));
    
    if (user && user.id) {
      console.log(user.id);
      setUserRole(user.role_id);  // Postavi role_id umesto user.id
    } else {
      setUserRole(null);
    }
  }, [isLoggedIn]);  // Dodaj isLoggedIn kao zavisnost
  

  const handleLogout = () => {
    // Brisanje korisnika i tokena iz sessionStorage i postavljanje isLoggedIn na false
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access_token');
    setIsLoggedIn(false);
    setUserRole(null);  // Resetovanje uloge korisnika
  };
  

  return (
    <nav className="navigacioni-meni">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {userRole == 1 && (
          <>
            <li>
              <Link to="/admin">Admin</Link>
            </li>
            <li>
              <Link to="/logout" onClick={handleLogout}>Logout</Link>
            </li>
          </>
        )}
        {userRole == 2 && (
          <>
            <li>
              <Link to="/documents">Documents</Link>
            </li>
            <li>
              <Link to="/konvertuj">Konvertuj</Link>
            </li>
            <li>
              <Link to="/logout" onClick={handleLogout}>Logout</Link>
            </li>
          </>
        )}
        {userRole === null && (
          <>
            <li>
              <Link to="/FAQ">FAQ</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default NavigacioniMeni;

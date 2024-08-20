import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './NavigacioniMeni.css';

const NavigacioniMeni = ({isLoggedIn,setIsLoggedIn}) => {

  return (
    <nav className="navigacioni-meni">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {isLoggedIn ? (
          <>
          <li>
              <Link to="/documents">Documents</Link>
            </li>
            <li>
              <Link to="/logout">Logout</Link>
            </li>
          </>
        ) : (
          <>
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

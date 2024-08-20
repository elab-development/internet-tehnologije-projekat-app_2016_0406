import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pocetna from './Komponente/Pocetna/Pocetna';
import AuthPage from './Komponente/Autorizacija/AuthPage';
import NavigacioniMeni from './Komponente/Nav/NavigacioniMeni';
import Logout from './Komponente/Autorizacija/Logout'; 
import Documents from './Komponente/Dokumenta/Documents';
import OneDocument from './Komponente/Dokumenta/OneDocument';
import Admin from './Komponente/Admin/Admin';
import FAQ from './Komponente/FAQ/FAQ';
import Konvertuj from './Komponente/KonvertApi/Konvertuj';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Proveravamo da li postoji token u session storage-u
    const token = sessionStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  return (
    <Router>
      <div className="App">
        <NavigacioniMeni isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/login" element={<AuthPage setIsLoggedIn={setIsLoggedIn}  />} />
 
          <Route path="/logout" element={<Logout />} />


          <Route path="/documents" element={<Documents />} />
          <Route path="/documents/:id" element={<OneDocument />} />

          <Route path="/admin" element={<Admin />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/konvertuj" element={<Konvertuj />} />

          
        </Routes>
      </div>
    </Router>
  );
}

export default App;

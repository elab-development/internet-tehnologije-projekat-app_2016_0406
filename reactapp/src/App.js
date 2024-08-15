import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Pocetna from './Komponente/Pocetna/Pocetna';
import AuthPage from './Komponente/Autorizacija/AuthPage';
import NavigacioniMeni from './Komponente/Nav/NavigacioniMeni';
import Logout from './Komponente/Autorizacija/Logout';

function App() {
  return (
    <Router>
      <div className="App">
        <NavigacioniMeni />
        <Routes>
          <Route path="/" element={<Pocetna />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/register" element={<AuthPage />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

import React, { useState } from 'react';
import axios from 'axios';
import './AuthPage.css';

const AuthPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    password_confirmation: '',
    role_id: 2,  // Defaultna uloga za novog korisnika
  });

  const [isLogin, setIsLogin] = useState(true);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        // Login request
        const response = await axios.post('http://127.0.0.1:8000/api/login', {
          email: formData.email,
          password: formData.password,
        });
        setSuccessMessage('Login successful!');
        
        // Save token to session storage
        sessionStorage.setItem('access_token', response.data.access_token);
        console.log('Token saved:', response.data.access_token);
        
      } else {
        // Registration request
        const response = await axios.post('http://127.0.0.1:8000/api/register', formData);
        setSuccessMessage('Registration successful!');
        
        // Save token to session storage
        sessionStorage.setItem('access_token', response.data.access_token);
        console.log('Token saved:', response.data.access_token);
      }
      setErrors({});
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="auth-page-container">
      <div className="auth-header">
        <h1>{isLogin ? 'Login' : 'Register'} to Docbox</h1>
      </div>
      <div className="auth-form">
        <form onSubmit={handleFormSubmit}>
          {!isLogin && (
            <>
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <p className="error-text">{errors.name[0]}</p>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="error-text">{errors.email[0]}</p>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="error-text">{errors.password[0]}</p>}
              </div>
              <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleInputChange}
                />
                {errors.password_confirmation && <p className="error-text">{errors.password_confirmation[0]}</p>}
              </div>
            </>
          )}

          {isLogin && (
            <>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <p className="error-text">{errors.email[0]}</p>}
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {errors.password && <p className="error-text">{errors.password[0]}</p>}
              </div>
            </>
          )}

          <button type="submit" className="auth-button">
            {isLogin ? 'Login' : 'Register'}
          </button>
          {successMessage && <p className="success-text">{successMessage}</p>}
        </form>
        <p>
          {isLogin ? "Don't have an account?" : 'Already have an account?'}
          <button
            className="toggle-button"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Register here' : 'Login here'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;

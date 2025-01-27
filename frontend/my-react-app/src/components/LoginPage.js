import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../assets/login.css';
import Header from './Header';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Use the useNavigate hook
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      navigate('/');
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVERURL}registration/login`, {
        email,
        password,
      });
      // console.log(response.data)//{auth, message, token}
      if (response.data.auth) {
        localStorage.setItem('authToken', response.data.token);
        navigate('/'); // Redirect to the home page
      } else {
        console.log('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error.message);
      navigate('/login');
    }
  };

  return (
    <div>
      <Header />
      <div className="login">
        <div className="form">
          <h1>Login to Expense Tracker</h1>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Email  "
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="button login-button">
              Log In
            </button>
          </form>
          <p>
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>

        <div className="footer">
          <p>&copy; Vishal Maharathy 2023</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

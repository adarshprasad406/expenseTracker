import React from 'react';
import { Link } from 'react-router-dom';
import '../assets/header.css';

const Header = ({token, setToken}) => {
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('authToken');
  };
  return (
    <div className="Header">
      <nav>
        <Link to="/" className='button home-button'>Home</Link>
        <div className='mainTitle'>Expense Tracker</div>
        {token && <Link onClick={handleLogout} to="/" className='button home-button'>Logout</Link>}
      </nav>
    </div>
  );
};

export default Header;

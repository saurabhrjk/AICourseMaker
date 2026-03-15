import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AI Course Maker
        </Link>
        <div className="nav-links">
          <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''}>Quiz</Link>
          <a href="https://saurabhkhandelwal.site">About Creator</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">{'>_ AI COURSE MAKER'}</Link>
        <div className="nav-links">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>dashboard</Link>
          <Link to="/quiz" className={location.pathname === '/quiz' ? 'active' : ''}>tasks</Link>
          <Link to="/about" className={location.pathname === '/about' ? 'active' : ''}>about creator</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          AI Course Maker
        </Link>
        <div className="nav-links">
          <a href="https://saurabhkhandelwal.site" >About Creator</a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


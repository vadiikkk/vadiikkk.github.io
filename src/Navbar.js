import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path ? 'active' : '';

  return (
    <nav className="navbar">
      <div>
        <Link to="/">
          <img src="/logo.png" alt="Логотип" className="logo-img" />
        </Link>
      </div>
      <div className="nav-links">
        <Link to="/bloom-filter" className={isActive('/bloom-filter')}>Bloom Filter</Link>
        <Link to="/count-min-sketch" className={isActive('/count-min-sketch')}>Count-Min Sketch</Link>
        <Link to="/skip-list" className={isActive('/skip-list')}>Skip List</Link>
      </div>
    </nav>
  );
}

export default Navbar;

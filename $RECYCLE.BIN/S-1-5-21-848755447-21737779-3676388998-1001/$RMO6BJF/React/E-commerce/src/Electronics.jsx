import React from 'react';
import { Link, Outlet } from 'react-router-dom';

export default function Electronics() {
  return (
    <div>
      <h2>Electronics</h2>
      <div className="dropdown-content">
        <Link to="mobiles" className="dropdown-link">Mobiles</Link>
        <Link to="laptop" className="dropdown-link">Laptop</Link>
        <Link to="smarttv" className="dropdown-link">Smart TV</Link>
      </div>
      <Outlet /> {/* Mobiles, Laptop, Smart TV render here */}
    </div>
  );
}

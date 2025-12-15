import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart } from 'react-icons/fi';
import './Header.css';

const categories = [
  {name:"LogikalHome"}
  { name: "Electronics", sub: ["Mobiles", "Laptop", "Smarttv"] },
  { name: "Mens", sub: ["T-shirts", "FormalShirts", "Casual", "Jeans", "Tracks", "Shorts"] },
  { name: "Womens", sub: ["Sarees", "Kurasss", "Blouses", "Dresses"] },
  { name: "Baby & Kids", sub: ["ClothingsMensWomen", "Chocolates", "ToysCakes", "BabyCare"] },
  { name: "Footwear", sub: ["SportShoes", "FormalShoes","Loafers","FlipFlops"] },
  { name: "Home & Furniture", sub: ["Kitchens", "TableDinner", "Bedroom"] },
  { name: "Orders" },
];

const Dropdown = ({ title, items }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="dropdown"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button className="dropbtn">{title}</button>
      {open && items?.length > 0 && (
        <div className="dropdown-content">
          {items.map((sub, idx) => (
            <Link
              key={idx}
              to={`${title.toLowerCase()}/${sub.toLowerCase()}`}
              className="dropdown-link"
            >
              {sub}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Header = () => (
  <header>
    <div className="header-top">
      <div className="logo"><h2>Logical Mart</h2></div>
      <div className="search-bar">
        <input type="text" placeholder="Search products..." />
        <button>Search</button>
      </div>
      <div className="header-actions">
        <Link to="/cart" className="cart-link">
          <FiShoppingCart size={24} /> Cart
        </Link>
        <Link to="/login" className="login-link">Login</Link>
      </div>
    </div>
    <div className="header-bottom">
      {categories.map(cat => (
        <Dropdown key={cat.name} title={cat.name} items={cat.sub || []} />
      ))}
    </div>
  </header>
);

export default Header;

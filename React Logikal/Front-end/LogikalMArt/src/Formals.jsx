import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Formals.css";

const Formals = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [formals, setFormals] = useState([]);
  const [filteredFormals, setFilteredFormals] = useState([]);

  const [filters, setFilters] = useState({
    name: "",
    color: "",
    size: "",
  });

  // ✅ Fetch formals data
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const formalData = response.data.filter(
          (product) => product.catagory === "formal"
        );

        const updatedFormals = formalData.map((item) => {
          let imagePath = "/Images/default.jpg";
          if (item.name.toLowerCase().includes("deemoon"))
            imagePath = "/Mens/deemoon.webp";
          else if (item.name.toLowerCase().includes("vebnor"))
            imagePath = "/Mens/vebnor.jpg";
          else if (item.name.toLowerCase().includes("mumin"))
            imagePath = "/Mens/mumin.webp";
          else if (item.name.toLowerCase().includes("mildin"))
            imagePath = "/Mens/mildin.jpeg";
          else if (item.name.toLowerCase().includes("cyan"))
            imagePath = "/Mens/cyan.jpg";
          else if (item.name.toLowerCase().includes("finequo"))
            imagePath = "/Mens/finequo.jpg";
          else if (item.name.toLowerCase().includes("blend"))
            imagePath = "/Mens/blend.jpg";
          else if (item.name.toLowerCase().includes("squirrel"))
            imagePath = "/Mens/squirrel.jpg";

          return { ...item, image: imagePath };
        });

        setFormals(updatedFormals);
        setFilteredFormals(updatedFormals);
      })
      .catch((error) => console.error("Error fetching formals:", error));
  }, []);

  // ✅ Handle filter input changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = formals;

    if (filters.name) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.color) {
      filtered = filtered.filter(
        (f) => f.color && f.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    if (filters.size) {
      filtered = filtered.filter(
        (f) => f.size && f.size.toLowerCase() === filters.size.toLowerCase()
      );
    }
         if (filters.price) {
    const [min, max] = filters.price.includes("+")
      ? [parseInt(filters.price), Infinity]
      : filters.price.split("-").map(Number);

    filtered = filtered.filter(
      (m) => m.price > min && m.price < max
    );
  }

    setFilteredFormals(filtered);
  }, [filters, formals]);

  // ✅ Get item quantity from cart
  const getQuantity = (item) => {
    const cartItem = cartItems.find((i) => i.name === item.name);
    return cartItem ? cartItem.quantity : 0;
  };

  // ✅ Increment product quantity
  const handleIncrement = (item) => {
  const cartQty = getQuantity(item);

  if (cartQty >= item.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...item, quantity: 1 }));
    toast.success(`${item.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(item));
  }
};


  // ✅ Decrement product quantity
 const handleDecrement = (item) => {
  const cartQty = getQuantity(item);

  if (cartQty > 0) {
    dispatch(DecCart(item));
  }
};


  return (
    <div className="formals-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>

        {/* ✅ Name filter */}
        <div className="filter-group">
          <label>Name</label>
          <select name="name" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="deemoon">Deemoon</option>
            <option value="mumin">Mumin</option>
            <option value="finequo">Finequo</option>
            <option value="squirrel">Squirrel</option>
            <option value="vebnor">Vebnor</option>
            <option value="blend">Blend</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price</label>
     <select name="price" onChange={handleFilterChange}>
          <option value="">All</option>
           <option value="1-500">₹1 - ₹500</option>
           <option value="500-1000">₹500 - ₹1000</option>
           <option value="1000-2000">₹1000 - ₹2000</option>
           <option value="2000-3000">₹2000 - ₹3000</option>
           <option value="3000-5000">₹3000 - ₹5000</option>
           <option value="5000+">₹5000+</option>
     </select>
       </div>

        {/* Color filter */}
        <div className="filter-group">
          <label>Color</label>
          <select name="color" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Black">Black</option>
            <option value="White">White</option>
            <option value="Blue">Blue</option>
            <option value="Gray">Gray</option>
          </select>
        </div>

        {/* Size filter */}
        <div className="filter-group">
          <label>Size</label>
          <select name="size" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
            <option value="XL">XL</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="formals-container">
        <h2 className="formals-title">👔 Formals</h2>
        <div className="formals-grid">
          {filteredFormals.map((item) => (
            <div
              key={item.id}
              className={`formal-card${
                item.availability === 0 ? " out-of-stock" : ""
              }`}
            >
              <div className="formal-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="formal-image"
                  onError={(e) => (e.target.src = "/Images/default.jpg")}
                />
              </div>

              <div className="formal-details">
                <h4 className="formal-name">{item.name}</h4>
                <p className="formal-price">₹{item.price.toLocaleString()}</p>

                {item.availability > 0 ? (
                  <p className="formal-stock">
                    🟢 In Stock: {item.availability}
                  </p>
                ) : (
                  <p className="formal-stock out">🔴 Out of Stock</p>
                )}

                <div className="quantity-controller">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(item)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{getQuantity(item)}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(item)}
                    disabled={item.availability === 0}
                    style={{
                      backgroundColor:
                        item.availability === 0 ? "#ccc" : "#4CAF50",
                      cursor:
                        item.availability === 0 ? "not-allowed" : "pointer",
                    }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Formals;

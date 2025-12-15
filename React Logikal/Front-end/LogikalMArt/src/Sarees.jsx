import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sarees.css";

const Sarees = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [sarees, setSarees] = useState([]);
  const [filteredSarees, setFilteredSarees] = useState([]);

  const [filters, setFilters] = useState({
    color: "",
    fabric: "",
    name: "",
  });

  // ✅ Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const sareeData = response.data.filter(
          (product) => product.catagory === "Sarees"
        );

        // ✅ Add image paths dynamically based on saree name
        const updatedSarees = sareeData.map((item) => {
          let imagePath = "/Images/default-saree.jpg";

          if (item.name.toLowerCase().includes("kivera")) imagePath = "/Womens/kivera.webp";
          else if (item.name.toLowerCase().includes("starly"))  imagePath = "/Womens/starly.webp";
          else if (item.name.toLowerCase().includes("banarasi")) imagePath = "/Womens/banarasi.jpeg";
          else if (item.name.toLowerCase().includes("chanderi"))  imagePath = "/Womens/chanderi.webp";
          else if (item.name.toLowerCase().includes("lehenga")) imagePath = "/Womens/lehenga.jpg";
          else if (item.name.toLowerCase().includes("myntra")) imagePath = "/Womens/myntra.webp";
          else if (item.name.toLowerCase().includes("dori")) imagePath = "/Womens/dori.jpg";
          else if (item.name.toLowerCase().includes("turkish")) imagePath = "/Womens/turkish.jpg";
          return { ...item, image: imagePath };
        });

        setSarees(updatedSarees);
        setFilteredSarees(updatedSarees);
      })
      .catch((error) => {
        console.error("Error fetching sarees:", error);
      });
  }, []);

  // ✅ Filter handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = sarees;

    if (filters.color) {
      filtered = filtered.filter(
        (s) => s.color && s.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    if (filters.fabric) {
      filtered = filtered.filter(
        (s) => s.fabric && s.fabric.toLowerCase() === filters.fabric.toLowerCase()
      );
    }

    if (filters.name) {
      filtered = filtered.filter((s) =>
        s.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }
           if (filters.price) {
    const [min, max] = filters.price.includes("+")
      ? [parseInt(filters.price), Infinity]
      : filters.price.split("-").map(Number);

    filtered = filtered.filter(
      (m) => m.price >= min && m.price <= max
    );
  }

    setFilteredSarees(filtered);
  }, [filters, sarees]);

  // ✅ Cart quantity
  const getQuantity = (saree) => {
    const item = cartItems.find((i) => i.name === saree.name);
    return item ? item.quantity : 0;
  };

  // ✅ Increment
  const handleIncrement = (saree) => {
  const cartQty = getQuantity(saree);

  if (cartQty >= saree.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...saree, quantity: 1 }));
    toast.success(`${saree.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(saree));
  }
};


  // ✅ Decrement
 const handleDecrement = (saree) => {
  const cartQty = getQuantity(saree);

  if (cartQty > 0) {
    dispatch(DecCart(saree));
  }
};


  return (
    <div className="sarees-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>
           
           
        <div className="filter-group">
          <label>Name</label>
          <select name="name" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="lehenga">Lehenga</option>
            <option value="kivera">Kivera</option>
            <option value="starly">Starly</option>
            <option value="turkish">Turkish</option>
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
        <div className="filter-group">
          <label>Color</label>
          <select name="color" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Red">Red</option>
            <option value="Blue">Blue</option>
            <option value="Green">Green</option>
            <option value="Yellow">Yellow</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Fabric</label>
          <select name="fabric" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Silk">Silk</option>
            <option value="Cotton">Cotton</option>
            <option value="Linen">Linen</option>
            <option value="Chiffon">Chiffon</option>
          </select>
        </div>

      </aside>

      {/* Main content */}
      <div className="sarees-container">
        <h2 className="sarees-title">👗 Sarees Collection</h2>
        <div className="sarees-grid">
          {filteredSarees.map((saree) => (
            <div key={saree.id} className="saree-card">
              <div className="saree-image-wrapper">
                <img
                  src={saree.image}
                  alt={saree.name}
                  className="saree-image"
                />
              </div>
              <div className="saree-details">
                <h4 className="saree-name">{saree.name}</h4>
                <p className="saree-price">₹{saree.price.toLocaleString()}</p>

                {saree.availability > 0 ? (
                  <p className="saree-stock">🟢 In Stock: {saree.availability}</p>
                ) : (
                  <p className="saree-stock out">🔴 Out of Stock</p>
                )}

                <div className="quantity-controller">
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(saree)}
                  >
                    -
                  </button>
                  <span className="quantity-value">{getQuantity(saree)}</span>
                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(saree)}
                    disabled={saree.availability === 0}
                    style={{
                      backgroundColor:
                        saree.availability === 0 ? "#ccc" : "#4CAF50",
                      cursor:
                        saree.availability === 0 ? "not-allowed" : "pointer",
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

export default Sarees;

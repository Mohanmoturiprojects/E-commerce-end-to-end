import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Mobiles.css";

const Mobiles = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [mobiles, setMobiles] = useState([]);
  const [filteredMobiles, setFilteredMobiles] = useState([]);
  const [filters, setFilters] = useState({
    network: "",
    brand: "",
    price:"",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const mobileData = response.data.filter(
          (product) => product.catagory === "Mobiles"
        );

        const updatedMobiles = mobileData.map((item) => {
          // Normalize stock number
          let availableQty = Number(item.availability) || 0;

          // Image mapping
          let imagePath = "/Images/default.jpg";
          const name = item.name.toLowerCase();

          if (name.includes("iphone")) imagePath = "/Images/iphone 13.webp";
          else if (name.includes("iqoo")) imagePath = "/Images/iQOO Z9X 23.webp";
          else if (name.includes("narzo")) imagePath = "/Images/narzo 10.webp";
          else if (name.includes("samsung")) imagePath = "/Images/samsung r.jpg";
          else if (name.includes("galaxy")) imagePath = "/Images/galaxy.jpg";
          else if (name.includes("jio")) imagePath = "/Images/jio.webp";
          else if (name.includes("redmi")) imagePath = "/Images/redmi r.jpg";
          else if (name.includes("carbon")) imagePath = "/Images/carbon.jpg";

          return { ...item, image: imagePath, availability: availableQty };
        });

        setMobiles(updatedMobiles);
        setFilteredMobiles(updatedMobiles);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, []);

  // Filter Controls
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  useEffect(() => {
    let filtered = mobiles;

    if (filters.color) {
      filtered = filtered.filter(
        (m) => m.color?.toLowerCase() === filters.color.toLowerCase()
      );
    }

    if (filters.network) {
      filtered = filtered.filter(
        (m) => m.network?.toLowerCase() === filters.network.toLowerCase()
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((m) =>
        m.name.toLowerCase().includes(filters.brand.toLowerCase())
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

    setFilteredMobiles(filtered);
  }, [filters, mobiles]);

  // Get quantity from cart
  const getQuantity = (mobile) => {
    const item = cartItems.find((i) => i.name === mobile.name);
    return item ? item.quantity : 0;
  };

  // Increment Quantity (NO STOCK UPDATE)
 const handleIncrement = (mobile) => {
  const cartQty = getQuantity(mobile);

  if (cartQty >= mobile.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...mobile, quantity: 1 }));
    toast.success(`${mobile.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(mobile));
  }
};


  // Decrease Quantity (NO STOCK UPDATE)
  const handleDecrement = (mobile) => {
    const cartQty = getQuantity(mobile);
    if (cartQty > 0) {
      dispatch(DecCart(mobile));
    }
  };

  return (
    <div className="mobiles-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <label>Network</label>
          <select name="network" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="3G">3G</option>
            <option value="4G">4G</option>
            <option value="5G">5G</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select name="brand" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="iPhone">iPhone</option>
            <option value="Samsung">Samsung</option>
            <option value="Redmi">Redmi</option>
            <option value="Vivo">Vivo</option>
            <option value="OnePlus">OnePlus</option>
          </select>
        </div>

    <div className="filter-group">
  <label>Price</label>
  <select name="price" onChange={handleFilterChange}>
    <option value="">All</option>
    <option value="1-500">₹1 - ₹500</option>
    <option value="500-1000">₹500 - ₹1000</option>
    <option value="1000-15000">₹1000 - ₹15000</option>
    <option value="15000-30000">₹15000 - ₹30000</option>
    <option value="30000-50000">₹30000 - ₹50000</option>
    <option value="50000+">₹50000+</option>
  </select>
</div>
      </aside>

      {/* Main Content */}
      <div className="mobiles-container">
        <h2 className="mobiles-title">📱 Mobiles</h2>

        <div className="mobiles-grid">
          {filteredMobiles.map((mobile) => (
            <div key={mobile.id} className="mobile-card">
              <div className="mobile-image-wrapper">
                <img src={mobile.image} alt={mobile.name} className="mobile-image" />
              </div>

              <div className="mobile-details">
                <h4 className="mobile-name">{mobile.name}</h4>
                <p className="mobile-price">₹{mobile.price.toLocaleString()}</p>

                {mobile.availability > 0 ? (
                  <p className="mobile-stock">🟢 In Stock: {mobile.availability}</p>
                ) : (
                  <p className="mobile-stock out">🔴 Out of Stock</p>
                )}

                <div className="quantity-controller">
                  <button className="quantity-btn" onClick={() => handleDecrement(mobile)}>
                    -
                  </button>

                  <span className="quantity-value">{getQuantity(mobile)}</span>

                  <button
                    className="quantity-btn"
                    onClick={() => handleIncrement(mobile)}
                    disabled={mobile.availability === 0}
                    style={{
                      backgroundColor: mobile.availability === 0 ? "#ccc" : "#4CAF50",
                      cursor: mobile.availability === 0 ? "not-allowed" : "pointer",
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

export default Mobiles;

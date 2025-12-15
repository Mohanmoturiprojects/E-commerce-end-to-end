import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Kurtas.css";

const Kurtas = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [kurtas, setKurtas] = useState([]);
  const [filteredKurtas, setFilteredKurtas] = useState([]);

  const [filters, setFilters] = useState({
    color: "",
    fabric: "",
    brand: "",
  });

  // ✅ Fetch products from backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const kurtaData = response.data.filter(
          (product) => product.catagory === "Kurtas"
        );

        const updatedKurtas = kurtaData.map((item) => {
          let imagePath = "/Images/default-kurta.jpg";

          if (item.name.toLowerCase().includes("anarkali")) imagePath = "/Womens/anarkali.webp";
          else if (item.name.toLowerCase().includes("flared")) imagePath = "/Womens/flared.webp";
          else if (item.name.toLowerCase().includes("peplum")) imagePath = "/Womens/peplum.webp";
          else if (item.name.toLowerCase().includes("straight")) imagePath = "/Womens/straight.webp";

          return { ...item, image: imagePath };
        });

        setKurtas(updatedKurtas);
        setFilteredKurtas(updatedKurtas);
      })
      .catch((error) => {
        console.error("Error fetching kurtas:", error);
      });
  }, []);

  // ✅ Filter handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = kurtas;

    if (filters.color) {
      filtered = filtered.filter(
        (k) => k.color && k.color.toLowerCase() === filters.color.toLowerCase()
      );
    }

    if (filters.fabric) {
      filtered = filtered.filter(
        (k) => k.fabric && k.fabric.toLowerCase() === filters.fabric.toLowerCase()
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((k) =>
        k.name.toLowerCase().includes(filters.brand.toLowerCase())
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

    setFilteredKurtas(filtered);
  }, [filters, kurtas]);

  // ✅ Cart quantity
  const getQuantity = (kurta) => {
    const item = cartItems.find((i) => i.name === kurta.name);
    return item ? item.quantity : 0;
  };

  // ✅ Increment
  const handleIncrement = (kurta) => {
  const cartQty = getQuantity(kurta);

  if (cartQty >= kurta.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...kurta, quantity: 1 }));
    toast.success(`${kurta.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(kurta));
  }
};


  // ✅ Decrement

 const handleDecrement = (kurta) => {
  const cartQty = getQuantity(kurta);

  if (cartQty > 0) {
    dispatch(DecCart(kurta));
  }
};

  return (
    <div className="kurtas-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>
        <div className="filter-group">
          <label>Name</label>
          <select name="brand" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="anarkali">Anarkali</option>
            <option value="flared">Flared</option>
            <option value="peplum">Peplum</option>
            <option value="straight">Straight</option>
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
            <option value="Blue">Blue</option>
            <option value="White">White</option>
            <option value="Maroon">Maroon</option>
            <option value="Green">Green</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Fabric</label>
          <select name="fabric" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Cotton">Cotton</option>
            <option value="Silk">Silk</option>
            <option value="Linen">Linen</option>
            <option value="Rayon">Rayon</option>
          </select>
        </div>


      </aside>

      {/* Main content */}
      <div className="kurtas-container">
        <h2 className="kurtas-title">Kurtas Collection</h2>
        <div className="kurtas-grid">
          {filteredKurtas.map((kurta) => (
            <div key={kurta.id} className="kurta-card">
              <img src={kurta.image} alt={kurta.name} className="kurta-image" />
              <h4 className="kurta-name">{kurta.name}</h4>
              <p className="kurta-price">₹{kurta.price.toLocaleString()}</p>

              {kurta.availability > 0 ? (
                <p className="kurta-stock">🟢 In Stock: {kurta.availability}</p>
              ) : (
                <p className="kurta-stock out">🔴 Out of Stock</p>
              )}

              <div className="quantity-controller">
                <button className="quantity-btn" onClick={() => handleDecrement(kurta)}>
                  -
                </button>
                <span className="quantity-value">{getQuantity(kurta)}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleIncrement(kurta)}
                  disabled={kurta.availability === 0}
                  style={{
                    backgroundColor: kurta.availability === 0 ? "#ccc" : "#4CAF50",
                    cursor: kurta.availability === 0 ? "not-allowed" : "pointer",
                  }}
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Kurtas;

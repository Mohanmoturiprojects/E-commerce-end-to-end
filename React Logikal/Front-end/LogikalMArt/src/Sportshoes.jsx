import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Sportshoes.css";

const Sportshoes = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart || []);
  const [shoes, setShoes] = useState([]);
  const [filteredShoes, setFilteredShoes] = useState([]);

  // Controlled filter state
  const [filters, setFilters] = useState({
    color: "",
    brand: "",
    type: "",
  });

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        // ensure response.data is an array
        const data = Array.isArray(response.data) ? response.data : [];

        // keep original 'catagory' filter to match your backend
        const shoeData = data.filter(
          (p) => (p.catagory || "").toString() === "SportShoes"
        );

        // normalize fields and set default values to avoid undefineds
        const normalized = shoeData.map((item) => {
          const name = (item.name || "").toString();
          const lower = name.toLowerCase();

          let imagePath = "/Images/default.jpg";
          if (lower.includes("running")) imagePath = "/Shoes/running.jpg";
          else if (lower.includes("hotstyle")) imagePath = "/Shoes/hotstyle.jpg";
          else if (lower.includes("casuals")) imagePath = "/Shoes/casuals.jpg";
          else if (lower.includes("training")) imagePath = "/Shoes/training.jpg";
          else if (lower.includes("walking")) imagePath = "/Shoes/walking.jpg";
          else if (lower.includes("aadi")) imagePath = "/Shoes/aadi.jpg";
          else if (lower.includes("new Oranie")) imagePath = "/Shoes/new Oranie.jpg";

          return {
            id: item.id,
            name: name,
            price: Number(item.price || 0),
            availability: Number(item.availability || item.stock || 0),
            color: (item.color || "").toString(),
            type: (item.type || "").toString(),
            brand: (item.brand || "").toString(),
            image: imagePath,
            raw: item, // keep original if needed
          };
        });

        setShoes(normalized);
        setFilteredShoes(normalized);
      })
      .catch((err) => {
        console.error("Error fetching sports shoes:", err);
      });
  }, []);

  // Controlled selects: update filters
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({ color: "", brand: "", type: "" });
  };

  // Apply filters to master `shoes` list
useEffect(() => {
  const colorFilter = (filters.color || "").trim().toLowerCase();
  const brandFilter = (filters.brand || "").trim().toLowerCase();
  const typeFilter = (filters.type || "").trim().toLowerCase();
  const priceFilter = filters.price || "";

  let result = shoes.filter((s) => {
    const shoeColor = (s.color || "").trim().toLowerCase();
    const shoeBrand = ((s.brand || "") + " " + (s.name || "")).trim().toLowerCase();
    const shoeType = (s.type || "").trim().toLowerCase();

    const colorMatch = colorFilter ? shoeColor === colorFilter : true;
    const brandMatch = brandFilter ? shoeBrand.includes(brandFilter) : true;
    const typeMatch = typeFilter ? shoeType === typeFilter : true;

    return colorMatch && brandMatch && typeMatch;
  });

  // ✅ Correct price filter logic (without reassigning `filters`)
  if (priceFilter) {
    const [min, max] = priceFilter.includes("+")
      ? [parseInt(priceFilter), Infinity]
      : priceFilter.split("-").map(Number);

    result = result.filter(
      (m) => m.price >= min && m.price <= max
    );
  }

  setFilteredShoes(result);
}, [filters, shoes]);


  // Get quantity in cart by product id/name
  const getQuantity = (shoe) => {
    const item = cartItems.find((i) => i.id === shoe.id || i.name === shoe.name);
    return item ? item.quantity : 0;
  };

  // Increment cart — check current availability from state
const handleIncrement = (shoe) => {
  const cartQty = getQuantity(shoe);

  if (cartQty >= shoe.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...shoe, quantity: 1 }));
    toast.success(`${shoe.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(shoe));
  }
};


  // Decrement cart
       const handleDecrement = (shoe) => {
        const cartQty = getQuantity(shoe);
      
        if (cartQty > 0) {
          dispatch(DecCart(shoe));
        }
      };

  // Build unique options for dynamic selects (optional friendly UX)
  const uniqueColors = Array.from(new Set(shoes.map((s) => (s.color || "").trim()).filter(Boolean)));
  const uniqueBrands = Array.from(new Set(shoes.map((s) => (s.brand || s.name || "").trim()).filter(Boolean)));
  const uniqueTypes = Array.from(new Set(shoes.map((s) => (s.type || "").trim()).filter(Boolean)));

  return (
    <div className="shoes-main">
      <aside className="sidebar">
        <h3>Filters</h3>
              <div className="filter-group">
          <label>Name</label>
          <select name="brand" value={filters.brand} onChange={handleFilterChange}>
            <option value="">All</option>
            {uniqueBrands.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
          </div>

               <div className="filter-group">
          <label>Price</label>
     <select name="price" onChange={handleFilterChange}>
          <option value="">All</option>
           <option value="1-500">₹1 - ₹500</option>
           <option value="500-1000">₹500 - ₹1000</option>
           <option value="1000-1500">₹1000 - ₹1500</option>
           <option value="1500-2000">₹1500 - ₹2000</option>
           <option value="2000-3000">₹2000 - ₹3000</option>
           <option value="3000+">₹3000+</option>
     </select>
       </div>

        <div className="filter-group">
          <label>Color</label>
          <select name="color" value={filters.color} onChange={handleFilterChange}>
            <option value="">All</option>
            {uniqueColors.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        

        <div className="filter-group">
          <label>Type</label>
          <select name="type" value={filters.type} onChange={handleFilterChange}>
            <option value="">All</option>
            {uniqueTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <button className="reset-btn" onClick={resetFilters}>
          Reset filters
        </button>
      </aside>

      <div className="shoes-container">
        <h2 className="shoes-title">👟 Sport Shoes</h2>

        <div className="shoes-grid">
          {filteredShoes.length > 0 ? (
            filteredShoes.map((shoe) => (
              <div key={shoe.id} className="shoe-card">
                <div className="shoe-image-wrapper">
                  <img src={shoe.image} alt={shoe.name} className="shoe-image" />
                </div>

                <div className="shoe-details">
                  <h4 className="shoe-name">{shoe.name}</h4>
                  <p className="shoe-price">₹{shoe.price.toLocaleString()}</p>

                  {shoe.availability > 0 ? (
                    <p className="shoe-stock">🟢 In Stock: {shoe.availability}</p>
                  ) : (
                    <p className="shoe-stock out">🔴 Out of Stock</p>
                  )}

                  <div className="quantity-controller">
                    <button className="quantity-btn" onClick={() => handleDecrement(shoe)}>
                      -
                    </button>
                    <span className="quantity-value">{getQuantity(shoe)}</span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleIncrement(shoe)}
                      disabled={shoe.availability === 0}
                      style={{
                        backgroundColor: shoe.availability === 0 ? "#ccc" : "#4CAF50",
                        cursor: shoe.availability === 0 ? "not-allowed" : "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No shoes match the selected filters.</p>
          )}
        </div>

        <ToastContainer />
      </div>
    </div>
  );
};

export default Sportshoes;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Kitchens.css";

const Kitchens = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [kitchens, setKitchens] = useState([]);
  const [filteredKitchens, setFilteredKitchens] = useState([]);

  const [filters, setFilters] = useState({
    type: "",
    material: "",
  });

  // ✅ Fetch data from backend
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const kitchenData = response.data.filter(
          (product) => product.catagory === "Kitchens"
        );

        const updatedKitchens = kitchenData.map((item) => {
          let imagePath = "/Images/default.jpg";
          const name = item.name.toLowerCase();
          let type = "Other";

          if (name.includes("gas stove")) { imagePath = "/Home/gas stove.jpg";  type = "Gas Stove";
          } else if (name.includes("cooker")) { imagePath = "/Home/cooker.jpg"; type = "Cooker";
          } else if (name.includes("grinder")) { imagePath = "/Home/grinder.jpg"; type = "Mixer";
          } else if (name.includes("pan")) { imagePath = "/Home/pan.jpg"; type = "Pan";
          } else if (name.includes("refrigerator")) {imagePath = "/Home/refrigerator.jpg";  type = "Refrigerator";
          } else if (name.includes("oven")) { imagePath = "/Home/oven.jpg"; type = "Oven";
          } else if (name.includes("mixer") || name.includes("mixer")) {  imagePath = "/Home/mixer.jpg";type = "Mixer";
          } else if (name.includes("induction")) {imagePath = "/Home/induction stove.jpg";type = "Induction Stove";
          }

          // Add derived "type" field
          return { ...item, image: imagePath, type };
        });

        setKitchens(updatedKitchens);
        setFilteredKitchens(updatedKitchens);
      })
      .catch((error) => {
        console.error("Error fetching kitchens:", error);
      });
  }, []);

  // ✅ Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply filters (by Type and Material)
  useEffect(() => {
    let filtered = kitchens;

    // Filter by derived Type
    if (filters.type) {
      filtered = filtered.filter(
        (k) => k.type && k.type.toLowerCase() === filters.type.toLowerCase()
      );
    }

    // Filter by Material
    if (filters.material) {
      filtered = filtered.filter(
        (k) =>
          k.material &&
          k.material.toLowerCase() === filters.material.toLowerCase()
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

    setFilteredKitchens(filtered);
  }, [filters, kitchens]);

  // ✅ Get quantity from cart
  const getQuantity = (kitchen) => {
    const item = cartItems.find((i) => i.name === kitchen.name);
    return item ? item.quantity : 0;
  };

  // ✅ Increment and reduce stock
  const handleIncrement = (kitchen) => {
  const cartQty = getQuantity(kitchen);

  if (cartQty >= kitchen.availability) {
    toast.error("❌ No more stock available!", {
      position: "bottom-right",
    });
    return;
  }

  // First-time add → show toast
  if (cartQty === 0) {
    dispatch(AddToCart({ ...kitchen, quantity: 1 }));
    toast.success(`${kitchen.name} added to cart!`, {
      position: "bottom-right",
      autoClose: 2000,
    });
  } 
  // Already in cart → just increase quantity (NO toast)
  else {
    dispatch(IncCart(kitchen));
  }
};


  // Decrement cart
       const handleDecrement = (kitchen) => {
        const cartQty = getQuantity(kitchen);
      
        if (cartQty > 0) {
          dispatch(DecCart(kitchen));
        }
      };

  return (
    <div className="kitchen-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <label>Name</label>
          <select name="type" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Cooker">Cooker</option>
            <option value="Mixer">Mixer</option>
            <option value="Gas Stove">Gas Stove</option>
            <option value="Pan">Pan</option>
            <option value="Oven">Oven</option>
            <option value="Refrigerator">Refrigerator</option>
            <option value="Induction Stove">Induction Stove</option>
          </select>
        </div>


    <div className="filter-group">
          <label>Price</label>
     <select name="price" onChange={handleFilterChange}>
          <option value="">All</option>
           <option value="1-500">₹1 - ₹500</option>
           <option value="500-1000">₹500 - ₹1000</option>
           <option value="1000-3000">₹1000 - ₹3000</option>
           <option value="3000-5000">₹3000 - ₹5000</option>
           <option value="5000-10000">₹5000 - ₹10000</option>
           <option value="10000+">₹10000+</option>
     </select>
       </div>

        <div className="filter-group">
          <label>Material</label>
          <select name="material" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Steel">Steel</option>
            <option value="Aluminium">Aluminium</option>
            <option value="Non-stick">Non-stick</option>
          </select>
        </div>
      </aside>

      {/* Main content */}
      <div className="kitchen-container">
        <h2 className="kitchen-title">🍳 Kitchen Appliances</h2>
        <div className="kitchen-grid">
          {filteredKitchens.length === 0 ? (
            <p className="no-products">No products found.</p>
          ) : (
            filteredKitchens.map((kitchen) => (
              <div key={kitchen.id} className="kitchen-card">
                <div className="kitchen-image-wrapper">
                  <img
                    src={kitchen.image}
                    alt={kitchen.name}
                    className="kitchen-image"
                  />
                </div>

                <div className="kitchen-details">
                  <h4 className="kitchen-name">{kitchen.name}</h4>
                  <p className="kitchen-price">
                    ₹{kitchen.price.toLocaleString()}
                  </p>

                  {kitchen.availability > 0 ? (
                    <p className="kitchen-stock">
                      🟢 In Stock: {kitchen.availability}
                    </p>
                  ) : (
                    <p className="kitchen-stock out">🔴 Out of Stock</p>
                  )}

                  <div className="quantity-controller">
                    <button
                      className="quantity-btn"
                      onClick={() => handleDecrement(kitchen)}
                    >
                      -
                    </button>
                    <span className="quantity-value">
                      {getQuantity(kitchen)}
                    </span>
                    <button
                      className="quantity-btn"
                      onClick={() => handleIncrement(kitchen)}
                      disabled={kitchen.availability === 0}
                      style={{
                        backgroundColor:
                          kitchen.availability === 0 ? "#ccc" : "#4CAF50",
                        cursor:
                          kitchen.availability === 0
                            ? "not-allowed"
                            : "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default Kitchens;

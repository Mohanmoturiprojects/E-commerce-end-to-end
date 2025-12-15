import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Bedroom.css";

const Bedroom = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [bedroom, setBedroom] = useState([]);
  const [filteredBedroom, setFilteredBedroom] = useState([]);

  const [filters, setFilters] = useState({
    brand: "",
    type: "",
    material: "",
  });

  // ✅ Fetch bedroom products
  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const bedroomData = response.data.filter(
          (product) => product.catagory === "Bedroom"
        );

        const updatedBedroom = bedroomData.map((item) => {
          let imagePath = "/Images/default.jpg";
          const name = item.name.toLowerCase();

          if (name.includes("bed sheet")) imagePath = "/Home/bed sheet.jpg";
          else if (name.includes("pillows")) imagePath = "/Home/pillows.jpg";
          else if (name.includes("blanket")) imagePath = "/Home/blanket.jpg";
          else if (name.includes("curtains")) imagePath = "/Home/curtains.jpg";
          else if (name.includes("ddecor"))
            imagePath = "/Images/ddecor curtain.webp";
          else if (name.includes("bombay dyeing"))
            imagePath = "/Images/bombay bedsheet.webp";

          return { ...item, image: imagePath };
        });

        setBedroom(updatedBedroom);
        setFilteredBedroom(updatedBedroom);
      })
      .catch((error) => {
        console.error("Error fetching bedroom data:", error);
      });
  }, []);

  // ✅ Filter change handler
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // ✅ Apply filters
  useEffect(() => {
    let filtered = bedroom;

    if (filters.brand) {
      filtered = filtered.filter((b) =>
        b.name.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }
if (filters.type) {
  filtered = filtered.filter((b) =>
    b.name.toLowerCase().includes(filters.type.toLowerCase())
  );
}

    if (filters.material) {
      filtered = filtered.filter(
        (b) =>
          b.material && b.material.toLowerCase() === filters.material.toLowerCase()
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

    setFilteredBedroom(filtered);
  }, [filters, bedroom]);

  // ✅ Get quantity in cart
  const getQuantity = (item) => {
    const found = cartItems.find((i) => i.name === item.name);
    return found ? found.quantity : 0;
  };

  // ✅ Increment
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


 // ✅ Decrement
        const handleDecrement = (item) => {
         const cartQty = getQuantity(item);
       
         if (cartQty > 0) {
           dispatch(DecCart(item));
         }
       };
 

  // ✅ Navigate to product details
  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="bedroom-main">
      {/* Sidebar */}
      <aside className="sidebar">
        <h3>Filters</h3>

        
        <div className="filter-group">
          <label>Name</label>
          <select name="type" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="bed sheet">Bedsheet</option>
            <option value="pillows">Pillows</option>
            <option value="blanket">Blanket</option>
            <option value="Mattress">Mattress</option>
            <option value="curtains">Curtains</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select name="brand" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Sleepwell">Sleepwell</option>
            <option value="Kurlon">Kurlon</option>
            <option value="Springfit">Springfit</option>
            <option value="Recron">Recron</option>
            <option value="Bombay Dyeing">Bombay Dyeing</option>
            <option value="Ddecor">D’Decor</option>
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
          <label>Material</label>
          <select name="material" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Cotton">Cotton</option>
            <option value="Polyester">Polyester</option>
            <option value="Foam">Foam</option>
            <option value="Silk">Silk</option>
            <option value="Velvet">Velvet</option>
          </select>
        </div>
      </aside>

      {/* Main Content */}
      <div className="bedroom-container">
        <h2 className="bedroom-title">🛏️ Bedroom Essentials</h2>

        <div className="bedroom-grid">
          {filteredBedroom.map((item) => (
            <div
              key={item.id}
              className="bedroom-card"
              onClick={() => handleProductClick(item.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="bedroom-image-wrapper">
                <img
                  src={item.image}
                  alt={item.name}
                  className="bedroom-image"
                />
              </div>

              <div className="bedroom-details">
                <h4 className="bedroom-name">{item.name}</h4>
                <p className="bedroom-price">₹{item.price.toLocaleString()}</p>

                {item.availability > 0 ? (
                  <p className="bedroom-stock">🟢 In Stock: {item.availability}</p>
                ) : (
                  <p className="bedroom-stock out">🔴 Out of Stock</p>
                )}

                <div
                  className="quantity-controller"
                  onClick={(e) => e.stopPropagation()} // prevent navigation when clicking buttons
                >
                  <button
                    className="quantity-btn"
                    onClick={() => handleDecrement(item)}
                    disabled={getQuantity(item) === 0}
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

export default Bedroom;

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { AddToCart, IncCart, DecCart } from "./store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Laptop.css";

const Laptop = () => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart);
  const [laptops, setLaptops] = useState([]);
  const [filteredLaptops, setFilteredLaptops] = useState([]);

  // Filters state
  const [filters, setFilters] = useState({
    name: "",
    brand: "",
    price: "",
  });

  useEffect(() => {
    axios
      .get("http://localhost:8081/api/products")
      .then((response) => {
        const laptopData = response.data.filter(
          (product) => product.catagory === "Laptop"
        );

        const updatedLaptops = laptopData.map((item) => {
          let imagePath = "/Images/default.jpg";

          if (item.name.toLowerCase().includes("dell"))
            imagePath = "/Images/Dell 13.webp";
          else if (item.name.toLowerCase().includes("hp"))
            imagePath = "/Images/Hp 15.webp";
          else if (item.name.toLowerCase().includes("amd"))
            imagePath = "/Images/amd.jpg";
          else if (item.name.toLowerCase().includes("acer"))
            imagePath = "/Images/Acer.webp";
          else if (item.name.toLowerCase().includes("asus"))
            imagePath = "/Images/asus.webp";
           else if (item.name.toLowerCase().includes("surfacae"))
            imagePath = "/Images/surfacae.avif";


          return { ...item, image: imagePath };
        });

        setLaptops(updatedLaptops);
        setFilteredLaptops(updatedLaptops);
      })
      .catch((error) => {
        console.error("Error fetching laptops:", error);
      });
  }, []);

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  // Apply filters
  useEffect(() => {
    let filtered = laptops;

    if (filters.name) {
      filtered = filtered.filter((l) =>
        l.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    if (filters.brand) {
      filtered = filtered.filter((l) =>
        l.name.toLowerCase().includes(filters.brand.toLowerCase())
      );
    }

    if (filters.price) {
      const [min, max] = filters.price.includes("+")
        ? [parseInt(filters.price), Infinity]
        : filters.price.split("-").map(Number);

      filtered = filtered.filter((l) => l.price >= min && l.price <= max);
    }

    setFilteredLaptops(filtered);
  }, [filters, laptops]);

  const getQuantity = (laptop) => {
    const item = cartItems.find((i) => i.name === laptop.name);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (laptop) => {
    const cartQty = getQuantity(laptop);

    if (cartQty >= laptop.availability) {
      toast.error("❌ No more stock available!", {
        position: "bottom-right",
      });
      return;
    }

    if (cartQty === 0) {
      dispatch(AddToCart({ ...laptop, quantity: 1 }));
      toast.success(`${laptop.name} added to cart!`, {
        position: "bottom-right",
        autoClose: 2000,
      });
    } else {
      dispatch(IncCart(laptop));
    }
  };

  const handleDecrement = (laptop) => {
    const cartQty = getQuantity(laptop);
    if (cartQty > 0) dispatch(DecCart(laptop));
  };

  return (
    <div className="cart-main">

      {/* Sidebar */}
      <aside className="cart-sidebar">
        <h3>Filters</h3>

        <div className="filter-group">
          <label>Search by Name</label>
          <input
            type="text"
            name="name"
            placeholder="Type name..."
            onChange={handleFilterChange}
          />
        </div>

        <div className="filter-group">
          <label>Brand</label>
          <select name="brand" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Dell">Dell</option>
            <option value="HP">HP</option>
            <option value="Acer">Acer</option>
            <option value="Asus">Asus</option>
            <option value="MacBook">MacBook</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Price</label>
          <select name="price" onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="1-20000">₹1 - ₹20,000</option>
            <option value="20000-40000">₹20,000 - ₹40,000</option>
            <option value="40000-60000">₹40,000 - ₹60,000</option>
            <option value="60000-90000">₹60,000 - ₹90,000</option>
            <option value="90000+">₹90,000+</option>
          </select>
        </div>
      </aside>

      {/* RIGHT SIDE CONTENT */}
      <div className="cart-content">
        <h2 className="cart-title">💻 Laptops</h2>

        <div className="cart-grid">
          {filteredLaptops.map((laptop) => (
            <div key={laptop.id} className="cart-card">

              <img
                src={laptop.image}
                alt={laptop.name}
                onError={(e) => (e.target.src = "/Images/default.jpg")}
              />

              <p className="cart-info">{laptop.name}</p>
              <p className="cart-price">₹{laptop.price.toLocaleString()}</p>

              {laptop.availability > 0 ? (
                <p className="mobile-stock">🟢 In Stock: {laptop.availability}</p>
              ) : (
                <p className="mobile-stock out">🔴 Out of Stock</p>
              )}

              <div className="cart-qty">
                <button onClick={() => handleDecrement(laptop)}>-</button>

                <span>{getQuantity(laptop)}</span>

                <button
                  onClick={() => handleIncrement(laptop)}
                  disabled={laptop.availability === 0}
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

export default Laptop;

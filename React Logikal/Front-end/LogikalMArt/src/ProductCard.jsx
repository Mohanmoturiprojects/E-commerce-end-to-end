import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AddToCart } from "./store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // quantity selected by user only for UI
  const [qty, setQty] = useState(0);

  // Backend availability (display only, never modify here)
  const available = Number(product.availability) || 0;

  const stopBubble = (e) => e.stopPropagation();

  /* ------------------ Increase Quantity ------------------ */
  const handleIncrease = (e) => {
    stopBubble(e);

    if (qty >= available) {
      toast.error("❌ No more stock available!", {
        position: "bottom-right",
      });
      return;
    }

    setQty((prev) => prev + 1);
  };

  /* ------------------ Decrease Quantity ------------------ */
  const handleDecrease = (e) => {
    stopBubble(e);
    if (qty > 0) setQty((prev) => prev - 1);
  };

  /* ------------------ Add to Cart ------------------ */
  const handleAddToCart = (e) => {
    stopBubble(e);

    if (qty === 0) {
      toast.warn("⚠ Please select a quantity", {
        position: "bottom-right",
      });
      return;
    }

    dispatch(
      AddToCart({
        ...product,
        quantity: qty,
      })
    );

    toast.success(`${qty} × ${product.name} added to cart 🛒`, {
      position: "bottom-right",
    });

    // Do NOT reset qty
    // qty must remain visible until user changes it
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card" onClick={handleCardClick}>
      <img
        src={product.image || "/images/default.jpg"}
        alt={product.name}
        className="product-img"
      />

      <h3 className="product-name">{product.name}</h3>
      <p className="product-price">₹{product.price}</p>

      {/* Availability */}
      <p className={`availability ${available > 0 ? "in-stock" : "out-stock"}`}>
        {available > 0 ? `In Stock (${available})` : "Out of Stock"}
      </p>

      {/* Quantity Controls */}
      <div className="qty-controls" onClick={stopBubble}>
        <button
          className="qty-btn"
          onClick={handleDecrease}
          disabled={qty === 0}
        >
          -
        </button>

        <span className="qty-value">{qty}</span>

        <button
          className="qty-btn"
          onClick={handleIncrease}
          disabled={qty >= available}
        >
          +
        </button>
      </div>

      {/* Add to Cart Button */}
      <button
        className="add-btn"
        onClick={handleAddToCart}
        disabled={available < 0}
      >
        Add to Cart
      </button>
    </div>
  );
};

export default ProductCard;

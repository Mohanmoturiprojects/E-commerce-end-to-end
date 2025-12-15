import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { AddToCart } from "./store";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  const handleOptionChange = (category, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const increaseQuantity = () => {
  if (quantity >= product.availability) {
    toast.error("No more stock available ❌", {
      position: "bottom-right",
    });
    return;
  }

  setQuantity(q => q + 1);
};


const decreaseQuantity = () => {
  if (quantity > 0) {
    setQuantity(q => q - 1);
  }
};


const handleAddToCart = () => {
  if (quantity <= 0) {
    toast.warn("Please select at least one quantity ⚠️", {
      position: "bottom-right",
    });
    return;
  }

  dispatch(
    AddToCart({
      ...product,
      quantity,
      selectedOptions,
    })
  );

  toast.success(`${product.name} added to cart 🛒`, {
    position: "bottom-right",
    autoClose: 2000,
  });
};


  if (!product) return <p>Loading product details...</p>;

  const options =
    typeof product.options === "string"
      ? JSON.parse(product.options)
      : product.options;

  return (
    <div className="product-details">
      <ToastContainer />  {/* ✅ REQUIRED for toast to work */}

      <div className="details-container">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => (e.target.src = "/images/default.jpg")}
        />

        <div className="info">
          <h2>
            {product.name}{" "}
            <span className="category">({product.catagory})</span>
          </h2>

          <p>{product.description}</p>
          <h3>Price: ₹{product.price}</h3>

          <p
            className={`availability ${
              product.availability > 0 ? "in-stock" : "out-stock"
            }`}
          >
            {product.availability > 0
              ? `In Stock: ${product.availability}`
              : "Out of Stock"}
          </p>

          {/* Options */}
          {options && (
            <div className="product-options">
              {Object.entries(options).map(([category, values]) => (
                <div key={category} className="option-group">
                  <h4>{category}</h4>
                  <div className="checkbox-group">
                    {values.map((value) => (
                      <label key={value} className="checkbox-label">
                        <input
                          type="checkbox"
                          name={category}
                          value={value}
                          checked={selectedOptions[category] === value}
                          onChange={() =>
                            handleOptionChange(category, value)
                          }
                        />
                        {value}
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Quantity buttons */}
          <div className="quantity-control">
            <button onClick={decreaseQuantity} disabled={quantity === 0}>
              −
            </button>

            <span>{quantity}</span>

            <button
              onClick={increaseQuantity}
              disabled={product.availability === 0}
            >
              +
            </button>
          </div>

          {/* Add to cart */}
          <button
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={quantity < 0}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

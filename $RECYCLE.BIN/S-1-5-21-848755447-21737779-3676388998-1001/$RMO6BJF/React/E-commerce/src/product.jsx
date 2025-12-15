import { useEffect, useState } from "react";

function Product() {
  const [products, setProducts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  // Make sure products is an array
  const filteredProducts = Array.isArray(products)
    ? filter === "all"
      ? products
      : products.filter((p) => p.category === filter)
    : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>Product List</h2>

      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setFilter("all")}>All</button>
        <button onClick={() => setFilter("veg")}>Veg</button>
        <button onClick={() => setFilter("non-veg")}>Non-Veg</button>
        <button onClick={() => setFilter("Friut")}>Fruit</button>
      </div>

      {filteredProducts.length === 0 ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {filteredProducts.map((p) => (
            <li key={p.id} style={{ marginBottom: "10px" }}>
              <b>{p.name}</b> - ₹{p.price} ({p.category})<br />
              <i>{p.description}</i>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Product;

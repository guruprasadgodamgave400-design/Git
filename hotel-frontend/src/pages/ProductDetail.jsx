import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/useCart";

const initialState = { product: null, status: "loading", error: null };

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return initialState;
    case "success":
      return { product: action.product, status: "ready", error: null };
    case "error":
      return { product: null, status: "error", error: action.error };
    default:
      return state;
  }
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    dispatch({ type: "loading" });
    api
      .getProductById(id)
      .then((data) => {
        if (!cancelled) dispatch({ type: "success", product: data });
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: "error", error: err.message || "Failed to load product" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { product, status, error } = state;
  const loading = status === "loading";

  function handleAdd() {
    if (!product) return;
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  if (loading) return <p className="status">Loading product...</p>;
  if (error) return <p className="status status-error">Error: {error}</p>;
  if (!product) return <p className="status">Product not found.</p>;

  return (
    <section className="product-detail">
      <Link to="/" className="back-link">
        &larr; Back to shop
      </Link>
      <div className="product-detail-grid">
        <div className="product-detail-image">
          <img src={product.image} alt={product.name} />
        </div>
        <div className="product-detail-body">
          <span className="product-category">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="product-price large">
            &#8377; {product.price.toLocaleString("en-IN")}
          </p>
          <p className="product-description">{product.description}</p>
          <p className="product-stock">
            {product.stock > 0 ? `In stock (${product.stock} available)` : "Out of stock"}
          </p>

          <div className="quantity-row">
            <label htmlFor="qty">Quantity</label>
            <div className="quantity-control">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
              >
                &minus;
              </button>
              <input
                id="qty"
                type="number"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value) || 1)))
                }
              />
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="detail-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
              disabled={product.stock === 0}
            >
              {added ? "Added!" : "Add to cart"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                addItem(product, quantity);
                navigate("/cart");
              }}
              disabled={product.stock === 0}
            >
              Buy now
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

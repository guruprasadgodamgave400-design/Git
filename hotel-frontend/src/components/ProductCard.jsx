import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="product-image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
      </Link>
      <div className="product-body">
        <span className="product-category">{product.category}</span>
        <h3 className="product-title">
          <Link to={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <p className="product-price">&#8377; {product.price.toLocaleString("en-IN")}</p>
        <Link to={`/product/${product.id}`} className="btn btn-outline">
          View details
        </Link>
      </div>
    </article>
  );
}

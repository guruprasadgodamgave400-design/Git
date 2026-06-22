import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/useCart";
import { useBooking } from "../context/useBooking";
import Icon from "../components/Icon";

export default function Cart() {
  const { items, subtotal, removeItem, clearCart } = useCart();
  const { checkIn, checkOut, nights } = useBooking();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <section className="cart-empty">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Icon name="concierge" size={48} className="cart-empty-icon" />
          <h1>Your reservation list is empty</h1>
          <p>Browse our rooms and suites to begin your stay.</p>
          <Link to="/rooms" className="btn btn-gold">
            Explore rooms
            <Icon name="arrow" size={16} />
          </Link>
        </motion.div>
      </section>
    );
  }

  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  const checkInLabel = checkIn?.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  const checkOutLabel = checkOut?.toLocaleDateString("en-IN", { day: "numeric", month: "short" });

  return (
    <section className="cart">
      <div className="cart-banner">
        <span className="section-eyebrow light">Your selection</span>
        <h1>Reservation cart</h1>
        <p>
          {checkInLabel && checkOutLabel
            ? `${checkInLabel} → ${checkOutLabel} · ${nights} ${nights === 1 ? "night" : "nights"}`
            : "Add dates at checkout"}
        </p>
      </div>

      <div className="cart-grid">
        <ul className="cart-list">
          {items.map((item) => (
            <motion.li
              key={item.id}
              className="cart-item"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <img src={item.image} alt={item.name} />
              <div className="cart-item-info">
                <Link to={`/rooms/${item.id}`} className="cart-item-title">
                  {item.name}
                </Link>
                <p className="cart-item-meta">
                  &#8377; {item.price.toLocaleString("en-IN")} per night · {nights}{" "}
                  {nights === 1 ? "night" : "nights"}
                </p>
              </div>
              <div className="cart-item-total">
                <span>Stay total</span>
                <strong>
                  &#8377; {(item.price * nights).toLocaleString("en-IN")}
                </strong>
              </div>
              <button
                type="button"
                className="btn btn-ghost"
                onClick={() => removeItem(item.id)}
                aria-label={`Remove ${item.name}`}
              >
                Remove
              </button>
            </motion.li>
          ))}
        </ul>

        <aside className="cart-summary">
          <h2>Price summary</h2>
          <div className="cart-summary-row">
            <span>
              Subtotal ({nights} {nights === 1 ? "night" : "nights"})
            </span>
            <span>&#8377; {subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="cart-summary-row">
            <span>Taxes &amp; service</span>
            <span>&#8377; {taxes.toLocaleString("en-IN")}</span>
          </div>
          <div className="cart-summary-row total">
            <span>Total</span>
            <strong>&#8377; {total.toLocaleString("en-IN")}</strong>
          </div>
          <p className="cart-note">No charge until confirmation.</p>

          <div className="cart-actions">
            <Link to="/checkout" className="btn btn-gold">
              Proceed to checkout
              <Icon name="arrow" size={16} />
            </Link>
            <button type="button" className="btn btn-ghost" onClick={clearCart}>
              Clear selection
            </button>
            <button
              type="button"
              className="btn btn-outline-gold"
              onClick={() => navigate("/rooms")}
            >
              Continue browsing
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}

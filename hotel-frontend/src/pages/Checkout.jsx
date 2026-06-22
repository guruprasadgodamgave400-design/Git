import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { api } from "../services/api";
import { useCart } from "../context/useCart";
import { useBooking } from "../context/useBooking";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  pincode: "",
  country: "India",
  arrivalTime: "",
  specialRequests: "",
  payment: "card",
};

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart();
  const { checkIn, checkOut, nights, guests } = useBooking();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) return;
    setSubmitting(true);
    setError(null);

    const booking = {
      customer: form,
      stay: {
        checkIn: checkIn?.toISOString(),
        checkOut: checkOut?.toISOString(),
        nights,
        guests,
      },
      items: items.map((it) => ({
        id: it.id,
        name: it.name,
        price: it.price,
        nights,
      })),
      subtotal,
      total: Math.round(subtotal * 1.12),
    };

    api
      .placeBooking(booking)
      .then((receipt) => {
        clearCart();
        navigate("/order-success", { state: { receipt } });
      })
      .catch((err) => {
        setError(err.message || "Failed to place booking");
        setSubmitting(false);
      });
  }

  if (items.length === 0) {
    return (
      <section className="cart-empty">
        <h1>Nothing to check out</h1>
        <p>Add a room to your reservation list before continuing.</p>
        <Link to="/rooms" className="btn btn-gold">
          Browse rooms
        </Link>
      </section>
    );
  }

  const taxes = Math.round(subtotal * 0.12);
  const total = subtotal + taxes;

  return (
    <section className="checkout">
      <div className="cart-banner small">
        <span className="section-eyebrow light">Step 2 of 3</span>
        <h1>Guest details &amp; payment</h1>
        <p>
          {checkIn && checkOut
            ? `Stay · ${format(checkIn, "d MMM")} → ${format(checkOut, "d MMM yyyy")} · ${nights} ${nights === 1 ? "night" : "nights"} · ${guests} ${guests === 1 ? "guest" : "guests"}`
            : "Stay dates pending"}
        </p>
      </div>

      <div className="checkout-grid">
        <motion.form
          className="checkout-form"
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2>Primary guest</h2>
          <div className="form-row">
            <label>
              Full name
              <input
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                autoComplete="name"
              />
            </label>
            <label>
              Email
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              Phone
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                autoComplete="tel"
              />
            </label>
            <label>
              Estimated arrival time
              <select
                name="arrivalTime"
                value={form.arrivalTime}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option>Before 12:00 PM</option>
                <option>12:00 PM – 3:00 PM</option>
                <option>3:00 PM – 6:00 PM</option>
                <option>6:00 PM – 9:00 PM</option>
                <option>After 9:00 PM</option>
              </select>
            </label>
          </div>

          <h2>Billing address</h2>
          <div className="form-row">
            <label>
              Address
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                required
                autoComplete="street-address"
              />
            </label>
            <label>
              Country
              <input
                name="country"
                value={form.country}
                onChange={handleChange}
                required
              />
            </label>
          </div>
          <div className="form-row">
            <label>
              City
              <input
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
            </label>
            <label>
              Pincode
              <input
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                required
                autoComplete="postal-code"
              />
            </label>
          </div>

          <label>
            Special requests
            <textarea
              name="specialRequests"
              value={form.specialRequests}
              onChange={handleChange}
              rows={3}
              placeholder="Allergies, accessibility, celebrations..."
            />
          </label>

          <h2>Payment method</h2>
          <div className="payment-options">
            {[
              { value: "card", label: "Credit / Debit card" },
              { value: "upi", label: "UPI" },
              { value: "hotel", label: "Pay at hotel" },
            ].map((opt) => (
              <label key={opt.value} className="payment-option">
                <input
                  type="radio"
                  name="payment"
                  value={opt.value}
                  checked={form.payment === opt.value}
                  onChange={handleChange}
                />
                {opt.label}
              </label>
            ))}
          </div>

          {error && <p className="status status-error">{error}</p>}

          <button type="submit" className="btn btn-gold checkout-submit" disabled={submitting}>
            {submitting
              ? "Confirming reservation..."
              : `Confirm reservation · \u20B9 ${total.toLocaleString("en-IN")}`}
          </button>
        </motion.form>

        <aside className="checkout-summary">
          <h2>Stay summary</h2>
          <ul className="summary-list">
            {items.map((it) => (
              <li key={it.id}>
                <span>{it.name}</span>
                <span>
                  &#8377; {(it.price * nights).toLocaleString("en-IN")}
                </span>
              </li>
            ))}
          </ul>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>&#8377; {subtotal.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row">
            <span>Taxes &amp; service</span>
            <span>&#8377; {taxes.toLocaleString("en-IN")}</span>
          </div>
          <div className="summary-row total">
            <span>Total payable</span>
            <strong>&#8377; {total.toLocaleString("en-IN")}</strong>
          </div>
          <p className="checkout-fine">
            Free cancellation up to 24 hours before check-in. After that, one night's
            stay will be charged.
          </p>
        </aside>
      </div>
    </section>
  );
}

import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function OrderSuccess() {
  const { state } = useLocation();
  const receipt = state?.receipt;

  return (
    <section className="order-success">
      <motion.div
        className="success-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="success-icon" aria-hidden="true">&#10003;</div>
        <span className="section-eyebrow">Reservation confirmed</span>
        <h1>We can't wait to welcome you.</h1>
        {receipt ? (
          <>
            <p>
              Your stay is booked from{" "}
              <strong>
                {receipt.stay?.checkIn
                  ? format(new Date(receipt.stay.checkIn), "d MMM yyyy")
                  : "—"}
              </strong>{" "}
              to{" "}
              <strong>
                {receipt.stay?.checkOut
                  ? format(new Date(receipt.stay.checkOut), "d MMM yyyy")
                  : "—"}
              </strong>
              .
            </p>
            <p className="receipt-id">
              Booking reference: <strong>{receipt.bookingId}</strong>
            </p>
          </>
        ) : (
          <p>Your booking has been placed.</p>
        )}
        <p>A confirmation has been sent to your email.</p>
        <Link to="/" className="btn btn-gold">
          Return home
        </Link>
      </motion.div>
    </section>
  );
}

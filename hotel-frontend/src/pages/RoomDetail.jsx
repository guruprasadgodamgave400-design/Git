import { useEffect, useReducer, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import DatePicker from "react-datepicker";
import { api } from "../services/api";
import { useBooking } from "../context/useBooking";
import { useCart } from "../context/useCart";
import { FadeUp, Stagger, StaggerItem } from "../components/motion";
import Icon from "../components/Icon";

const initialState = { room: null, reviews: [], status: "loading", error: null };

function reducer(state, action) {
  switch (action.type) {
    case "success":
      return { room: action.room, reviews: action.reviews, status: "ready", error: null };
    case "error":
      return { room: null, reviews: [], status: "error", error: action.error };
    default:
      return state;
  }
}

function Stars({ rating }) {
  return (
    <span className="room-stars" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          size={14}
          className={`room-star ${i < Math.round(rating) ? "filled" : ""}`}
        />
      ))}
      <strong>{rating.toFixed(1)}</strong>
    </span>
  );
}

function Gallery({ images, name }) {
  const [active, setActive] = useState(0);
  return (
    <div className="rd-gallery">
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          className="rd-gallery-main"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4 }}
        >
          <img src={images[active]} alt={`${name} ${active + 1}`} />
        </motion.div>
      </AnimatePresence>
      <div className="rd-gallery-thumbs" role="tablist">
        {images.map((src, i) => (
          <button
            type="button"
            key={src + i}
            role="tab"
            aria-selected={active === i}
            onClick={() => setActive(i)}
            className={`rd-thumb ${active === i ? "active" : ""}`}
          >
            <img src={src} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <StaggerItem className="rd-review-wrap">
      <motion.article
        className="rd-review"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
      >
        <header>
          <Stars rating={review.rating} />
          <time>{new Date(review.date).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</time>
        </header>
        <h4>{review.title}</h4>
        <p>"{review.body}"</p>
        <footer>
          <strong>{review.author}</strong>
          <span>{review.location}</span>
        </footer>
      </motion.article>
    </StaggerItem>
  );
}

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, nights, setCheckIn, setCheckOut, setGuests } = useBooking();
  const { addItem } = useCart();
  const [state, dispatch] = useReducer(reducer, initialState);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    Promise.all([api.getRoomById(id), api.getReviewsForRoom(id)])
      .then(([room, reviews]) => {
        if (!cancelled) dispatch({ type: "success", room, reviews });
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: "error", error: err.message || "Failed to load room" });
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const { room, reviews, status, error } = state;
  const loading = status === "loading";

  const totalPrice = room ? room.price * nights : 0;

  function handleReserve() {
    if (!room) return;
    addItem(
      {
        id: room.id,
        name: room.name,
        price: room.price,
        image: room.image,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  function handleBookNow() {
    if (!room) return;
    addItem(
      {
        id: room.id,
        name: room.name,
        price: room.price,
        image: room.image,
      },
      1
    );
    navigate("/checkout");
  }

  if (loading) return <p className="status">Loading room...</p>;
  if (error) return <p className="status status-error">Error: {error}</p>;
  if (!room) return <p className="status">Room not found.</p>;

  return (
    <section className="rd">
      <Link to="/rooms" className="back-link">
        &larr; Back to all rooms
      </Link>

      <div className="rd-head">
        <div>
          <FadeUp>
            <span className="section-eyebrow">{room.view}</span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1>{room.name}</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="rd-tagline">{room.tagline}</p>
          </FadeUp>
          <FadeUp delay={0.15}>
            <div className="rd-head-meta">
              <Stars rating={room.rating} />
              <span>{room.reviewsCount} reviews</span>
              <span>{room.bed}</span>
              <span>{room.size}</span>
            </div>
          </FadeUp>
        </div>
      </div>

      <Gallery images={room.gallery} name={room.name} />

      <div className="rd-grid">
        <div className="rd-content">
          <FadeUp>
            <h2>About this room</h2>
          </FadeUp>
          <FadeUp delay={0.05}>
            <p className="rd-description">{room.description}</p>
          </FadeUp>

          <FadeUp delay={0.1}>
            <h2>Amenities</h2>
          </FadeUp>
          <Stagger className="rd-amenities" stagger={0.05}>
            {room.amenities.map((a) => (
              <StaggerItem key={a} className="rd-amenity">
                <Icon name="star" size={14} className="rd-amenity-icon" />
                <span>{a}</span>
              </StaggerItem>
            ))}
          </Stagger>

          <FadeUp delay={0.1}>
            <h2>Guest reviews</h2>
          </FadeUp>
          {reviews.length === 0 ? (
            <p className="status">No reviews yet for this room.</p>
          ) : (
            <Stagger className="rd-reviews" stagger={0.08}>
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={r} />
              ))}
            </Stagger>
          )}
        </div>

        <aside className="rd-booking-card">
          <FadeUp>
            <p className="rd-booking-from">From</p>
            <p className="rd-booking-price">
              &#8377; {room.price.toLocaleString("en-IN")}
              <span> / night</span>
            </p>
          </FadeUp>

          <FadeUp delay={0.05}>
            <div className="rd-booking-fields">
              <label>
                <span>Check-in</span>
                <DatePicker
                  selected={checkIn}
                  onChange={(d) => setCheckIn(d)}
                  selectsStart
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={new Date()}
                  dateFormat="d MMM yyyy"
                  className="rd-booking-input"
                  calendarClassName="luxe-calendar"
                />
              </label>
              <label>
                <span>Check-out</span>
                <DatePicker
                  selected={checkOut}
                  onChange={(d) => setCheckOut(d)}
                  selectsEnd
                  startDate={checkIn}
                  endDate={checkOut}
                  minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
                  dateFormat="d MMM yyyy"
                  className="rd-booking-input"
                  calendarClassName="luxe-calendar"
                />
              </label>
              <label>
                <span>Guests</span>
                <select
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="rd-booking-input"
                >
                  {Array.from({ length: room.guests }).map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1} {i === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </FadeUp>

          <FadeUp delay={0.1}>
            <div className="rd-booking-totals">
              <div>
                <span>
                  &#8377; {room.price.toLocaleString("en-IN")} × {nights}{" "}
                  {nights === 1 ? "night" : "nights"}
                </span>
                <strong>&#8377; {totalPrice.toLocaleString("en-IN")}</strong>
              </div>
              <div>
                <span>Taxes &amp; fees</span>
                <strong>&#8377; {Math.round(totalPrice * 0.12).toLocaleString("en-IN")}</strong>
              </div>
              <div className="rd-booking-grand">
                <span>Total</span>
                <strong>
                  &#8377; {Math.round(totalPrice * 1.12).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>
          </FadeUp>

          <FadeUp delay={0.15}>
            <button
              type="button"
              className="btn btn-gold rd-booking-cta"
              onClick={handleBookNow}
            >
              Reserve now
            </button>
          </FadeUp>
          <FadeUp delay={0.2}>
            <button
              type="button"
              className="btn btn-outline-gold rd-booking-secondary"
              onClick={handleReserve}
            >
              {added ? "Added to cart" : "Add to cart"}
            </button>
          </FadeUp>
          <p className="rd-booking-note">No charge until confirmation · Free cancellation 24h prior</p>
        </aside>
      </div>
    </section>
  );
}

import { useEffect, useMemo, useReducer, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Icon from "../components/Icon";
import BookingSearchBar from "../components/BookingSearchBar";
import { FadeUp, Stagger, StaggerItem } from "../components/motion";

const initialState = { rooms: [], status: "loading", error: null };

function reducer(state, action) {
  switch (action.type) {
    case "success":
      return { rooms: action.rooms, status: "ready", error: null };
    case "error":
      return { ...state, status: "error", error: action.error };
    default:
      return state;
  }
}

function Stars({ rating }) {
  return (
    <span className="room-stars small">
      <Icon name="star" size={12} className="room-star" />
      {rating.toFixed(1)}
    </span>
  );
}

function RoomRow({ room }) {
  return (
    <StaggerItem className="rooms-row-wrap">
      <motion.article
        className="rooms-row"
        whileHover={{ y: -3 }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/rooms/${room.id}`} className="rooms-row-image">
          <img src={room.image} alt={room.name} loading="lazy" />
        </Link>
        <div className="rooms-row-body">
          <span className="rooms-row-tagline">{room.tagline}</span>
          <h3>
            <Link to={`/rooms/${room.id}`}>{room.name}</Link>
          </h3>
          <ul className="rooms-row-meta">
            <li>
              <Icon name="concierge" size={14} /> {room.bed}
            </li>
            <li>
              <Icon name="spa" size={14} /> {room.size}
            </li>
            <li>
              <Icon name="location" size={14} /> {room.view}
            </li>
            <li>Up to {room.guests} guests</li>
          </ul>
          <p className="rooms-row-amenity-count">
            {room.amenities.length} curated amenities
          </p>
        </div>
        <div className="rooms-row-aside">
          <Stars rating={room.rating} />
          <span className="rooms-row-reviews">
            {room.reviewsCount} reviews
          </span>
          <div className="rooms-row-price">
            <span>From</span>
            <strong>&#8377; {room.price.toLocaleString("en-IN")}</strong>
            <span className="rooms-row-unit">/ night</span>
          </div>
          <Link to={`/rooms/${room.id}`} className="btn btn-gold rooms-row-cta">
            Select suite
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

export default function Rooms() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState("recommended");

  useEffect(() => {
    let cancelled = false;
    api
      .getRooms()
      .then((data) => {
        if (!cancelled) dispatch({ type: "success", rooms: data });
      })
      .catch((err) => {
        if (!cancelled)
          dispatch({ type: "error", error: err.message || "Failed to load rooms" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { rooms, status, error } = state;
  const loading = status === "loading";

  const categories = useMemo(() => {
    const set = new Set(rooms.map((r) => r.view));
    return ["All", ...Array.from(set)];
  }, [rooms]);

  const filtered = useMemo(() => {
    let list = category === "All" ? rooms : rooms.filter((r) => r.view === category);
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [rooms, category, sort]);

  return (
    <section className="rooms">
      <div className="rooms-banner">
        <div className="rooms-banner-content">
          <FadeUp>
            <span className="section-eyebrow light">Stay with us</span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h1>Rooms &amp; suites</h1>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p>
              Find the perfect room for your stay — every option includes complimentary
              Wi-Fi, daily housekeeping and access to the spa and fitness studio.
            </p>
          </FadeUp>
        </div>
        <FadeUp delay={0.2}>
          <div className="rooms-search">
            <BookingSearchBar variant="inline" />
          </div>
        </FadeUp>
      </div>

      <div className="rooms-toolbar">
        <div className="rooms-filters" role="tablist" aria-label="Filter by view">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={category === c}
              className={`chip ${category === c ? "chip-active" : ""}`}
              onClick={() => setCategory(c)}
            >
              {c}
            </button>
          ))}
        </div>
        <label className="rooms-sort">
          <span>Sort by</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
            <option value="rating">Guest rating</option>
          </select>
        </label>
      </div>

      {loading && <p className="status">Loading rooms...</p>}
      {error && <p className="status status-error">Error: {error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="status">No rooms match your filters.</p>
      )}

      <Stagger className="rooms-list">
        {filtered.map((room) => (
          <RoomRow key={room.id} room={room} />
        ))}
      </Stagger>
    </section>
  );
}

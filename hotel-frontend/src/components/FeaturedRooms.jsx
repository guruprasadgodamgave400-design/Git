import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Icon from "./Icon";
import { FadeUp, Stagger, StaggerItem } from "./motion";

function Stars({ rating }) {
  return (
    <span className="room-stars" aria-label={`Rated ${rating} out of 5`}>
      <Icon name="star" size={14} className="room-star" />
      <span>{rating.toFixed(1)}</span>
    </span>
  );
}

function RoomCard({ room }) {
  return (
    <StaggerItem className="room-card-wrap">
      <motion.article
        className="room-card"
        whileHover={{ y: -6 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="room-card-media">
          <img src={room.image} alt={room.name} loading="lazy" />
          <div className="room-card-media-overlay" />
          <span className="room-card-badge">
            {room.view}
          </span>
          <Stars rating={room.rating} />
        </div>
        <div className="room-card-body">
          <p className="room-card-tagline">{room.tagline}</p>
          <h3 className="room-card-title">{room.name}</h3>
          <ul className="room-card-meta">
            <li>{room.bed}</li>
            <li>{room.size}</li>
            <li>Up to {room.guests} guests</li>
          </ul>
          <div className="room-card-footer">
            <div className="room-card-price">
              <span className="room-card-price-from">From</span>
              <strong>&#8377; {room.price.toLocaleString("en-IN")}</strong>
              <span className="room-card-price-unit">/ night</span>
            </div>
            <Link to={`/rooms/${room.id}`} className="btn btn-gold room-card-cta">
              View suite
              <Icon name="arrow" size={16} />
            </Link>
          </div>
        </div>
      </motion.article>
    </StaggerItem>
  );
}

export default function FeaturedRooms() {
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    api.getRooms().then((data) => setRooms(data.filter((r) => r.featured).slice(0, 3)));
  }, []);

  return (
    <section className="section featured" id="featured-rooms">
      <div className="section-head">
        <FadeUp>
          <span className="section-eyebrow">Signature stays</span>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h2 className="section-title">Rooms &amp; suites, handpicked for you</h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="section-sub">
            From heritage rooms to our flagship penthouse, every stay is finished with
            bespoke amenities and around-the-clock butler service.
          </p>
        </FadeUp>
      </div>

      <Stagger className="room-grid">
        {rooms.map((room) => (
          <RoomCard key={room.id} room={room} />
        ))}
      </Stagger>

      <FadeUp delay={0.15}>
        <div className="section-foot">
          <Link to="/rooms" className="btn btn-outline-gold">
            Explore all rooms
            <Icon name="arrow" size={16} />
          </Link>
        </div>
      </FadeUp>
    </section>
  );
}

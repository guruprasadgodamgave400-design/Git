import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import Icon from "./Icon";
import { FadeUp, Stagger, StaggerItem } from "./motion";

export default function Amenities() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getAmenities().then(setItems);
  }, []);

  return (
    <section className="section amenities" id="amenities">
      <div className="amenities-grid">
        <div className="section-head amenities-head">
          <FadeUp>
            <span className="section-eyebrow light">The hotel</span>
          </FadeUp>
          <FadeUp delay={0.05}>
            <h2 className="section-title light">Considered amenities, effortlessly delivered.</h2>
          </FadeUp>
          <FadeUp delay={0.1}>
            <p className="section-sub light">
              Eight signature facilities, each designed to make every moment of your stay
              feel curated — from dawn yoga to last-call nightcaps.
            </p>
          </FadeUp>
        </div>

        <Stagger className="amenities-list">
          {items.map((a) => (
            <StaggerItem key={a.id} className="amenity-wrap">
              <motion.div
                className="amenity"
                whileHover={{ y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="amenity-icon">
                  <Icon name={a.icon} size={26} />
                </div>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { FadeUp, Stagger, StaggerItem } from "./motion";
import Icon from "./Icon";

export default function Offers() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getOffers().then(setItems);
  }, []);

  return (
    <section className="section offers" id="offers">
      <div className="section-head">
        <FadeUp>
          <span className="section-eyebrow">Curated offers</span>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h2 className="section-title">Stay more, save more.</h2>
        </FadeUp>
        <FadeUp delay={0.1}>
          <p className="section-sub">
            Exclusive packages designed for longer stays, romantic escapes and advance
            planners — best price guaranteed when you book direct.
          </p>
        </FadeUp>
      </div>

      <Stagger className="offer-grid" stagger={0.1}>
        {items.map((o) => (
          <StaggerItem key={o.id} className="offer-wrap">
            <motion.article
              className="offer-card"
              whileHover={{ y: -6 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <span className="offer-badge">{o.badge}</span>
              <h3>{o.title}</h3>
              <p>{o.description}</p>
              <Link to="/rooms" className="offer-cta">
                {o.cta}
                <Icon name="arrow" size={16} />
              </Link>
            </motion.article>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

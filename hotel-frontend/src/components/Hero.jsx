import { motion } from "framer-motion";
import BookingSearchBar from "./BookingSearchBar";
import { heroStats } from "../data/rooms";
import { FadeUp } from "./motion";
import Icon from "./Icon";

export default function Hero() {
  return (
    <section className="hero" aria-label="Welcome">
      <div className="hero-media" aria-hidden="true">
        <div className="hero-overlay" />
        <div className="hero-grain" />
      </div>

      <div className="hero-content">
        <FadeUp>
          <span className="hero-eyebrow">
            <span className="hero-eyebrow-dot" /> Est. 1994 · Five-Star Luxury
          </span>
        </FadeUp>

        <FadeUp delay={0.1}>
          <h1 className="hero-title">
            A quiet sanctuary,
            <br />
            <span className="hero-title-accent">crafted for the senses.</span>
          </h1>
        </FadeUp>

        <FadeUp delay={0.2}>
          <p className="hero-sub">
            Stay at Aurelia — where timeless architecture, intuitive service and considered
            cuisine come together on the city's most coveted address.
          </p>
        </FadeUp>

        <FadeUp delay={0.3}>
          <div className="hero-search">
            <BookingSearchBar variant="hero" />
          </div>
        </FadeUp>

        <FadeUp delay={0.45}>
          <ul className="hero-stats">
            {heroStats.map((s, i) => (
              <motion.li
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </motion.li>
            ))}
          </ul>
        </FadeUp>
      </div>

      <FadeUp delay={0.4}>
        <div className="hero-scroll" aria-hidden="true">
          <span>Scroll to explore</span>
          <Icon name="arrow" size={18} className="hero-scroll-icon" />
        </div>
      </FadeUp>
    </section>
  );
}

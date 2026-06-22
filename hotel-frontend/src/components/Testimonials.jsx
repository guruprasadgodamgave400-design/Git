import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { api } from "../services/api";
import { FadeUp, Stagger, StaggerItem } from "./motion";
import Icon from "./Icon";

export default function Testimonials() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getTestimonials().then(setItems);
  }, []);

  return (
    <section className="section testimonials" id="testimonials">
      <div className="section-head center">
        <FadeUp>
          <span className="section-eyebrow">In their words</span>
        </FadeUp>
        <FadeUp delay={0.05}>
          <h2 className="section-title">Stories from our guests.</h2>
        </FadeUp>
      </div>

      <Stagger className="testimonial-grid" stagger={0.12}>
        {items.map((t) => (
          <StaggerItem key={t.id} className="testimonial-wrap">
            <motion.figure
              className="testimonial"
              whileHover={{ y: -4 }}
              transition={{ duration: 0.3 }}
            >
              <Icon name="star" size={22} className="testimonial-quote-icon" />
              <blockquote>"{t.quote}"</blockquote>
              <figcaption>
                <strong>{t.author}</strong>
                <span>{t.role}</span>
              </figcaption>
            </motion.figure>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}

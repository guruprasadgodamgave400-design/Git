import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, NavLink } from "react-router-dom";
import { useCart } from "../context/useCart";
import Icon from "./Icon";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/rooms", label: "Rooms & Suites" },
  { to: "/amenities", label: "Amenities" },
  { to: "/offers", label: "Offers" },
  { to: "/cart", label: "Cart" },
];

export default function Navbar() {
  const { totalItems } = useCart();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <div className="nav-inner">
          <Link to="/" className="nav-brand" onClick={() => setOpen(false)}>
            <span className="nav-brand-mark">A</span>
            <span className="nav-brand-text">
              <span className="nav-brand-name">Aurelia</span>
              <span className="nav-brand-tagline">Grand Hotel & Spa</span>
            </span>
          </Link>

          <nav className="nav-links-desktop" aria-label="Primary">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
              >
                {l.label}
                {l.to === "/cart" && totalItems > 0 && (
                  <span className="nav-cart-badge">{totalItems}</span>
                )}
              </NavLink>
            ))}
          </nav>

          <div className="nav-actions">
            <Link to="/rooms" className="btn btn-gold nav-cta">
              Book a stay
            </Link>
            <button
              type="button"
              className="nav-burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
            >
              <Icon name="menu" size={24} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav-drawer-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => setOpen(false)}
            />
            <motion.aside
              className="nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 36 }}
              role="dialog"
              aria-label="Menu"
            >
              <div className="nav-drawer-head">
                <span className="nav-brand-mark">A</span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="nav-drawer-close"
                >
                  <Icon name="close" size={22} />
                </button>
              </div>
              <nav className="nav-drawer-links" aria-label="Mobile">
                {links.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.end}
                    onClick={() => setOpen(false)}
                    className={({ isActive }) =>
                      `nav-drawer-link ${isActive ? "active" : ""}`
                    }
                  >
                    <span>{l.label}</span>
                    <Icon name="arrow" size={18} />
                  </NavLink>
                ))}
              </nav>
              <Link
                to="/rooms"
                onClick={() => setOpen(false)}
                className="btn btn-gold nav-drawer-cta"
              >
                Book a stay
              </Link>
              <p className="nav-drawer-foot">Concierge · +91 22 4000 1100</p>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

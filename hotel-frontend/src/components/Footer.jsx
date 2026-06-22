import { Link } from "react-router-dom";
import Icon from "./Icon";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <span className="nav-brand-mark">A</span>
          <div>
            <strong>Aurelia Grand Hotel &amp; Spa</strong>
            <p>A quiet sanctuary, crafted for the senses.</p>
          </div>
        </div>

        <div className="footer-cols">
          <div>
            <h4>Hotel</h4>
            <ul>
              <li><Link to="/rooms">Rooms &amp; suites</Link></li>
              <li><Link to="/amenities">Amenities</Link></li>
              <li><Link to="/offers">Special offers</Link></li>
            </ul>
          </div>
          <div>
            <h4>Concierge</h4>
            <ul>
              <li>+91 22 4000 1100</li>
              <li>concierge@aurelia.example</li>
              <li>14 Marine Drive, Mumbai 400020</li>
            </ul>
          </div>
          <div>
            <h4>Follow</h4>
            <ul className="footer-social">
              <li><a href="#">Instagram</a></li>
              <li><a href="#">Facebook</a></li>
              <li><a href="#">Pinterest</a></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer-base">
        <p>&copy; {new Date().getFullYear()} Aurelia Grand Hotel &amp; Spa. All rights reserved.</p>
        <p className="footer-policy">Privacy · Terms · Sitemap</p>
      </div>
    </footer>
  );
}

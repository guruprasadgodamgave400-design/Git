import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../context/useBooking";
import Icon from "./Icon";

function Field({ label, icon, children }) {
  return (
    <label className="bsb-field">
      <span className="bsb-label">{label}</span>
      <span className="bsb-input-wrap">
        {icon && <Icon name={icon} size={18} className="bsb-input-icon" />}
        {children}
      </span>
    </label>
  );
}

function GuestDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onDoc(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  return (
    <div className="bsb-guest" ref={ref}>
      <button
        type="button"
        className="bsb-guest-trigger"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="bsb-guest-value">
          {value} {value === 1 ? "Guest" : "Guests"}
        </span>
      </button>
      {open && (
        <div className="bsb-guest-panel" role="listbox">
          <p className="bsb-guest-title">Guests</p>
          <div className="bsb-guest-controls">
            <button
              type="button"
              onClick={() => onChange(Math.max(1, value - 1))}
              aria-label="Decrease guests"
            >
              &minus;
            </button>
            <span>{value}</span>
            <button
              type="button"
              onClick={() => onChange(Math.min(8, value + 1))}
              aria-label="Increase guests"
            >
              +
            </button>
          </div>
          <p className="bsb-guest-hint">Up to 8 guests per room</p>
        </div>
      )}
    </div>
  );
}

export default function BookingSearchBar({ variant = "hero" }) {
  const navigate = useNavigate();
  const { checkIn, checkOut, guests, setCheckIn, setCheckOut, setGuests } = useBooking();

  function handleSubmit(event) {
    event.preventDefault();
    navigate("/rooms");
  }

  return (
    <form className={`bsb bsb-${variant}`} onSubmit={handleSubmit} role="search">
      <Field label="Check-in" icon="event">
        <DatePicker
          selected={checkIn}
          onChange={(d) => setCheckIn(d)}
          selectsStart
          startDate={checkIn}
          endDate={checkOut}
          minDate={new Date()}
          dateFormat="EEE, d MMM"
          className="bsb-input"
          calendarClassName="luxe-calendar"
        />
      </Field>
      <span className="bsb-divider" aria-hidden="true" />
      <Field label="Check-out" icon="event">
        <DatePicker
          selected={checkOut}
          onChange={(d) => setCheckOut(d)}
          selectsEnd
          startDate={checkIn}
          endDate={checkOut}
          minDate={checkIn ? new Date(checkIn.getTime() + 86400000) : new Date()}
          dateFormat="EEE, d MMM"
          className="bsb-input"
          calendarClassName="luxe-calendar"
        />
      </Field>
      <span className="bsb-divider" aria-hidden="true" />
      <Field label="Guests">
        <GuestDropdown value={guests} onChange={setGuests} />
      </Field>
      <button type="submit" className="bsb-submit">
        <Icon name="search" size={18} />
        <span>Check availability</span>
      </button>
    </form>
  );
}

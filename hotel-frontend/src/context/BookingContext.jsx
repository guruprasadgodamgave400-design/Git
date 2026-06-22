import { useCallback, useEffect, useMemo, useState } from "react";
import { differenceInCalendarDays, addDays } from "date-fns";
import { BookingContext } from "./booking-context";

const STORAGE_KEY = "hotel-frontend:booking";

const today = () => {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
};

function readInitial() {
  const defaults = {
    checkIn: today(),
    checkOut: addDays(today(), 2),
    guests: 2,
  };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      checkIn: parsed.checkIn ? new Date(parsed.checkIn) : defaults.checkIn,
      checkOut: parsed.checkOut ? new Date(parsed.checkOut) : defaults.checkOut,
      guests: Number(parsed.guests) || defaults.guests,
    };
  } catch {
    return defaults;
  }
}

export function BookingProvider({ children }) {
  const [search, setSearch] = useState(readInitial);

  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          checkIn: search.checkIn?.toISOString?.() ?? null,
          checkOut: search.checkOut?.toISOString?.() ?? null,
          guests: search.guests,
        })
      );
    } catch {
      // ignore
    }
  }, [search]);

  const setCheckIn = useCallback((date) => {
    setSearch((prev) => {
      const nextIn = date ?? today();
      const nextOut =
        prev.checkOut && differenceInCalendarDays(prev.checkOut, nextIn) >= 1
          ? prev.checkOut
          : addDays(nextIn, 1);
      return { ...prev, checkIn: nextIn, checkOut: nextOut };
    });
  }, []);

  const setCheckOut = useCallback((date) => {
    setSearch((prev) => {
      if (!date) return prev;
      if (differenceInCalendarDays(date, prev.checkIn) < 1) return prev;
      return { ...prev, checkOut: date };
    });
  }, []);

  const setGuests = useCallback((n) => {
    setSearch((prev) => ({ ...prev, guests: Math.max(1, Math.min(8, Number(n) || 1)) }));
  }, []);

  const nights = useMemo(() => {
    if (!search.checkIn || !search.checkOut) return 1;
    const n = differenceInCalendarDays(search.checkOut, search.checkIn);
    return n > 0 ? n : 1;
  }, [search.checkIn, search.checkOut]);

  const value = useMemo(
    () => ({
      checkIn: search.checkIn,
      checkOut: search.checkOut,
      guests: search.guests,
      nights,
      setCheckIn,
      setCheckOut,
      setGuests,
    }),
    [search, nights, setCheckIn, setCheckOut, setGuests]
  );

  return <BookingContext.Provider value={value}>{children}</BookingContext.Provider>;
}

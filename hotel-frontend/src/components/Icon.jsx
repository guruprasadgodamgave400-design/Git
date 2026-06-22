const paths = {
  spa: (
    <>
      <path d="M12 3c1.5 3 1.5 6 0 9-1.5-3-1.5-6 0-9z" />
      <path d="M5 14c2 1 4 1 6 0" />
      <path d="M13 14c2 1 4 1 6 0" />
      <path d="M12 12c-3 2-5 5-5 9h10c0-4-2-7-5-9z" />
    </>
  ),
  pool: (
    <>
      <path d="M2 17c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <path d="M2 21c1.5 0 1.5 1 3 1s1.5-1 3-1 1.5 1 3 1 1.5-1 3-1 1.5 1 3 1 1.5-1 3-1" />
      <circle cx="12" cy="9" r="3" />
      <path d="M12 6V3M9 9H6M15 9h3M12 12v3" />
    </>
  ),
  dining: (
    <>
      <path d="M6 2v9a2 2 0 002 2v9" />
      <path d="M10 2v9a2 2 0 01-2 2" />
      <path d="M14 14V2c2 0 4 2 4 6s-2 6-4 6z" />
    </>
  ),
  bar: (
    <>
      <path d="M6 2h12l-3 8H9L6 2z" />
      <path d="M12 10v12" />
    </>
  ),
  gym: (
    <>
      <path d="M3 9v6" />
      <path d="M21 9v6" />
      <path d="M6 6v12" />
      <path d="M18 6v12" />
      <path d="M6 12h12" />
    </>
  ),
  concierge: (
    <>
      <circle cx="12" cy="7" r="3" />
      <path d="M5 21l2-7h10l2 7" />
    </>
  ),
  car: (
    <>
      <path d="M3 13l2-6h14l2 6v6H3z" />
      <circle cx="7" cy="17" r="2" />
      <circle cx="17" cy="17" r="2" />
    </>
  ),
  event: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18" />
      <path d="M8 3v4M16 3v4" />
    </>
  ),
  star: (
    <path d="M12 2l3 6.5 7 1-5 5 1.2 7L12 18.5 5.8 21.5 7 14.5 2 9.5l7-1z" />
  ),
  arrow: (
    <>
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </>
  ),
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="M6 6l12 12M18 6L6 18" />,
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  location: (
    <>
      <path d="M12 22s7-7 7-12a7 7 0 10-14 0c0 5 7 12 7 12z" />
      <circle cx="12" cy="10" r="3" />
    </>
  ),
};

export default function Icon({ name, size = 24, className = "", strokeWidth = 1.6 }) {
  const node = paths[name];
  if (!node) return null;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {node}
    </svg>
  );
}

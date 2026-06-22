require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Room = require("../models/Room");
const Review = require("../models/Review");
const Content = require("../models/Content");
const { FALLBACK } = require("../controllers/content.controller");

const ROOMS = [
  {
    slug: "deluxe",
    name: "Deluxe Heritage Room",
    tagline: "City skyline views with curated art",
    price: 3200,
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600",
    ],
    bed: "1 King bed",
    guests: 2,
    size: "42 m²",
    view: "City skyline",
    rating: 4.7,
    reviewsCount: 248,
    featured: true,
    amenities: [
      "King bed with Egyptian cotton linens",
      "Rainfall shower",
      "55\" smart TV",
      "Espresso machine",
      "Complimentary high-speed Wi-Fi",
      "Daily housekeeping",
    ],
    description:
      "A sanctuary above the city, our Deluxe Heritage Room blends warm woods, soft lighting and a curated minibar. Floor-to-ceiling windows frame the skyline, while the marble bathroom features a deep soaking tub and bespoke amenities.",
    inventory: 8,
  },
  {
    slug: "suite",
    name: "Royal Signature Suite",
    tagline: "Private balcony with butler service",
    price: 7800,
    image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600",
    ],
    bed: "1 King + sofa bed",
    guests: 4,
    size: "78 m²",
    view: "Oceanfront",
    rating: 4.9,
    reviewsCount: 162,
    featured: true,
    amenities: [
      "Private wraparound balcony",
      "Personal butler service",
      "Walk-in wardrobe",
      "Jacuzzi bathtub",
      "Premium cocktail bar",
      "Lounge access included",
    ],
    description:
      "Our flagship suite offers a separate living room, marble-clad bathroom and a private balcony for sunset cocktails. Includes complimentary airport transfer and access to the Executive Lounge.",
    inventory: 4,
  },
  {
    slug: "garden",
    name: "Garden Villa",
    tagline: "Private plunge pool amid tropical gardens",
    price: 12500,
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1600",
      "https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1600",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=1600",
    ],
    bed: "1 King + day bed",
    guests: 3,
    size: "120 m²",
    view: "Private garden",
    rating: 4.95,
    reviewsCount: 89,
    featured: true,
    amenities: [
      "Private plunge pool",
      "Outdoor dining pavilion",
      "Sunken outdoor bathtub",
      "Personal villa host",
      "In-villa breakfast",
      "Buggy service on call",
    ],
    description:
      "Set within three acres of tropical gardens, the Garden Villa offers absolute privacy with a private pool, sun deck and outdoor dining pavilion. Perfect for honeymoons and milestone stays.",
    inventory: 3,
  },
  {
    slug: "executive",
    name: "Executive Club Room",
    tagline: "Business-ready with lounge access",
    price: 4500,
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600",
    ],
    bed: "1 King bed",
    guests: 2,
    size: "48 m²",
    view: "Garden courtyard",
    rating: 4.6,
    reviewsCount: 311,
    featured: false,
    amenities: [
      "Ergonomic work desk",
      "International plug points",
      "Espresso machine",
      "Express laundry",
      "Club lounge access",
      "Late checkout on request",
    ],
    description:
      "Designed for the modern traveller, the Executive Club Room offers a quiet workspace, premium connectivity and complimentary access to our Executive Lounge serving breakfast and evening canapés.",
    inventory: 10,
  },
  {
    slug: "family",
    name: "Family Residence",
    tagline: "Two-bedroom retreat for the whole family",
    price: 9200,
    image: "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1568495248636-6432b97bd949?w=1600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=1600",
    ],
    bed: "1 King + 2 singles",
    guests: 4,
    size: "95 m²",
    view: "Pool and gardens",
    rating: 4.8,
    reviewsCount: 134,
    featured: true,
    amenities: [
      "Two bedrooms with en-suite baths",
      "Kids welcome amenities",
      "Board games and Xbox",
      "Family-size bathtub",
      "In-room dining menu",
      "Babysitting on request",
    ],
    description:
      "A spacious two-bedroom residence ideal for families. Includes a curated kids' welcome kit, in-room Xbox and a bath menu designed for little ones.",
    inventory: 5,
  },
  {
    slug: "penthouse",
    name: "Skyline Penthouse",
    tagline: "Top-floor residence with rooftop terrace",
    price: 18500,
    image: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600",
    gallery: [
      "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1600",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1600",
      "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1600",
    ],
    bed: "2 King beds",
    guests: 4,
    size: "160 m²",
    view: "360° skyline",
    rating: 5.0,
    reviewsCount: 42,
    featured: true,
    amenities: [
      "Private rooftop terrace",
      "Outdoor jacuzzi",
      "Dedicated concierge",
      "Champagne welcome",
      "Private chef on request",
      "Limousine airport transfer",
    ],
    description:
      "The pinnacle of the hotel — two bedrooms, a private rooftop terrace with outdoor jacuzzi, and 360° views. Includes a dedicated concierge and complimentary champagne on arrival.",
    inventory: 2,
  },
];

const SEED_REVIEWS = [
  { slug: "deluxe", author: "Aarav Mehta", location: "Mumbai, India", rating: 5, title: "An unforgettable anniversary", body: "Every detail was considered — from the hand-written note on arrival to the rose-petal turndown. The skyline at sunset from our room is etched in memory." },
  { slug: "deluxe", author: "Priya Iyer", location: "Bengaluru, India", rating: 4, title: "Calm and refined", body: "Beautifully appointed room, attentive housekeeping and a perfect location for our city trip. The bathroom was the highlight." },
  { slug: "suite", author: "James Whitfield", location: "London, UK", rating: 5, title: "Butler service on another level", body: "The personal butler anticipated every need. We didn't have to ask for anything twice. Worth every rupee." },
  { slug: "garden", author: "Sneha Kapoor", location: "Delhi, India", rating: 5, title: "Honeymoon perfection", body: "The private plunge pool at sunrise is something else. Quiet, romantic, and the in-villa breakfast was exceptional." },
  { slug: "penthouse", author: "Hiroshi Tanaka", location: "Tokyo, Japan", rating: 5, title: "Truly world-class", body: "Stayed in the penthouse for a week. Rooftop jacuzzi under the stars, private chef dinners — service beyond any hotel I've experienced." },
  { slug: "executive", author: "Rahul Desai", location: "Pune, India", rating: 4, title: "Ideal for business", body: "Work desk, fast Wi-Fi, lounge access for evening meetings. Quiet at night and very comfortable." },
];

function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL || "admin@aurelia.example";
  const password = process.env.ADMIN_PASSWORD || "ChangeMe123!";
  const name = process.env.ADMIN_NAME || "Hotel Admin";

  const existing = await User.findOne({ email });
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await existing.save();
    }
    console.log(`[seed] Admin already exists: ${email}`);
    return existing;
  }
  const admin = await User.create({ name, email, password, role: "admin" });
  console.log(`[seed] Created admin: ${email} (password: ${password})`);
  return admin;
}

async function seedRoomsAndReviews() {
  const slugToId = new Map();
  for (const r of ROOMS) {
    const doc = await Room.findOneAndUpdate(
      { name: r.name },
      { ...r, isActive: true },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    slugToId.set(r.slug, doc._id);
  }
  console.log(`[seed] Upserted ${ROOMS.length} rooms`);

  for (const rev of SEED_REVIEWS) {
    const roomId = slugToId.get(rev.slug);
    if (!roomId) continue;
    const exists = await Review.findOne({ room: roomId, author: rev.author, title: rev.title });
    if (exists) continue;
    await Review.create({
      room: roomId,
      author: rev.author,
      location: rev.location,
      rating: rev.rating,
      title: rev.title,
      body: rev.body,
      user: null,
      approved: true,
      createdAt: daysAgo(60),
    });
  }
  console.log(`[seed] Seeded ${SEED_REVIEWS.length} reviews`);
}

async function seedContent() {
  for (const key of ["amenities", "testimonials", "offers"]) {
    await Content.set(key, FALLBACK[key]);
  }
  console.log(`[seed] Seeded content: amenities, testimonials, offers`);
}

(async function run() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("[seed] MONGO_URI is not set");
    process.exit(1);
  }
  await connectDB(uri);
  try {
    await seedAdmin();
    await seedRoomsAndReviews();
    await seedContent();
    console.log("[seed] Done");
  } catch (err) {
    console.error("[seed] Failed:", err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
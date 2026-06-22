const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const Content = require("../models/Content");

const FALLBACK = {
  amenities: [
    { id: "am-spa", icon: "spa", title: "Aurora Spa", description: "A 1,200 m² wellness sanctuary with hammam, sauna and holistic treatments." },
    { id: "am-pool", icon: "pool", title: "Rooftop Infinity Pool", description: "Heated year-round with private cabanas and skyline views." },
    { id: "am-dining", icon: "dining", title: "Three Signature Restaurants", description: "From pan-Asian to modern European, led by award-winning chefs." },
    { id: "am-bar", icon: "bar", title: "Whisky Library & Bar", description: "Curated collection of rare single malts and craft cocktails." },
    { id: "am-gym", icon: "gym", title: "24-Hour Fitness Studio", description: "State-of-the-art equipment, yoga deck and personal trainers." },
    { id: "am-concierge", icon: "concierge", title: "Personal Concierge", description: "Bespoke itineraries, reservations and private experiences, on call 24x7." },
    { id: "am-transfer", icon: "car", title: "Limousine Transfers", description: "Complimentary airport pickup in luxury sedans for suite guests." },
    { id: "am-events", icon: "event", title: "Events & Celebrations", description: "Two ballrooms and a rooftop lawn for weddings and private soirées." },
  ],
  testimonials: [
    { id: "tm-1", quote: "A standard of hospitality I've only ever experienced in the great European grand hotels. Impeccable.", author: "Eleanor Wright", role: "Travel Editor, Condé Nast" },
    { id: "tm-2", quote: "From the moment we arrived, every member of staff seemed to know our names. Pure magic.", author: "Vikram & Anita Rao", role: "Guests, Mumbai" },
    { id: "tm-3", quote: "We hosted our daughter's wedding here — the team turned it into a storybook weekend.", author: "The Mehta Family", role: "Family celebration" },
    { id: "tm-4", quote: "My favourite hotel in Asia. I return every year and it only gets better.", author: "Hiroshi Tanaka", role: "Returning guest" },
  ],
  offers: [
    { id: "off-advance", badge: "Save 20%", title: "Advance Purchase", description: "Book 30 days in advance and enjoy 20% off our best available rate, with free cancellation up to 7 days prior.", cta: "Book in advance" },
    { id: "off-extended", badge: "Stay 4, Pay 3", title: "Extended Stay", description: "Stay four consecutive nights and only pay for three — including daily breakfast and a complimentary spa credit.", cta: "Plan a longer stay" },
    { id: "off-romance", badge: "For Couples", title: "Romance Package", description: "Champagne on arrival, candlelit dinner for two and a 60-minute couples massage. Available in suites only.", cta: "Plan a romantic stay" },
  ],
};

const getContent = (key) => asyncHandler(async (_req, res) => {
  const items = await Content.get(key, FALLBACK[key] || []);
  res.json(new ApiResponse(200, { items }));
});

const setContent = (key) => asyncHandler(async (req, res) => {
  if (!Array.isArray(req.body.items)) {
    return res.status(400).json({ success: false, message: "items must be an array" });
  }
  await Content.set(key, req.body.items);
  res.json(new ApiResponse(200, { items: req.body.items }, `${key} updated`));
});

module.exports = {
  getAmenities: getContent("amenities"),
  setAmenities: setContent("amenities"),
  getTestimonials: getContent("testimonials"),
  setTestimonials: setContent("testimonials"),
  getOffers: getContent("offers"),
  setOffers: setContent("offers"),
  FALLBACK,
};
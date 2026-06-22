import axios from "axios";
import { rooms, reviews, testimonials, amenities, offers } from "../data/rooms";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12000,
});

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function unwrap(payload) {
  if (payload && typeof payload === "object" && "data" in payload && "success" in payload) {
    return payload.data;
  }
  return payload;
}

function unwrapItem(payload) {
  const data = unwrap(payload);
  if (data && typeof data === "object") {
    if ("room" in data) return data.room;
    if ("item" in data) return data.item;
    if ("items" in data) return data.items;
    return data;
  }
  return data;
}

function unwrapList(payload, key) {
  const data = unwrap(payload);
  if (data && Array.isArray(data[key])) return data[key];
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

async function getRooms(params = {}) {
  if (!API_BASE_URL) {
    await delay(150);
    return rooms;
  }
  const { data } = await client.get("/rooms", { params });
  return unwrapList(data, "rooms");
}

async function getRoomById(id) {
  if (!API_BASE_URL) {
    await delay(120);
    const room = rooms.find((r) => r.id === id);
    if (!room) throw new Error("Room not found");
    return room;
  }
  const { data } = await client.get(`/rooms/${id}`);
  return unwrapItem(data);
}

async function getReviewsForRoom(roomId) {
  if (!API_BASE_URL) {
    await delay(120);
    return reviews.filter((r) => r.roomId === roomId);
  }
  const { data } = await client.get("/reviews", { params: { roomId } });
  return unwrapList(data, "reviews");
}

async function getAmenities() {
  if (!API_BASE_URL) return amenities;
  const { data } = await client.get("/content/amenities");
  return unwrapList(data, "items");
}

async function getTestimonials() {
  if (!API_BASE_URL) return testimonials;
  const { data } = await client.get("/content/testimonials");
  return unwrapList(data, "items");
}

async function getOffers() {
  if (!API_BASE_URL) return offers;
  const { data } = await client.get("/content/offers");
  return unwrapList(data, "items");
}

async function placeBooking(payload) {
  if (!API_BASE_URL) {
    await delay(250);
    return {
      bookingId: `BK-${Date.now()}`,
      status: "confirmed",
      placedAt: new Date().toISOString(),
      ...payload,
    };
  }
  const { data } = await client.post("/bookings", payload);
  return unwrapItem(data);
}

export const api = {
  getRooms,
  getRoomById,
  getReviewsForRoom,
  getAmenities,
  getTestimonials,
  getOffers,
  placeBooking,
  isLive: Boolean(API_BASE_URL),
};
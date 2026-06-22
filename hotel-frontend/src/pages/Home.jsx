import Hero from "../components/Hero";
import FeaturedRooms from "../components/FeaturedRooms";
import Amenities from "../components/Amenities";
import Testimonials from "../components/Testimonials";
import Offers from "../components/Offers";

export default function Home() {
  return (
    <>
      <Hero />
      <FeaturedRooms />
      <Amenities />
      <Offers />
      <Testimonials />
    </>
  );
}

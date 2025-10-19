import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/autoplay";

import client1 from "../../assets/brands/amazon.png";
import client2 from "../../assets/brands/amazon_vector.png";
import client3 from "../../assets/brands/casio.png";
import client4 from "../../assets/brands/moonstar.png";
import client5 from "../../assets/brands/randstad.png";
import client6 from "../../assets/brands/start-people 1.png";
import client7 from "../../assets/brands/start.png";

const logos = [client1, client2, client3, client4, client5, client6, client7];

const ClientLogosSlider = () => {
  return (
    <section className="py-12 bg-base-100">
      <div className="container mx-auto px-4">
        <h2 className="text-center text-3xl font-bold mb-10 text-gray-700">
          We've helped thousands of sales teams
        </h2>

        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView="auto"
          centeredSlides={false}
          loop={true}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          speed={3000}
          allowTouchMove={false}
          className="!pb-4 !pt-2"
        >
          {logos.map((logo, index) => (
            <SwiperSlide
              key={index}
              className="!flex !items-center !justify-center !w-auto !h-16  transition cursor-pointer"
            >
              <img
                src={logo}
                alt={`Client ${index + 1}`}
                className="h-full object-contain max-h-10"
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ClientLogosSlider;

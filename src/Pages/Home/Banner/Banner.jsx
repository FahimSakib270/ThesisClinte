import React from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import bannerImg1 from "../../../assets/banner/banner1.png";
import bannerImg2 from "../../../assets/banner/banner2.png";
import bannerImg3 from "../../../assets/banner/banner3.png";

const Banner = () => {
  const banners = [
    { src: bannerImg1, alt: "Promotional banner 1" },
    { src: bannerImg2, alt: "Promotional banner 2" },
    { src: bannerImg3, alt: "Promotional banner 3" },
  ];

  return (
    <div className="banner-container mb-10">
      <Carousel
        autoPlay
        infiniteLoop
        showStatus={false}
        showIndicators={true}
        showThumbs={false}
        interval={4000}
        transitionTime={500}
        swipeable={true}
        emulateTouch={true}
        stopOnHover={true}
        dynamicHeight={false}
        ariaLabel="Promotional banner carousel"
      >
        {banners.map((banner, index) => (
          <div key={index}>
            <img
              src={banner.src}
              alt={banner.alt}
              loading="lazy"
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Banner;

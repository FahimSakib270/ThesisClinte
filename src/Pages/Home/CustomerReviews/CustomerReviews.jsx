// src/Pages/Home/CustomerReviews/CustomerReviews.jsx
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

// Import your image assets
import customerTop from "../../../assets/reviewImg/customer-top.png"; // Adjust path as needed
import imgQuote from "../../../assets/reviewImg/reviewQuote.png"; // Adjust path as needed

const reviews = [
  {
    id: 1,
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine.",
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    // Using initials instead of avatars for consistency with previous design
  },
  {
    id: 2,
    quote:
      "I’ve been using this for 3 weeks and my back pain has reduced significantly.",
    name: "Rasel Ahamed",
    title: "CTO",
  },
  {
    id: 3,
    quote:
      "As someone who works 8+ hours at a desk, this has been a game-changer.",
    name: "Nasir Uddin",
    title: "CEO",
  },
  {
    id: 4,
    quote:
      "My wife bought this for me as a gift — I was skeptical, but now I wear it daily.",
    name: "Tahmid Rahman",
    title: "Marketing Manager",
  },
  {
    id: 5,
    quote:
      "The adjustable straps make it fit perfectly. I even wear it while driving.",
    name: "Sadia Akter",
    title: "Freelancer",
  },
  {
    id: 6,
    quote:
      "I’m 65 and have chronic back issues. This device gives me the support I need.",
    name: "Abdul Karim",
    title: "Retired Teacher",
  },
  {
    id: 7,
    quote: "Great for students too! My son uses it during online classes.",
    name: "Farzana Islam",
    title: "Parent",
  },
  {
    id: 8,
    quote:
      "The material is breathable and doesn’t cause sweating. Perfect for long workdays.",
    name: "Mehedi Hasan",
    title: "Software Engineer",
  },
  {
    id: 9,
    quote:
      "I’ve tried many posture correctors — this one is by far the most comfortable.",
    name: "Zara Ahmed",
    title: "Fitness Instructor",
  },
  {
    id: 10,
    quote:
      "Simple to put on, easy to adjust, and actually works. Worth every penny!",
    name: "Rifat Khan",
    title: "Entrepreneur",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 bg-base-200 mb-10">
      {/* Top Image */}
      <img
        className="mx-auto mb-6"
        src={customerTop}
        alt="Customer Reviews Header"
      />

      <div className="max-w-6xl mx-auto px-4 text-center">
        {/* Section Title */}
        <h2 className="text-4xl font-bold text-black mb-2">
          What our customers are saying
        </h2>
        <p className="text-gray-500 max-w-3xl mx-auto mb-10">
          Enhance posture, mobility, and well-being effortlessly with Posture
          Pro. Achieve proper alignment, reduce pain, and strengthen your body
          with ease!
        </p>

        {/* Reviews Carousel */}
        <div className="relative max-w-2xl mx-auto">
          <Swiper
            modules={[Autoplay]}
            spaceBetween={40}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true, // Pause on hover
            }}
            centeredSlides={true}
            className="pb-6"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id}>
                <div className="bg-white shadow-lg rounded-xl p-8 text-left h-full flex flex-col justify-between transition-opacity duration-500">
                  {/* Quote Icon */}
                  <div className="text-4xl text-primary mb-4">
                    <img src={imgQuote} alt="Quote" className="w-8 h-8" />
                  </div>

                  {/* Review Text */}
                  <p className="text-gray-700 mb-6">{review.quote}</p>

                  {/* Reviewer Info */}
                  <div className="flex items-center space-x-4 mt-auto">
                    <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                      <span className="text-xl font-semibold text-white">
                        {review.name[0]}
                        {/* First letter of name as avatar */}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-md font-bold text-black">
                        {review.name}
                      </h4>
                      <p className="text-sm text-gray-500">{review.title}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;

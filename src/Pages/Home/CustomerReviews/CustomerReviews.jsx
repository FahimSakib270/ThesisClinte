import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

// Import Swiper styles
import "swiper/css";

const reviews = [
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine.",
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    avatar:
      "https://ui-avatars.com/api/?name=Awlad+Hossin&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I’ve been using this for 3 weeks and my back pain has reduced significantly.",
    name: "Rasel Ahamed",
    title: "CTO",
    avatar:
      "https://ui-avatars.com/api/?name=Rasel+Ahamed&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "As someone who works 8+ hours at a desk, this has been a game-changer.",
    name: "Nasir Uddin",
    title: "CEO",
    avatar:
      "https://ui-avatars.com/api/?name=Nasir+Uddin&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "My wife bought this for me as a gift — I was skeptical, but now I wear it daily.",
    name: "Tahmid Rahman",
    title: "Marketing Manager",
    avatar:
      "https://ui-avatars.com/api/?name=Tahmid+Rahman&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "The adjustable straps make it fit perfectly. I even wear it while driving.",
    name: "Sadia Akter",
    title: "Freelancer",
    avatar:
      "https://ui-avatars.com/api/?name=Sadia+Akter&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I’m 65 and have chronic back issues. This device gives me the support I need.",
    name: "Abdul Karim",
    title: "Retired Teacher",
    avatar:
      "https://ui-avatars.com/api/?name=Abdul+Karim&background=0D8ABC&color=fff&size=64",
  },
  {
    quote: "Great for students too! My son uses it during online classes.",
    name: "Farzana Islam",
    title: "Parent",
    avatar:
      "https://ui-avatars.com/api/?name=Farzana+Islam&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "The material is breathable and doesn’t cause sweating. Perfect for long workdays.",
    name: "Mehedi Hasan",
    title: "Software Engineer",
    avatar:
      "https://ui-avatars.com/api/?name=Mehedi+Hasan&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I’ve tried many posture correctors — this one is by far the most comfortable.",
    name: "Zara Ahmed",
    title: "Fitness Instructor",
    avatar:
      "https://ui-avatars.com/api/?name=Zara+Ahmed&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "Simple to put on, easy to adjust, and actually works. Worth every penny!",
    name: "Rifat Khan",
    title: "Entrepreneur",
    avatar:
      "https://ui-avatars.com/api/?name=Rifat+Khan&background=0D8ABC&color=fff&size=64",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 px-4 bg-gray-50">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          Loved by Thousands
        </h2>
        <p className="text-gray-600">Real people. Real results. No gimmicks.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          loop={true}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false,
          }}
          centeredSlides={true}
          className="pb-6"
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 transition-opacity duration-500">
                <p className="text-gray-700 text-lg italic mb-6">
                  “{review.quote}”
                </p>
                <div className="flex items-center justify-center gap-4">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-14 h-14 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-800">
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
    </section>
  );
};

export default CustomerReviews;

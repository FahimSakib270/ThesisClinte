import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, EffectCoverflow } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

// Fake data
const reviews = [
  {
    quote:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day.",
    name: "Awlad Hossin",
    title: "Senior Product Designer",
    avatar:
      "https://ui-avatars.com/api/?name=Awlad+Hossin&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I’ve been using this for 3 weeks and my back pain has reduced significantly. The design is comfortable and doesn’t feel bulky.",
    name: "Rasel Ahamed",
    title: "CTO",
    avatar:
      "https://ui-avatars.com/api/?name=Rasel+Ahamed&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "As someone who works 8+ hours at a desk, this has been a game-changer. My posture improved within days!",
    name: "Nasir Uddin",
    title: "CEO",
    avatar:
      "https://ui-avatars.com/api/?name=Nasir+Uddin&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "My wife bought this for me as a gift — I was skeptical, but now I wear it daily. Great product!",
    name: "Tahmid Rahman",
    title: "Marketing Manager",
    avatar:
      "https://ui-avatars.com/api/?name=Tahmid+Rahman&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "The adjustable straps make it fit perfectly. I even wear it while driving — no discomfort at all.",
    name: "Sadia Akter",
    title: "Freelancer",
    avatar:
      "https://ui-avatars.com/api/?name=Sadia+Akter&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I’m 65 and have chronic back issues. This device gives me the support I need without feeling restrictive.",
    name: "Abdul Karim",
    title: "Retired Teacher",
    avatar:
      "https://ui-avatars.com/api/?name=Abdul+Karim&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "Great for students too! My son uses it during online classes and says his focus has improved.",
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
      "I’ve tried many posture correctors — this one is by far the most comfortable and effective.",
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
  {
    quote:
      "My doctor recommended this after my MRI showed spinal misalignment. It’s helping me avoid surgery.",
    name: "Dr. Nusrat Jahan",
    title: "Physiotherapist",
    avatar:
      "https://ui-avatars.com/api/?name=Dr.+Nusrat+Jahan&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "Even my kids started using it after seeing how much better I felt. We all wear them now!",
    name: "Ayesha Begum",
    title: "Homemaker",
    avatar:
      "https://ui-avatars.com/api/?name=Ayesha+Begum&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "No more slouching at my desk. My colleagues even asked where I got it — now they all have one!",
    name: "Imran Hossain",
    title: "Sales Executive",
    avatar:
      "https://ui-avatars.com/api/?name=Imran+Hossain&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "It’s not just for back pain — it helps with breathing and confidence too. Highly recommend!",
    name: "Lima Sultana",
    title: "Yoga Instructor",
    avatar:
      "https://ui-avatars.com/api/?name=Lima+Sultana&background=0D8ABC&color=fff&size=64",
  },
  {
    quote:
      "I travel often and pack this in my carry-on. Lightweight, compact, and makes long flights bearable.",
    name: "Faisal Ahmed",
    title: "Travel Blogger",
    avatar:
      "https://ui-avatars.com/api/?name=Faisal+Ahmed&background=0D8ABC&color=fff&size=64",
  },
];

const CustomerReviews = () => {
  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            What our customers are saying
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
          </p>
        </div>

        {/* Testimonial Carousel */}
        <Swiper
          modules={[Pagination, EffectCoverflow]}
          effect="coverflow"
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 100,
            modifier: 2.5,
            slideShadows: false,
          }}
          spaceBetween={30}
          slidesPerView={1.3}
          centeredSlides={true}
          loop={true}
          pagination={{
            clickable: true,
            el: ".swiper-pagination",
            bulletClass: "swiper-pagination-bullet",
            bulletActiveClass: "swiper-pagination-bullet-active",
          }}
          className="relative"
          breakpoints={{
            640: {
              slidesPerView: 1.2,
            },
            1024: {
              slidesPerView: 1.5,
            },
          }}
        >
          {reviews.map((review, index) => (
            <SwiperSlide key={index}>
              <div className="bg-white p-6 md:p-8 rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-lg cursor-grab active:cursor-grabbing">
                <div className="flex items-start gap-4 mb-6">
                  <img
                    src={review.avatar}
                    alt={review.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">
                      “{review.quote}”
                    </p>
                    <div className="mt-4 pt-4 border-t border-dashed border-gray-300">
                      <h4 className="font-semibold text-gray-800">
                        {review.name}
                      </h4>
                      <p className="text-xs text-gray-500">{review.title}</p>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="flex justify-center mt-8">
          <div className="swiper-pagination"></div>
        </div>
      </div>
    </section>
  );
};

export default CustomerReviews;

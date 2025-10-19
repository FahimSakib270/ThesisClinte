import React from "react";

const faqData = [
  {
    question: "How does this posture corrector work?",
    answer:
      "A posture corrector works by providing support and gentle alignment to your shoulders, back, and spine, encouraging you to maintain proper posture throughout the day. Here's how it typically functions: A posture corrector works by providing support and gentle alignment to your shoulders.",
    defaultOpen: true, // First item open by default
  },
  {
    question: "Is it suitable for all ages and body types?",
    answer:
      "Yes, our posture corrector is designed to be adjustable and fits most body types. It’s suitable for teens, adults, and seniors who want to improve their posture.",
    defaultOpen: false,
  },
  {
    question: "Does it really help with back pain and posture improvement?",
    answer:
      "Many users report reduced back pain and improved posture within weeks of consistent use. The gentle support helps train your muscles to hold a healthier position.",
    defaultOpen: false,
  },
  {
    question: "Does it have smart features like vibration alerts?",
    answer:
      "Currently, this model does not include vibration alerts or smart sensors. We focus on comfort, adjustability, and effective posture training without electronics.",
    defaultOpen: false,
  },
  {
    question: "How will I be notified when the product is back in stock?",
    answer:
      "You can sign up for restock notifications on the product page. We’ll email you as soon as the item is available again.",
    defaultOpen: false,
  },
];

const FAQSection = () => {
  return (
    <section className="py-16 px-4 bg-base-100">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Frequently Asked Question (FAQ)
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Enhance posture, mobility, and well-being effortlessly with Posture
            Pro. Achieve proper alignment, reduce pain, and strengthen your body
            with ease!
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {faqData.map((item, index) => (
            <div
              key={index}
              className={`collapse collapse-arrow ${
                item.defaultOpen
                  ? "bg-info/5 border-info"
                  : "bg-white border-gray-200"
              } border rounded-xl shadow-sm`}
            >
              <input
                type="radio"
                name="faq-accordion"
                defaultChecked={item.defaultOpen}
              />
              <div className="collapse-title font-semibold text-gray-800">
                {item.question}
              </div>
              <div className="collapse-content text-sm text-gray-700 pt-4">
                {item.answer}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

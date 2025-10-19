import React from "react";
import Banner from "../Banner/Banner";
import OurServices from "../Service/OurService";
import ClientLogosSlider from "../../ClientLogosSlider/ClientLogosSlider";
import HowItWorks from "../HowItWorks/HowItWorks";
import FeatureSection from "../FeatureSection/FeatureSection";
import FAQSection from "../FAQSection/FAQSection";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <ClientLogosSlider></ClientLogosSlider>
      <FeatureSection></FeatureSection>
      <FAQSection></FAQSection>
    </div>
  );
};

export default Home;

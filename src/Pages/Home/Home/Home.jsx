import React from "react";
import Banner from "../Banner/Banner";
import OurServices from "../Service/OurService";
import ClientLogosSlider from "../../ClientLogosSlider/ClientLogosSlider";
import HowItWorks from "../HowItWorks/HowItWorks";
import FeatureSection from "../FeatureSection/FeatureSection";
import FAQSection from "../FAQSection/FAQSection";
import BeMerchant from "../BeMerchant/BeMerchant";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <ClientLogosSlider></ClientLogosSlider>
      <FeatureSection></FeatureSection>
      <FAQSection></FAQSection>
      <BeMerchant></BeMerchant>
    </div>
  );
};

export default Home;

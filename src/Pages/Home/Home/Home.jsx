import React from "react";
import Banner from "../Banner/Banner";
import OurServices from "../Service/OurService";
import ClientLogosSlider from "../../ClientLogosSlider/ClientLogosSlider";
import HowItWorks from "../HowItWorks/HowItWorks";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <HowItWorks></HowItWorks>
      <OurServices></OurServices>
      <ClientLogosSlider></ClientLogosSlider>
    </div>
  );
};

export default Home;

import React from "react";
import Banner from "../Banner/Banner";
import OurServices from "../../Service/OurServices";
import ClientLogosSlider from "../../ClientLogosSlider/ClientLogosSlider";

const Home = () => {
  return (
    <div>
      <Banner></Banner>
      <OurServices></OurServices>
      <ClientLogosSlider></ClientLogosSlider>
    </div>
  );
};

export default Home;

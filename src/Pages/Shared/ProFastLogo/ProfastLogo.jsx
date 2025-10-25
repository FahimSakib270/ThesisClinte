import React from "react";
import logo from "../../../assets/logo/logo.png";
import { Link } from "react-router";

const ProfastLogo = () => {
  return (
    <Link to="/">
      <div className="flex items-end">
        <img className="mb-2" src={logo} alt="" />
        <p className=" text-3xl -ml-2 font-bold">proFast</p>
      </div>
    </Link>
  );
};

export default ProfastLogo;

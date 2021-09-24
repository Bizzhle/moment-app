import React from "react";
// import { Button } from "semantic-ui-react";
import { Link } from "react-router-dom";

const FrontPage = () => {
  return (
    <div className="flex h-screen justify-center items-center ">
      <ul className=" w-80 sm:w-96 m-auto">
        <li className="flex justify-center italic font-bold text-3xl py-2 ">
          Your Moments
        </li>
        <li className="flex justify-center text-center text-2xl py-2 ">
          <p>Join Moments and dont miss any moment</p>
        </li>

        <li className="flex justify-center ">
          <button type="button" className="px-2 font-bold text-blue-800">
            <Link to="/login">Log In</Link>
          </button>
          {"  "}
          or {"  "}
          <button type="button" className="px-2  font-bold text-blue-800">
            <Link to="/register">Sign Up</Link>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default FrontPage;

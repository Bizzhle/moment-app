import React, { useState, useContext } from "react";
import { Menu, Popup, Confirm } from "semantic-ui-react";
import { Link, useHistory, Redirect } from "react-router-dom";

import { AuthContext } from "../context/auth";

function MenuBar(props) {
  const { user, logout } = useContext(AuthContext);
  const history = useHistory();
  const pathname = window.location.pathname;

  const path = pathname === "/" ? "home" : pathname.substr(1);
  const [activeItem, setActiveItem] = useState(path);
  const [isOpen, setIsOpen] = useState(false);

  function loggedOut() {
    logout();
    history.push("/");
  }

  const handleItemClick = (e, { name }) => setActiveItem(name);

  const menuBar = user ? (
    <div className="fixed top-0 border-b-2 w-full  bg-white opacity-100 z-50 ">
      <div className=" md:max-w-5xl  mx-auto flex justify-between px-4 py-4 ">
        <Menu.Item
          name="Moments"
          active={activeItem === "home"}
          onClick={handleItemClick}
          as={Link}
          to="/home"
          className="text-black font-bold text-2xl "
        />

        <div>
          <Popup
            disabled
            trigger={
              <Menu.Item
                className="cursor-pointer font-bold text-black text-2xl"
                name={user.username}
                onClick={() => setIsOpen(true)}
              />
              // <button
              //   className="cursor-pointer font-bold  text-xl active"
              //   onClick={() => setIsOpen(true)}
              // >
              //   {user.username}{" "}
              // </button>
            }
          />
          <Confirm
            open={isOpen}
            content="Log out"
            onCancel={() => setIsOpen(false)}
            onConfirm={loggedOut}
          />
          {/* <Menu.Item name="logout" onClick={logout} as={Link} to="/" /> */}
        </div>
      </div>
    </div>
  ) : (
    <Redirect to="/" />
    // <div className="ui menu pointing secondary teal">
    //   <Menu.Item
    //     name="home"
    //     active={activeItem === "home"}
    //     onClick={handleItemClick}
    //     as={Link}
    //     to="/home"
    //   />

    //   <Menu.Menu position="right">
    //     <Menu.Item
    //       name="login"
    //       active={activeItem === "login"}
    //       onClick={handleItemClick}
    //       as={Link}
    //       to="/login"
    //     />
    //     <Menu.Item
    //       name="register"
    //       active={activeItem === "register"}
    //       onClick={handleItemClick}
    //       as={Link}
    //       to="/register"
    //     />
    //   </Menu.Menu>
    // </div>
  );

  return menuBar;
}

export default MenuBar;

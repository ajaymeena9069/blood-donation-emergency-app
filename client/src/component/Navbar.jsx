/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  const { isAuthenticated, user, role } = useSelector((s) => s.auth);

  const navLinkClass =
    "relative text-gray-700 font-[650] tracking-wide transition-all duration-300 hover:text-red-600 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-red-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";

  return (
    <header className="w-full top-0 left-0 z-50 bg-white shadow-sm">
      {/* TOP BAR */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-red-600 text-white"
      >
        <div className="max-w-[1200px] mx-auto flex justify-between items-center h-12 px-4">
          {/* Info */}
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <FaPhoneAlt className="text-xs" />
              <span className="text-[14px] font-medium">
                Helpline: +91 98765 43210
              </span>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <FaMapMarkerAlt className="text-xs" />
              <span className="text-[14px] font-medium">Jaipur, Rajasthan</span>
            </div>
          </div>

          {/* Social */}
          <div className="flex gap-3 text-white text-lg">
            {[<FaFacebookF />, <FaTwitter />, <FaInstagram />, <FaYoutube />].map(
              (Icon, i) => (
                <motion.a key={i} whileHover={{ scale: 1.2 }}>
                  {Icon}
                </motion.a>
              )
            )}
          </div>
        </div>
      </motion.div>

      {/* MAIN NAV */}
      <div className="border-b border-gray-100 bg-white">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center h-16 px-4">
          {/* LOGO */}
          <img
            src="https://templates.bwlthemes.com/blood_donation/v_2/images/logo.png"
            className="h-10 cursor-pointer"
            onClick={() => navigate("/")}
          />

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-8 uppercase">
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/donors" className={navLinkClass}>
              Find Donors
            </NavLink>
            <NavLink to="/camps" className={navLinkClass}>
              Blood Camps
            </NavLink>
            <NavLink to="/services" className={navLinkClass}>
              Services
            </NavLink>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </nav>

          {/* RIGHT DROPDOWN (DESKTOP) */}
          <div className="hidden lg:block relative z-50">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-4 py-2 border rounded-lg shadow font-semibold hover:bg-gray-100"
            >
              {isAuthenticated ? user?.name : "Menu"} ▾
            </button>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 mt-3 w-48 bg-white border shadow-xl rounded-xl py-2 z-50"
                >
                  {!isAuthenticated ? (
                    <>
                      <NavLink
                        to="/login"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Login
                      </NavLink>

                      <NavLink
                        to="/register"
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Register
                      </NavLink>
                    </>
                  ) : (
                    <>
                      <NavLink
                        to={`/${role}/dashboard`}
                        onClick={() => setDropdownOpen(false)}
                        className="block px-4 py-2 hover:bg-gray-100 text-gray-700"
                      >
                        Dashboard
                      </NavLink>

                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-left text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden">
            {toggle ? (
              <FaTimes
                className="text-2xl cursor-pointer"
                onClick={() => setToggle(false)}
              />
            ) : (
              <FaBars
                className="text-2xl cursor-pointer"
                onClick={() => setToggle(true)}
              />
            )}
          </div>
        </div>

        {/* MOBILE MENU */}
        {toggle && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            className="lg:hidden bg-white border-t shadow-md"
          >
            <ul className="flex flex-col text-center space-y-3 p-5">
              <NavLink to="/" onClick={() => setToggle(false)}>
                Home
              </NavLink>
              <NavLink to="/donors" onClick={() => setToggle(false)}>
                Find Donors
              </NavLink>
              <NavLink to="/camps" onClick={() => setToggle(false)}>
                Blood Camps
              </NavLink>
              <NavLink to="/services" onClick={() => setToggle(false)}>
                Services
              </NavLink>
              <NavLink to="/contact" onClick={() => setToggle(false)}>
                Contact
              </NavLink>

              {/* MOBILE DROPDOWN (Authenticated User) */}
              {isAuthenticated && (
                <div className="mt-3 text-left">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="px-4 py-2 border rounded-lg shadow font-semibold w-full"
                  >
                    {user?.name} ▾
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="bg-white border rounded-lg shadow p-2 mt-2"
                      >
                        <NavLink
                          to={`/${role}/dashboard`}
                          onClick={() => {
                            setToggle(false);
                            setDropdownOpen(false);
                          }}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          Dashboard
                        </NavLink>

                        <button
                          onClick={() => {
                            handleLogout();
                            setToggle(false);
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Logout
                        </button>

                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* LOGIN / REGISTER (When Not Logged In) */}
              {!isAuthenticated && (
                <>
                  <NavLink to="/login">
                    <button className="bg-gray-800 text-white px-5 py-2 rounded-lg w-full">
                      Login
                    </button>
                  </NavLink>

                  <NavLink to="/register">
                    <button className="bg-red-600 text-white px-5 py-2 rounded-lg w-full">
                      Register
                    </button>
                  </NavLink>
                </>
              )}
            </ul>
          </motion.div>
        )}
      </div>
    </header>
  );
}

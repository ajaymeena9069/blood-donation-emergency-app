/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaTachometerAlt,
  FaHandHoldingHeart,
  FaUserInjured,
  FaUserShield
} from "react-icons/fa";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../features/auth/authSlice";

export default function Navbar() {
  const [toggle, setToggle] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const toggleButtonRef = useRef(null);

  const { isAuthenticated, user } = useSelector((s) => s.auth);

  // Get current role from user object - FIXED
  const currentRole = user?.activeRole || (user?.role && user?.role[0]) || 'user';

  // Close dropdown and mobile menu on route change
  useEffect(() => {
    setToggle(false);
    setDropdownOpen(false);
  }, [location]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close dropdown if clicked outside
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }

      // Close mobile menu if clicked outside (except toggle button)
      if (toggle &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        toggleButtonRef.current &&
        !toggleButtonRef.current.contains(event.target)) {
        setToggle(false);
      }
    };

    // Close on escape key press
    const handleEscapeKey = (event) => {
      if (event.key === 'Escape') {
        setToggle(false);
        setDropdownOpen(false);
      }
    };

    // Close on scroll (for better UX)
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
      if (toggle || dropdownOpen) {
        setToggle(false);
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [toggle, dropdownOpen]);

  // Auto-close mobile menu when window resizes to desktop size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && toggle) {
        setToggle(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [toggle]);

  const handleLogout = () => {
    setToggle(false);
    setDropdownOpen(false);
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  const navLinkClass =
    "relative text-gray-700 font-medium tracking-wide transition-all duration-300 hover:text-red-600 after:content-[''] after:absolute after:w-0 after:h-[2px] after:bg-red-600 after:left-0 after:-bottom-1 hover:after:w-full after:transition-all after:duration-300";

  // Role icon mapping
  const getRoleIcon = (role) => {
    switch (role) {
      case 'donor': return <FaHandHoldingHeart className="text-red-500" />;
      case 'patient': return <FaUserInjured className="text-blue-500" />;
      case 'admin': return <FaUserShield className="text-gray-600" />;
      default: return <FaUserCircle className="text-gray-500" />;
    }
  };

  // Role color mapping
  const getRoleColor = (role) => {
    switch (role) {
      case 'donor': return 'bg-red-100 text-red-700 border-red-200';
      case 'patient': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'admin': return 'bg-gray-100 text-gray-700 border-gray-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Handle link click for mobile menu
  const handleMobileLinkClick = () => {
    setToggle(false);
    setDropdownOpen(false);
  };

  // Handle dropdown toggle with debounce
  const handleDropdownToggle = () => {
    setDropdownOpen(prev => !prev);
    if (toggle) setToggle(false);
  };

  // Handle mobile menu toggle
  const handleMobileToggle = () => {
    setToggle(prev => !prev);
    if (dropdownOpen) setDropdownOpen(false);
  };

  return (
    <header className={`w-full top-0 left-0 z-50 bg-white shadow-sm sticky transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'}`}>
      {/* TOP BAR */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-r from-red-700 to-red-600 text-white shadow-sm"
      >
        <div className="max-w-[1200px] mx-auto flex justify-between items-center h-10 px-4 md:px-8">
          {/* Contact Info */}
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 hover:text-red-100 transition-colors">
              <FaPhoneAlt className="text-xs" />
              <span className="font-medium">Helpline: +91 98765 43210</span>
            </div>

            <div className="hidden md:flex items-center gap-2 hover:text-red-100 transition-colors">
              <FaMapMarkerAlt className="text-xs" />
              <span className="font-medium">Jaipur, Rajasthan</span>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex gap-4">
            {[
              { icon: <FaFacebookF />, color: "hover:text-blue-300" },
              { icon: <FaTwitter />, color: "hover:text-sky-300" },
              { icon: <FaInstagram />, color: "hover:text-pink-300" },
              { icon: <FaYoutube />, color: "hover:text-red-300" }
            ].map((item, i) => (
              <motion.a
                key={i}
                href="#"
                className={`text-white ${item.color} transition-colors duration-300`}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => e.preventDefault()}
                aria-label={`Follow us on ${item.icon.type.name}`}
              >
                {item.icon}
              </motion.a>
            ))}
          </div>
        </div>
      </motion.div>

      {/* MAIN NAVBAR */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-[1200px] mx-auto flex justify-between items-center h-20 px-4 md:px-8">
          {/* LOGO */}
          <motion.div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => {
              navigate("/");
              setToggle(false);
              setDropdownOpen(false);
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <div className="absolute inset-0 bg-red-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative h-12 w-12 bg-red-600 rounded-full flex items-center justify-center">
                <FaHandHoldingHeart className="text-2xl text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
                BloodCare
              </h1>
              <p className="text-xs text-gray-500 -mt-1">Save Lives, Donate Blood</p>
            </div>
          </motion.div>

          {/* DESKTOP MENU */}
          <nav className="hidden lg:flex items-center space-x-8">
            {[
              { to: "/", label: "Home" },
              { to: "/donors", label: "Find Donors" },
              { to: "/care", label: "Blood Care" },
              { to: "/services", label: "Services" },
              { to: "/contact", label: "Contact" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setDropdownOpen(false)}
                className={({ isActive }) =>
                  `px-1 py-2 text-sm font-medium transition-all duration-300 ${isActive
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-red-600 hover:border-b-2 hover:border-red-300"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          {/* USER DROPDOWN - Desktop */}
          <div className="hidden lg:block relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                {/* User Info */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full border ${getRoleColor(currentRole)}`}>
                    {getRoleIcon(currentRole)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{currentRole}</p>
                  </div>
                </div>

                {/* Dropdown Trigger */}
                <motion.button
                  onClick={handleDropdownToggle}
                  className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-colors"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle user menu"
                  aria-expanded={dropdownOpen}
                >
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform duration-300 ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-50 overflow-hidden"
                      role="menu"
                      aria-orientation="vertical"
                    >
                      {/* User Info Card */}
                      <div className="px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg border ${getRoleColor(currentRole)}`}>
                            {getRoleIcon(currentRole)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800">{user?.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(currentRole)}`}>
                                {currentRole}
                              </span>
                              <span className="text-xs text-gray-500">{user?.bloodGroup}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <NavLink
                          to={`/${currentRole}/dashboard`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          role="menuitem"
                        >
                          <FaTachometerAlt className="text-gray-500" />
                          <span className="text-gray-700">Dashboard</span>
                        </NavLink>

                        <NavLink
                          to="/profile"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                          role="menuitem"
                        >
                          <FaUserCircle className="text-gray-500" />
                          <span className="text-gray-700">My Profile</span>
                        </NavLink>

                        <div className="border-t border-gray-100 my-2"></div>

                        <motion.button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 transition-colors"
                          role="menuitem"
                          whileHover={{ x: 4 }}
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="px-4 py-2 text-gray-700 font-medium hover:text-red-600 transition-colors"
                >
                  Login
                </NavLink>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <NavLink
                    to="/register"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-sm hover:shadow"
                  >
                    Register
                  </NavLink>
                </motion.div>
              </div>
            )}
          </div>

          {/* MOBILE MENU TOGGLE */}
          <div className="lg:hidden" ref={toggleButtonRef}>
            <motion.button
              ref={toggleButtonRef}
              initial={false}
              animate={{ rotate: toggle ? 90 : 0 }}
              onClick={handleMobileToggle}
              className="p-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
              aria-label={toggle ? "Close menu" : "Open menu"}
              aria-expanded={toggle}
              whileTap={{ scale: 0.9 }}
            >
              {toggle ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </motion.button>
          </div>
        </div>

        {/* MOBILE MENU */}
        <AnimatePresence>
          {toggle && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-gray-100 shadow-lg overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Nav Links */}
                <div className="space-y-2">
                  {[
                    { to: "/", label: "Home" },
                    { to: "/donors", label: "Find Donors" },
                    { to: "/care", label: "Blood Care" },
                    { to: "/services", label: "Services" },
                    { to: "/contact", label: "Contact" },
                  ].map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={handleMobileLinkClick}
                      className={({ isActive }) =>
                        `block px-4 py-3 rounded-lg font-medium transition-colors ${isActive
                          ? "bg-red-50 text-red-600 border-l-4 border-red-600"
                          : "text-gray-700 hover:bg-gray-50"
                        }`
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                </div>

                {/* User Section - Mobile */}
                {isAuthenticated ? (
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                      <div className={`p-2 rounded-full border ${getRoleColor(currentRole)}`}>
                        {getRoleIcon(currentRole)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{user?.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-0.5 text-xs rounded-full ${getRoleColor(currentRole)}`}>
                            {currentRole}
                          </span>
                          <span className="text-xs text-gray-500">{user?.bloodGroup}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 space-y-2">
                      <NavLink
                        to={`/${currentRole}/dashboard`}
                        onClick={handleMobileLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FaTachometerAlt className="text-gray-500" />
                        <span className="text-gray-700">Dashboard</span>
                      </NavLink>

                      <NavLink
                        to="/profile"
                        onClick={handleMobileLinkClick}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <FaUserCircle className="text-gray-500" />
                        <span className="text-gray-700">My Profile</span>
                      </NavLink>

                      <motion.button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        whileHover={{ x: 4 }}
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </motion.button>
                    </div>
                  </div>
                ) : (
                  <div className="pt-4 border-t border-gray-100 space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <NavLink
                        to="/login"
                        onClick={handleMobileLinkClick}
                        className="block px-4 py-3 text-center bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Login
                      </NavLink>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <NavLink
                        to="/register"
                        onClick={handleMobileLinkClick}
                        className="block px-4 py-3 text-center bg-gradient-to-r from-red-600 to-red-700 text-white font-medium rounded-lg hover:from-red-700 hover:to-red-800 transition-all"
                      >
                        Register Now
                      </NavLink>
                    </motion.div>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
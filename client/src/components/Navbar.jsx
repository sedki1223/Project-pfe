import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, UserButton } from "@clerk/clerk-react";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Food", path: "/food" },
    { name: "Transportation", path: "/transportation" },
    { name: "Events", path: "/events" },
    { name: "Trip Planner", path: "/aiplanner" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { openSignIn } = useClerk();
  const location = useLocation();

  // Modal toggles from context
  const { user, setShowHotelReg, setShowFoodReg } = useAppContext();

  // Scroll effect for navbar style
  useEffect(() => {
    if (location.pathname !== "/") setIsScrolled(true);
    else setIsScrolled(false);

    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  // Open hotel registration modal
  const openHotelModal = () => {
    setShowHotelReg(true);
  };

  // Open food registration modal
  const openFoodModal = () => {
    setShowFoodReg(true);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
        isScrolled
          ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4"
          : "py-4 md:py-6"
      }`}
    >
      {/* Logo */}
      <Link to="/">
        <img
          src={assets.logo}
          alt="logo"
          className={`h-9 ${isScrolled ? "invert opacity-80" : ""}`}
        />
      </Link>

      {/* Desktop navigation */}
      <div className="hidden md:flex items-center gap-4 lg:gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className={`group flex flex-col gap-0.5 ${
              isScrolled ? "text-gray-700" : "text-white"
            }`}
          >
            {link.name}
            <div
              className={`${
                isScrolled ? "bg-gray-700" : "bg-white"
              } h-0.5 w-0 group-hover:w-full transition-all duration-300`}
            />
          </Link>
        ))}

        {/* Show promote buttons only if logged in */}
        {user && (
          <>
            <button
              onClick={openHotelModal}
              className={`px-4 py-2 rounded-md border ${
                isScrolled
                  ? "border-gray-700 text-gray-700 hover:bg-gray-100"
                  : "border-white text-white hover:bg-white hover:text-gray-700"
              } transition-colors`}
            >
              Promote your Hotel
            </button>
            <button
              onClick={openFoodModal}
              className={`px-4 py-2 rounded-md border ${
                isScrolled
                  ? "border-gray-700 text-gray-700 hover:bg-gray-100"
                  : "border-white text-white hover:bg-white hover:text-gray-700"
              } transition-colors`}
            >
              Promote your Restaurant
            </button>
          </>
        )}
      </div>

      {/* Right side login or user menu */}
      <div className="hidden md:flex items-center gap-4">
        {user ? (
          <UserButton />
        ) : (
          <button
            onClick={openSignIn}
            className="bg-black text-white px-8 py-2.5 rounded-full ml-4 transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="flex items-center gap-3 md:hidden">
        {user && <UserButton />}
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled ? "invert" : ""} h-4`}
        />
      </div>

      {/* Mobile menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          className="absolute top-4 right-4"
          onClick={() => setIsMenuOpen(false)}
        >
          <img src={assets.closeIcon} alt="close-menu" className="h-6.5" />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="block"
          >
            {link.name}
          </Link>
        ))}

        {/* Show promote buttons only if logged in */}
        {user && (
          <>
            <button
              onClick={() => {
                openHotelModal();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 rounded-md border border-gray-700 text-gray-700 hover:bg-gray-100 transition-colors w-full max-w-xs"
            >
              Promote your Hotel
            </button>
            <button
              onClick={() => {
                openFoodModal();
                setIsMenuOpen(false);
              }}
              className="px-4 py-2 rounded-md border border-gray-700 text-gray-700 hover:bg-gray-100 transition-colors w-full max-w-xs"
            >
              Promote your Restaurant
            </button>
          </>
        )}

        {!user && (
          <button
            onClick={() => {
              openSignIn();
              setIsMenuOpen(false);
            }}
            className="bg-black text-white px-8 py-2.5 rounded-full transition-all duration-500"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

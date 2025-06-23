import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useClerk, useUser } from "@clerk/clerk-react";
import { useAppContext } from "@/context/AppContext";

const Navbar = () => {
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/rooms" },
    { name: "Dish", path: "/dishes" },
    { name: "Transportation", path: "/transportation" },
    { name: "Events", path: "/events" },
    { name: "Trip Planner", path: "/aiplanner" },
    { name: "About", path: "/about" },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const { openSignIn, signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    isOwner,
    ownerType,
    setShowHotelReg,
    setShowRestaurantReg,
  } = useAppContext();

  useEffect(() => {
    setIsScrolled(location.pathname !== "/" || window.scrollY > 10);
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  const openHotelModal = () => setShowHotelReg(true);
  const openRestaurantModal = () => setShowRestaurantReg(true);

  const toggleUserDropdown = () => setShowUserDropdown((prev) => !prev);

  const handleSignOut = () => {
    signOut(() => navigate("/"));
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

      {/* Desktop nav */}
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

        {/* Promote or Dashboard */}
        {user && !isOwner && (
          <button
            onClick={openHotelModal}
            className={`px-4 py-2 rounded-md border ${
              isScrolled
                ? "border-gray-700 text-gray-700 hover:bg-gray-100"
                : "border-white text-white hover:bg-white hover:text-gray-700"
            } transition-colors`}
          >
            Promote your Hotel/Restaurant
          </button>
        )}

        {user && isOwner && (
          <Link
            to="/dashboard"
            className={`px-4 py-2 rounded-md border ${
              isScrolled
                ? "border-gray-700 text-gray-700 hover:bg-gray-100"
                : "border-white text-white hover:bg-white hover:text-gray-700"
            } transition-colors`}
          >
            Dashboard
          </Link>
        )}
      </div>

      {/* Right side: Login or User Dropdown */}
      <div className="hidden md:flex items-center gap-4 relative">
        {user ? (
          <div className="relative">
            <img
              src={user.imageUrl}
              alt="avatar"
              className="w-10 h-10 rounded-full cursor-pointer"
              onClick={toggleUserDropdown}
            />
            {showUserDropdown && (
              <div className="absolute right-0 top-12 bg-white border shadow-md rounded-md w-48 z-50">
                <Link
                  to="/my-bookings"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowUserDropdown(false)}
                >
                  My Bookings
                </Link>
                <Link
                  to="/my-orders"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowUserDropdown(false)}
                >
                  My Orders
                </Link>
                <a
                  href="/user"
                  className="block px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={() => setShowUserDropdown(false)}
                >
                  Manage Account
                </a>
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openSignIn}
            className="bg-black text-white px-8 py-2.5 rounded-full"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="flex items-center gap-3 md:hidden">
        {user && (
          <img
            src={user.imageUrl}
            alt="avatar"
            className="w-9 h-9 rounded-full"
            onClick={toggleUserDropdown}
          />
        )}
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className={`${isScrolled ? "invert" : ""} h-4`}
        />
      </div>

      {/* Mobile dropdown user menu */}
      {showUserDropdown && (
        <div className="absolute top-16 right-4 bg-white border shadow-md rounded-md w-48 z-50 md:hidden">
          <Link
            to="/my-bookings"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowUserDropdown(false)}
          >
            My Bookings
          </Link>
          <Link
            to="/my-orders"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowUserDropdown(false)}
          >
            My Orders
          </Link>
          <a
            href="/user"
            className="block px-4 py-2 text-sm hover:bg-gray-100"
            onClick={() => setShowUserDropdown(false)}
          >
            Manage Account
          </a>
          <button
            onClick={handleSignOut}
            className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
          >
            Sign Out
          </button>
        </div>
      )}

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

        {user && !isOwner && (
          <button
            onClick={() => {
              openHotelModal();
              setIsMenuOpen(false);
            }}
            className="px-4 py-2 rounded-md border border-gray-700 text-gray-700 hover:bg-gray-100 transition-colors w-full max-w-xs"
          >
            Promote your Hotel/Restaurant
          </button>
        )}

        {user && isOwner && (
          <Link
            to="/dashboard"
            onClick={() => setIsMenuOpen(false)}
            className="px-4 py-2 rounded-md border border-gray-700 text-gray-700 hover:bg-gray-100 transition-colors w-full max-w-xs text-center"
          >
            Dashboard
          </Link>
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

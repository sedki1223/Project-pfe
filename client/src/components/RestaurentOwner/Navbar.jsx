import React from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => (
  <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-6 shadow-sm">
    <Link to="/" className="text-lg font-semibold text-gray-800">
      Visit Tozeur
    </Link>
    <span className="text-sm font-medium text-gray-600">Restaurant Owner Dashboard</span>
  </header>
)

export default Navbar

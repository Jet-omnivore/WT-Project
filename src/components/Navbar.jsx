// Navbar.jsx — Sticky navigation bar used on public pages
// Shows logo, nav links, and login/get-started buttons
// Has a hamburger menu for mobile screens
import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  // State to toggle mobile menu open/close
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-md font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <Link to="/" className="text-2xl font-heading font-bold text-primary">
            MediRemind 💊
          </Link>

          {/* Desktop Navigation Links (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-darkblue hover:text-primary transition">Home</Link>
            <a href="/#features" className="text-darkblue hover:text-primary transition">Features</a>
            <Link to="/about" className="text-darkblue hover:text-primary transition">About</Link>

          </div>

          {/* Desktop Buttons (hidden on mobile) */}
          <div className="hidden md:flex items-center space-x-3">
            <Link
              to="/login"
              className="px-4 py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition"
            >
              Get Started
            </Link>
          </div>

          {/* Hamburger Menu Button (visible on mobile only) */}
          <button
            className="md:hidden text-2xl text-darkblue"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Menu — slides open when hamburger is clicked */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" className="block py-2 text-darkblue hover:text-primary" onClick={() => setMenuOpen(false)}>Home</Link>
            <a href="/#features" className="block py-2 text-darkblue hover:text-primary" onClick={() => setMenuOpen(false)}>Features</a>
            <Link to="/about" className="block py-2 text-darkblue hover:text-primary" onClick={() => setMenuOpen(false)}>About</Link>

            <div className="flex space-x-2 pt-2">
              <Link to="/login" className="px-4 py-2 text-primary border border-primary rounded-lg" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="px-4 py-2 bg-primary text-white rounded-lg" onClick={() => setMenuOpen(false)}>Get Started</Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar

// Footer.jsx — Footer component used on public pages
// Shows logo, quick links, and copyright line
import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-darkblue text-white py-10 font-body">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Logo & Description */}
          <div>
            <h3 className="text-xl font-heading font-bold mb-2">MediRemind 💊</h3>
            <p className="text-gray-300 text-sm">
              Your smart companion for medicine reminders and health appointment tracking.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading font-semibold mb-2">Quick Links</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li><Link to="/" className="hover:text-secondary transition">Home</Link></li>
              <li><Link to="/about" className="hover:text-secondary transition">About Us</Link></li>
              <li><Link to="/login" className="hover:text-secondary transition">Login</Link></li>
              <li><Link to="/register" className="hover:text-secondary transition">Sign Up</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading font-semibold mb-2">Contact</h4>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>📧 animesh.vijay.ug23@nsut.ac.in</li>
              <li>📍 NSUT, Delhi</li>
            </ul>
          </div>
        </div>

        {/* Copyright Line */}
        <div className="border-t border-gray-600 mt-8 pt-4 text-center text-sm text-gray-400">
          © 2025 MediRemind. All rights reserved. Built with ❤️ by Team MediRemind.
        </div>
      </div>
    </footer>
  )
}

export default Footer

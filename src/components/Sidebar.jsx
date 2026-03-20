import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout } from '../api.js'

const navItems = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/medicines', icon: '💊', label: 'My Medicines' },
  { path: '/appointments', icon: '📅', label: 'Appointments' },
  { path: '/calendar', icon: '🕐', label: 'Calendar' },
  { path: '/profile', icon: '👤', label: 'Profile' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <>
      <aside className="hidden md:flex flex-col w-64 bg-white shadow-lg min-h-screen p-4 fixed left-0 top-0">
        <Link to="/" className="text-xl font-heading font-bold text-primary mb-8 px-2">
          MediRemind 💊
        </Link>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition
                ${location.pathname === item.path
                  ? 'bg-primary text-white'
                  : 'text-darkblue hover:bg-gray-100'
                }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="mt-auto pt-4">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 text-danger hover:bg-red-50 rounded-lg transition w-full"
          >
            <span className="text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Tab Bar — hidden on desktop */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.1)] z-50">
        <div className="flex justify-around items-center py-2">
          {navItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center py-1 px-2 ${
                location.pathname === item.path ? 'text-primary' : 'text-gray-400'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px]">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>
    </>
  )
}

export default Sidebar

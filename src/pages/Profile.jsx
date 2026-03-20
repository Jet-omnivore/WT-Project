import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getUser, isLoggedIn, logout, medicineAPI, appointmentAPI } from '../api.js'

function Profile() {
  const navigate = useNavigate()
  const user = getUser()
  const [medicineCount, setMedicineCount] = useState(0)
  const [appointmentCount, setAppointmentCount] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const [meds, apts] = await Promise.all([
        medicineAPI.getAll(),
        appointmentAPI.getAll()
      ])
      setMedicineCount(meds.length)
      setAppointmentCount(apts.length)
    } catch (error) {
      console.error('Failed to load stats:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-heading font-bold text-darkblue mb-6">👤 My Profile</h1>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-md p-8 text-center mb-6">
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl font-bold">{initials}</span>
            </div>
            <h2 className="text-2xl font-heading font-bold text-darkblue">{user?.fullName || 'User'}</h2>
            <p className="text-gray-500 mt-1">{user?.email || ''}</p>
            <span className="inline-block mt-3 px-4 py-1 bg-primary/10 text-primary text-sm rounded-full font-medium capitalize">
              {user?.role || 'patient'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-primary">{medicineCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Medicines</p>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-3xl font-bold text-secondary">{appointmentCount}</p>
              <p className="text-sm text-gray-500 mt-1">Total Appointments</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h3 className="font-heading font-semibold text-darkblue mb-4">Account Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Full Name</span>
                <span className="text-darkblue font-medium">{user?.fullName || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Email</span>
                <span className="text-darkblue font-medium">{user?.email || '-'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-500 text-sm">Role</span>
                <span className="text-darkblue font-medium capitalize">{user?.role || 'patient'}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-500 text-sm">Account Status</span>
                <span className="text-success font-medium">Active ✅</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-3 bg-danger text-white font-semibold rounded-lg hover:bg-red-600 transition shadow-md"
          >
            🚪 Logout
          </button>
        </div>
      </main>
    </div>
  )
}

export default Profile

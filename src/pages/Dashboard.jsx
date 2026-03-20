import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { getUser, isLoggedIn, medicineAPI, appointmentAPI } from '../api.js'

function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()

  const [medicines, setMedicines] = useState([])
  const [appointments, setAppointments] = useState([])
  const [takenIds, setTakenIds] = useState([])
  const [skippedIds, setSkippedIds] = useState([])

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [medsData, aptsData] = await Promise.all([
        medicineAPI.getAll(),
        appointmentAPI.getAll()
      ])
      setMedicines(medsData.filter(m => m.status === 'active').slice(0, 3))
      setAppointments(aptsData.filter(a => a.status === 'upcoming').slice(0, 2))
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    }
  }

  const handleTaken = (id) => setTakenIds([...takenIds, id])
  const handleSkip = (id) => setSkippedIds([...skippedIds, id])

  const getCardStatus = (id) => {
    if (takenIds.includes(id)) return 'taken'
    if (skippedIds.includes(id)) return 'skipped'
    return 'pending'
  }

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-darkblue">
            {greeting}, {user?.fullName || 'User'}! 👋
          </h1>
          <p className="text-gray-500 mt-1">{today}</p>
        </div>

        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-darkblue mb-4">💊 Today's Medicines</h2>
          {medicines.length === 0 ? (
            <p className="text-gray-400">No active medicines. Add some from the Medicines page!</p>
          ) : (
            <div className="flex gap-4 overflow-x-auto pb-2">
              {medicines.map((med) => {
                const status = getCardStatus(med._id)
                return (
                  <div
                    key={med._id}
                    className={`min-w-[250px] rounded-xl p-5 shadow-md transition-all duration-300
                      ${status === 'taken' ? 'bg-success/10 border-2 border-success' :
                        status === 'skipped' ? 'bg-gray-100 border-2 border-gray-300' :
                        'bg-white border border-gray-100'}`}
                  >
                    <h3 className="font-heading font-semibold text-darkblue">{med.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">💊 {med.dose}</p>
                    <p className="text-sm text-gray-500">🕐 {med.time}</p>

                    {status === 'pending' && (
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => handleTaken(med._id)} className="flex-1 py-2 bg-success text-white text-sm rounded-lg hover:bg-green-600 transition">
                          Mark Taken ✓
                        </button>
                        <button onClick={() => handleSkip(med._id)} className="flex-1 py-2 bg-gray-200 text-gray-600 text-sm rounded-lg hover:bg-gray-300 transition">
                          Skip
                        </button>
                      </div>
                    )}
                    {status === 'taken' && <p className="mt-4 text-success font-semibold text-sm">✅ Taken</p>}
                    {status === 'skipped' && <p className="mt-4 text-gray-500 font-semibold text-sm">⏭️ Skipped</p>}
                  </div>
                )
              })}
            </div>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-heading font-semibold text-darkblue mb-4">📅 Upcoming Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-gray-400">No upcoming appointments.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {appointments.map((apt) => (
                <div key={apt._id} className="bg-white rounded-xl p-5 shadow-md border border-gray-100">
                  <h3 className="font-heading font-semibold text-darkblue">{apt.doctor}</h3>
                  <span className="inline-block mt-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">{apt.specialty}</span>
                  <div className="mt-3 text-sm text-gray-600 space-y-1">
                    <p>📆 {apt.date}</p>
                    <p>🕐 {apt.time}</p>
                  </div>
                  <button className="mt-4 w-full py-2 text-sm text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition">
                    View Details
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-xl font-heading font-semibold text-darkblue mb-4">📊 This Week's Summary</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-md text-center border border-gray-100">
              <p className="text-3xl font-bold text-success">{takenIds.length}/{medicines.length}</p>
              <p className="text-sm text-gray-500 mt-1">Medicines Taken</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md text-center border border-gray-100">
              <p className="text-3xl font-bold text-primary">{appointments.length}</p>
              <p className="text-sm text-gray-500 mt-1">Upcoming Appointments</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-md text-center border border-gray-100">
              <p className="text-3xl font-bold text-warning">{takenIds.length} 🔥</p>
              <p className="text-sm text-gray-500 mt-1">Day Streak</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default Dashboard

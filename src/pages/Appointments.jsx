import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import AppointmentCard from '../components/AppointmentCard.jsx'
import { isLoggedIn, appointmentAPI } from '../api.js'

function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newAppointment, setNewAppointment] = useState({
    doctor: '', specialty: '', date: '', time: '', clinic: '', notes: ''
  })

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try {
      const data = await appointmentAPI.getAll()
      setAppointments(data)
    } catch (error) {
      console.error('Failed to load appointments:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!newAppointment.doctor || !newAppointment.date || !newAppointment.time) {
      alert('Please fill in Doctor Name, Date, and Time')
      return
    }

    try {
      const created = await appointmentAPI.create({
        ...newAppointment,
        status: 'upcoming'
      })
      setAppointments([created, ...appointments])
      setNewAppointment({ doctor: '', specialty: '', date: '', time: '', clinic: '', notes: '' })
      setShowModal(false)
    } catch (error) {
      alert('Failed to save appointment: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await appointmentAPI.remove(id)
      setAppointments(appointments.filter(apt => apt._id !== id))
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-heading font-bold text-darkblue">📅 My Appointments</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition shadow-md"
          >
            + Add Appointment
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-400 mt-8">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <p className="text-center text-gray-400 mt-8">No appointments yet. Click "+ Add Appointment" to get started!</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {appointments.map((apt) => (
              <AppointmentCard key={apt._id} appointment={apt} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-heading font-bold text-darkblue mb-4">Add New Appointment</h2>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Doctor Name</label>
                <input type="text" value={newAppointment.doctor} onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })} placeholder="e.g. Dr. Sharma" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Specialty</label>
                <input type="text" value={newAppointment.specialty} onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })} placeholder="e.g. Cardiologist" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Date</label>
                <input type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Time</label>
                <input type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Clinic Address</label>
                <input type="text" value={newAppointment.clinic} onChange={(e) => setNewAppointment({ ...newAppointment, clinic: e.target.value })} placeholder="e.g. City Heart Clinic, Karnal" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-darkblue mb-1">Notes (optional)</label>
                <textarea value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} placeholder="Any additional notes..." rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">Save Appointment</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Appointments

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import { isLoggedIn, appointmentAPI } from '../api.js'

function Calendar() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

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
    }
  }

  const daysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay()

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const formatDateStr = (year, month, day) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  const getAppointmentsForDate = (day) => {
    const dateStr = formatDateStr(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return appointments.filter(apt => apt.date === dateStr)
  }

  const isToday = (day) => {
    const today = new Date()
    return day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
  }

  const isSelected = (day) => {
    return day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
  }

  const selectedDateStr = formatDateStr(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  const selectedAppointments = appointments.filter(apt => apt.date === selectedDateStr)

  const totalDays = daysInMonth(currentMonth)
  const startDay = firstDayOfMonth(currentMonth)
  const calendarDays = []
  for (let i = 0; i < startDay; i++) calendarDays.push(null)
  for (let i = 1; i <= totalDays; i++) calendarDays.push(i)

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <h1 className="text-2xl font-heading font-bold text-darkblue mb-6">🗓️ Health Calendar</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <button onClick={prevMonth} className="px-3 py-1 text-lg text-primary hover:bg-gray-100 rounded-lg transition">◀</button>
              <h2 className="text-xl font-heading font-semibold text-darkblue">
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <button onClick={nextMonth} className="px-3 py-1 text-lg text-primary hover:bg-gray-100 rounded-lg transition">▶</button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {dayNames.map(day => (
                <div key={day} className="text-center text-sm font-medium text-gray-400 py-2">{day}</div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => {
                if (day === null) return <div key={`empty-${index}`} />
                const hasAppointments = getAppointmentsForDate(day).length > 0
                return (
                  <button
                    key={day}
                    onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                    className={`relative p-2 h-12 rounded-lg text-sm transition
                      ${isSelected(day) ? 'bg-primary text-white' :
                        isToday(day) ? 'bg-primary/10 text-primary font-bold' :
                        'hover:bg-gray-100 text-darkblue'}
                    `}
                  >
                    {day}
                    {hasAppointments && (
                      <span className={`absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full
                        ${isSelected(day) ? 'bg-white' : 'bg-primary'}`}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="font-heading font-semibold text-darkblue mb-4">
              📋 {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
            </h3>

            {selectedAppointments.length === 0 ? (
              <p className="text-gray-400 text-sm">No appointments on this day.</p>
            ) : (
              <div className="space-y-3">
                {selectedAppointments.map(apt => (
                  <div key={apt._id} className="p-4 bg-background rounded-lg border border-gray-100">
                    <p className="font-semibold text-darkblue">{apt.doctor}</p>
                    <p className="text-sm text-primary">{apt.specialty}</p>
                    <p className="text-sm text-gray-500 mt-1">🕐 {apt.time}</p>
                    {apt.clinic && <p className="text-sm text-gray-500">📍 {apt.clinic}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Calendar

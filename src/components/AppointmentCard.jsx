import { useState } from 'react'

function AppointmentCard({ appointment, onDelete }) {
  const [showDetails, setShowDetails] = useState(false)

  const statusStyle = appointment.status === 'upcoming'
    ? 'bg-green-100 text-success'
    : 'bg-gray-100 text-gray-500'

  return (
    <div className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition border border-gray-100">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-heading font-semibold text-lg text-darkblue">{appointment.doctor}</h3>
          {appointment.specialty && (
            <span className="inline-block mt-1 text-xs px-2 py-1 bg-primary/10 text-primary rounded-full font-medium">
              {appointment.specialty}
            </span>
          )}
        </div>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyle}`}>
          {appointment.status === 'upcoming' ? '📅 Upcoming' : '✅ Completed'}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mt-3">
        <p>📆 <strong>Date:</strong> {appointment.date}</p>
        <p>🕐 <strong>Time:</strong> {appointment.time}</p>
        {appointment.clinic && <p>🏥 <strong>Clinic:</strong> {appointment.clinic}</p>}
      </div>

      {showDetails && appointment.notes && (
        <div className="mt-3 p-3 bg-background rounded-lg text-sm text-gray-600">
          <p><strong>📝 Notes:</strong> {appointment.notes}</p>
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="flex-1 text-sm py-2 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
        >
          {showDetails ? 'Hide Details' : 'View Details'}
        </button>
        {onDelete && (
          <button
            onClick={() => onDelete(appointment._id)}
            className="text-sm px-3 py-2 text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition"
          >
            🗑️ Delete
          </button>
        )}
      </div>
    </div>
  )
}

export default AppointmentCard

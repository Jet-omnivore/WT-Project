// MedicineCard.jsx — Reusable card to display a medicine
// Used on the Medicine Tracker page
// Shows medicine name, dosage, frequency, time, and status

function MedicineCard({ medicine, onEdit, onDelete }) {
  // Choose border color based on status: green for active, gray for completed
  const borderColor = medicine.status === 'active' ? 'border-success' : 'border-gray-300'
  const statusBadge = medicine.status === 'active'
    ? 'bg-green-100 text-success'
    : 'bg-gray-100 text-gray-500'

  return (
    <div className={`bg-white rounded-xl shadow-md p-5 border-l-4 ${borderColor} hover:shadow-lg transition`}>
      {/* Top row: Medicine name + status badge */}
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-heading font-semibold text-lg text-darkblue">{medicine.name}</h3>
        <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusBadge}`}>
          {medicine.status === 'active' ? '🟢 Active' : '✔️ Completed'}
        </span>
      </div>

      {/* Medicine details */}
      <div className="space-y-1 text-sm text-gray-600">
        <p>💊 <strong>Dosage:</strong> {medicine.dose}</p>
        <p>🔁 <strong>Frequency:</strong> {medicine.frequency}</p>
        <p>🕐 <strong>Time:</strong> {medicine.time}</p>
      </div>

      {/* Action buttons: Edit & Delete */}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={() => onEdit && onEdit(medicine)}
          className="text-sm px-3 py-1 text-primary border border-primary rounded-lg hover:bg-primary hover:text-white transition"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => onDelete && onDelete(medicine.name)}
          className="text-sm px-3 py-1 text-danger border border-danger rounded-lg hover:bg-danger hover:text-white transition"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  )
}

export default MedicineCard

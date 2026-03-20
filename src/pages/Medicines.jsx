import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar.jsx'
import MedicineCard from '../components/MedicineCard.jsx'
import { isLoggedIn, medicineAPI } from '../api.js'

function Medicines() {
  const navigate = useNavigate()
  const [medicines, setMedicines] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newMedicine, setNewMedicine] = useState({
    name: '', dose: '', unit: 'mg', frequency: 'Daily', time: '', notes: ''
  })

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate('/login')
      return
    }
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try {
      const data = await medicineAPI.getAll()
      setMedicines(data)
    } catch (error) {
      console.error('Failed to load medicines:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredMedicines = medicines.filter(med =>
    med.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleSave = async () => {
    if (!newMedicine.name || !newMedicine.dose || !newMedicine.time) {
      alert('Please fill in Medicine Name, Dosage, and Time')
      return
    }

    try {
      const created = await medicineAPI.create({
        name: newMedicine.name,
        dose: `${newMedicine.dose}${newMedicine.unit}`,
        frequency: newMedicine.frequency,
        time: newMedicine.time,
        notes: newMedicine.notes,
        status: 'active'
      })
      setMedicines([created, ...medicines])
      setNewMedicine({ name: '', dose: '', unit: 'mg', frequency: 'Daily', time: '', notes: '' })
      setShowModal(false)
    } catch (error) {
      alert('Failed to save medicine: ' + error.message)
    }
  }

  const handleDelete = async (id) => {
    try {
      await medicineAPI.remove(id)
      setMedicines(medicines.filter(med => med._id !== id))
    } catch (error) {
      alert('Failed to delete: ' + error.message)
    }
  }

  return (
    <div className="min-h-screen bg-background font-body">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-24 md:pb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl font-heading font-bold text-darkblue">💊 My Medicines</h1>
          <button
            onClick={() => setShowModal(true)}
            className="px-5 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition shadow-md"
          >
            + Add Medicine
          </button>
        </div>

        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Search medicines..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full max-w-md px-4 py-3 rounded-lg border border-gray-200 outline-none focus:border-primary transition"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-400 mt-8">Loading medicines...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMedicines.map((med) => (
              <MedicineCard key={med._id} medicine={med} onDelete={() => handleDelete(med._id)} />
            ))}
          </div>
        )}

        {!loading && filteredMedicines.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            {searchQuery ? `No medicines found matching "${searchQuery}"` : 'No medicines yet. Click "+ Add Medicine" to get started!'}
          </p>
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-heading font-bold text-darkblue mb-4">Add New Medicine</h2>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Medicine Name</label>
                <input type="text" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} placeholder="e.g. Paracetamol" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-sm font-medium text-darkblue mb-1">Dosage</label>
                  <input type="text" value={newMedicine.dose} onChange={(e) => setNewMedicine({ ...newMedicine, dose: e.target.value })} placeholder="e.g. 500" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-darkblue mb-1">Unit</label>
                  <select value={newMedicine.unit} onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary">
                    <option value="mg">mg</option>
                    <option value="ml">ml</option>
                    <option value="tablet">tablet</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Frequency</label>
                <select value={newMedicine.frequency} onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary">
                  <option value="Daily">Daily</option>
                  <option value="Twice Daily">Twice Daily</option>
                  <option value="Weekly">Weekly</option>
                </select>
              </div>

              <div className="mb-3">
                <label className="block text-sm font-medium text-darkblue mb-1">Time</label>
                <input type="text" value={newMedicine.time} onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })} placeholder="e.g. 8:00 AM" className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-darkblue mb-1">Notes (optional)</label>
                <textarea value={newMedicine.notes} onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })} placeholder="Any additional notes..." rows={2} className="w-full px-4 py-2 rounded-lg border border-gray-200 outline-none focus:border-primary resize-none" />
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition">Save Medicine</button>
                <button onClick={() => setShowModal(false)} className="flex-1 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition">Cancel</button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default Medicines

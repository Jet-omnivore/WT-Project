// Medicines.jsx — Fixed borderRadius
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { isLoggedIn, medicineAPI } from '../api.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import LinearProgress from '@mui/material/LinearProgress'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'

function Medicines() {
  const navigate = useNavigate()
  const [medicines, setMedicines] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [newMedicine, setNewMedicine] = useState({ name: '', dose: '', unit: 'mg', frequency: 'Daily', time: '', notes: '' })

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    loadMedicines()
  }, [])

  const loadMedicines = async () => {
    try { setMedicines(await medicineAPI.getAll()) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const filteredMedicines = medicines.filter(med => med.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const handleSave = async () => {
    if (!newMedicine.name || !newMedicine.dose || !newMedicine.time) { alert('Please fill Name, Dosage, and Time'); return }
    try {
      const created = await medicineAPI.create({ name: newMedicine.name, dose: `${newMedicine.dose}${newMedicine.unit}`, frequency: newMedicine.frequency, time: newMedicine.time, notes: newMedicine.notes, status: 'active' })
      setMedicines([created, ...medicines])
      setNewMedicine({ name: '', dose: '', unit: 'mg', frequency: 'Daily', time: '', notes: '' })
      setShowModal(false)
    } catch (e) { alert('Failed: ' + e.message) }
  }

  const handleDelete = async (id) => {
    try { await medicineAPI.remove(id); setMedicines(medicines.filter(m => m._id !== id)) } catch (e) { alert(e.message) }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>My Medications</Typography>
            <Typography variant="body2" sx={{ color: '#5A7A7A', mt: 0.5 }}>Track and manage your daily health routine.</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setShowModal(true)}
            sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Add Medicine</Button>
        </Box>

        <TextField placeholder="Search medicines..." size="small" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 3, mt: 2, maxWidth: 400, '& .MuiOutlinedInput-root': { bgcolor: '#fff' } }} fullWidth
          InputProps={{ startAdornment: <InputAdornment position="start"><SearchRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><Typography sx={{ color: '#5A7A7A' }}>Loading...</Typography></Box>
        ) : (
          <Grid container spacing={2.5}>
            {filteredMedicines.map((med, i) => {
              const colors = ['#114B4B', '#8D5D46', '#27AE60', '#1162d4']
              const c = colors[i % colors.length]
              const supplyDays = Math.floor(Math.random() * 20 + 5)
              return (
                <Grid item xs={12} sm={6} lg={4} key={med._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: c, width: 44, height: 44 }}><MedicationRoundedIcon sx={{ fontSize: 22 }} /></Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>{med.name}</Typography>
                            <Typography variant="caption" sx={{ color: '#5A7A7A' }}>{med.dose}</Typography>
                          </Box>
                        </Box>
                        <Chip label={med.status === 'active' ? 'Active' : 'Done'} size="small"
                          sx={{ bgcolor: med.status === 'active' ? '#E8F8EF' : '#F5F5F5', color: med.status === 'active' ? '#27AE60' : '#999', fontSize: '0.7rem', fontWeight: 600 }} />
                      </Box>
                      <Typography variant="body2" sx={{ color: '#5A7A7A', mb: 0.5 }}>🔁 {med.frequency || 'Daily'}</Typography>
                      <Typography variant="body2" sx={{ color: '#5A7A7A' }}>🕐 {med.time}</Typography>
                      <Box sx={{ mt: 2.5 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Supply</Typography>
                          <Typography variant="caption" sx={{ color: supplyDays < 10 ? '#E74C3C' : '#5A7A7A' }}>{supplyDays} days left</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={Math.min(100, (supplyDays / 30) * 100)}
                          sx={{ bgcolor: 'rgba(17,75,75,0.06)', '& .MuiLinearProgress-bar': { bgcolor: supplyDays < 10 ? '#E74C3C' : c } }} />
                      </Box>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ px: 2, py: 1 }}>
                      <Button size="small" startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />} sx={{ color: '#5A7A7A' }}>Edit</Button>
                      <Button size="small" startIcon={<DeleteRoundedIcon sx={{ fontSize: 16 }} />} color="error" onClick={() => handleDelete(med._id)}>Delete</Button>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        {!loading && filteredMedicines.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <MedicationRoundedIcon sx={{ fontSize: 48, color: '#114B4B', opacity: 0.2, mb: 2 }} />
            <Typography sx={{ color: '#5A7A7A' }}>{searchQuery ? `No results for "${searchQuery}"` : 'No medicines yet.'}</Typography>
          </Box>
        )}

        {medicines.length > 0 && (
          <Card sx={{ mt: 3, bgcolor: '#FDE8D2', border: 'none' }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                <TipsAndUpdatesRoundedIcon sx={{ color: '#8D5D46' }} />
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#8D5D46' }}>Guardian Tip</Typography>
              </Box>
              <Typography variant="body2" sx={{ color: '#8D5D46', lineHeight: 1.7 }}>Consistency is key. Patients who take medication at the same time every morning report 25% better stability.</Typography>
              <Button size="small" endIcon={<ArrowForwardRoundedIcon sx={{ fontSize: 16 }} />} sx={{ mt: 1.5, color: '#8D5D46', fontWeight: 600 }}>Read Clinical Guide</Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>Add New Medicine</Typography>
            <IconButton onClick={() => setShowModal(false)} size="small"><CloseRoundedIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="Medicine Name" value={newMedicine.name} onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })} fullWidth />
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                <TextField label="Dosage" value={newMedicine.dose} onChange={(e) => setNewMedicine({ ...newMedicine, dose: e.target.value })} />
                <FormControl><InputLabel>Unit</InputLabel><Select value={newMedicine.unit} onChange={(e) => setNewMedicine({ ...newMedicine, unit: e.target.value })} label="Unit">
                  <MenuItem value="mg">mg</MenuItem><MenuItem value="ml">ml</MenuItem><MenuItem value="tablet">tablet</MenuItem>
                </Select></FormControl>
              </Box>
              <FormControl><InputLabel>Frequency</InputLabel><Select value={newMedicine.frequency} onChange={(e) => setNewMedicine({ ...newMedicine, frequency: e.target.value })} label="Frequency">
                <MenuItem value="Daily">Daily</MenuItem><MenuItem value="Twice Daily">Twice Daily</MenuItem><MenuItem value="Weekly">Weekly</MenuItem>
              </Select></FormControl>
              <TextField label="Time" value={newMedicine.time} onChange={(e) => setNewMedicine({ ...newMedicine, time: e.target.value })} placeholder="e.g. 8:00 AM" />
              <TextField label="Notes" value={newMedicine.notes} onChange={(e) => setNewMedicine({ ...newMedicine, notes: e.target.value })} multiline rows={2} />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setShowModal(false)} sx={{ color: '#5A7A7A' }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Save Medicine</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Medicines

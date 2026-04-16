// Appointments.jsx — Fixed borderRadius
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { isLoggedIn, appointmentAPI } from '../api.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Grid from '@mui/material/Grid'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'

function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [newAppointment, setNewAppointment] = useState({ doctor: '', specialty: '', date: '', time: '', clinic: '', notes: '' })

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try { setAppointments(await appointmentAPI.getAll()) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const handleSave = async () => {
    if (!newAppointment.doctor || !newAppointment.date || !newAppointment.time) { alert('Fill Doctor, Date, Time'); return }
    try {
      const created = await appointmentAPI.create({ ...newAppointment, status: 'upcoming' })
      setAppointments([created, ...appointments])
      setNewAppointment({ doctor: '', specialty: '', date: '', time: '', clinic: '', notes: '' })
      setShowModal(false)
    } catch (e) { alert(e.message) }
  }

  const handleDelete = async (id) => {
    try { await appointmentAPI.remove(id); setAppointments(appointments.filter(a => a._id !== id)) } catch (e) { alert(e.message) }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3, flexWrap: 'wrap', gap: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>Your Schedule</Typography>
            <Typography variant="body2" sx={{ color: '#5A7A7A', mt: 0.5 }}>{appointments.length} appointment{appointments.length !== 1 ? 's' : ''}</Typography>
          </Box>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={() => setShowModal(true)}
            sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Add Appointment</Button>
        </Box>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><Typography sx={{ color: '#5A7A7A' }}>Loading...</Typography></Box>
        ) : appointments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <EventNoteRoundedIcon sx={{ fontSize: 48, color: '#114B4B', opacity: 0.2, mb: 2 }} />
            <Typography sx={{ color: '#5A7A7A' }}>No appointments yet.</Typography>
          </Box>
        ) : (
          <Grid container spacing={2.5}>
            {appointments.map((apt) => {
              const isExpanded = expandedId === apt._id
              return (
                <Grid item xs={12} md={6} lg={4} key={apt._id}>
                  <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                          <Avatar sx={{ bgcolor: '#114B4B', width: 44, height: 44 }}><PersonRoundedIcon sx={{ fontSize: 22 }} /></Avatar>
                          <Box>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>{apt.doctor}</Typography>
                            {apt.specialty && <Chip label={apt.specialty} size="small" sx={{ bgcolor: '#E4F2F2', color: '#114B4B', mt: 0.3, fontWeight: 500, fontSize: '0.7rem' }} />}
                          </Box>
                        </Box>
                        <Chip label={apt.status === 'upcoming' ? 'Upcoming' : 'Done'} size="small"
                          sx={{ bgcolor: apt.status === 'upcoming' ? '#E4F2F2' : '#F5F5F5', color: apt.status === 'upcoming' ? '#114B4B' : '#999', fontWeight: 600, fontSize: '0.7rem' }} />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A' }} /><Typography variant="body2" sx={{ color: '#5A7A7A' }}>{apt.date}</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccessTimeRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A' }} /><Typography variant="body2" sx={{ color: '#5A7A7A' }}>{apt.time}</Typography></Box>
                        {apt.clinic && <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><LocationOnRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A' }} /><Typography variant="body2" sx={{ color: '#5A7A7A' }}>{apt.clinic}</Typography></Box>}
                      </Box>
                      <Collapse in={isExpanded}>
                        {apt.notes && <Box sx={{ mt: 2, p: 2, bgcolor: '#E4F2F2', borderRadius: 2 }}>
                          <Typography variant="body2" sx={{ color: '#5A7A7A' }}><strong>Notes:</strong> {apt.notes}</Typography>
                        </Box>}
                      </Collapse>
                    </CardContent>
                    <Divider />
                    <CardActions sx={{ px: 2, py: 1, justifyContent: 'space-between' }}>
                      <Button size="small" onClick={() => setExpandedId(isExpanded ? null : apt._id)} endIcon={isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />} sx={{ color: '#5A7A7A' }}>{isExpanded ? 'Less' : 'Details'}</Button>
                      <IconButton size="small" color="error" onClick={() => handleDelete(apt._id)}><DeleteRoundedIcon fontSize="small" /></IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        <Dialog open={showModal} onClose={() => setShowModal(false)} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>Add Appointment</Typography>
            <IconButton onClick={() => setShowModal(false)} size="small"><CloseRoundedIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="Doctor Name" value={newAppointment.doctor} onChange={(e) => setNewAppointment({ ...newAppointment, doctor: e.target.value })} fullWidth />
              <TextField label="Specialty" value={newAppointment.specialty} onChange={(e) => setNewAppointment({ ...newAppointment, specialty: e.target.value })} fullWidth />
              <TextField label="Date" type="date" value={newAppointment.date} onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Time" type="time" value={newAppointment.time} onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="Clinic" value={newAppointment.clinic} onChange={(e) => setNewAppointment({ ...newAppointment, clinic: e.target.value })} fullWidth />
              <TextField label="Notes" value={newAppointment.notes} onChange={(e) => setNewAppointment({ ...newAppointment, notes: e.target.value })} multiline rows={2} fullWidth />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={() => setShowModal(false)} sx={{ color: '#5A7A7A' }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Appointments

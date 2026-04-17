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
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded'
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded'
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded'
import CalendarTodayRoundedIcon from '@mui/icons-material/CalendarTodayRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import { formatTime } from '../utils/notificationService.js'
import NotificationCenter from '../components/NotificationCenter.jsx'

function Appointments() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [editingAppointment, setEditingAppointment] = useState(null)
  const emptyForm = { doctor: '', specialty: '', date: '', time: '', clinic: '', notes: '' }
  const [formData, setFormData] = useState(emptyForm)
  const [dateFocused, setDateFocused] = useState(false)
  const [timeFocused, setTimeFocused] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    loadAppointments()
  }, [])

  const loadAppointments = async () => {
    try { setAppointments(await appointmentAPI.getAll()) } catch (e) { console.error(e) } finally { setLoading(false) }
  }

  const openAddDialog = () => {
    setEditingAppointment(null)
    setFormData(emptyForm)
    setShowModal(true)
  }

  const openEditDialog = (apt) => {
    setEditingAppointment(apt)
    setFormData({
      doctor: apt.doctor || '',
      specialty: apt.specialty || '',
      date: apt.date || '',
      time: apt.time || '',
      clinic: apt.clinic || '',
      notes: apt.notes || '',
    })
    setShowModal(true)
  }

  const closeDialog = () => {
    setShowModal(false)
    setEditingAppointment(null)
    setFormData(emptyForm)
  }

  const handleSave = async () => {
    if (!formData.doctor || !formData.date || !formData.time) { alert('Fill Doctor, Date, Time'); return }
    const payload = {
      ...formData,
      status: editingAppointment ? editingAppointment.status : 'upcoming',
    }
    try {
      if (editingAppointment) {
        const updated = await appointmentAPI.update(editingAppointment._id, payload)
        setAppointments(appointments.map(a => a._id === editingAppointment._id ? updated : a))
      } else {
        const created = await appointmentAPI.create(payload)
        setAppointments([created, ...appointments])
      }
      closeDialog()
    } catch (e) { alert(e.message) }
  }

  const handleDelete = async (id) => {
    try { await appointmentAPI.remove(id); setAppointments(appointments.filter(a => a._id !== id)) } catch (e) { alert(e.message) }
  }

  // Status chip styles — "Upcoming" pops with a vivid treatment, "Done" stays muted
  const getStatusChipSx = (status) => {
    if (status === 'upcoming') {
      return {
        bgcolor: '#114B4B',
        color: '#ffffff',
        fontWeight: 700,
        fontSize: '0.7rem',
        boxShadow: '0 2px 8px rgba(17,75,75,0.25)',
        '& .MuiChip-label': { px: 1.2 },
      }
    }
    return {
      bgcolor: '#F5F5F5',
      color: '#999',
      fontWeight: 600,
      fontSize: '0.7rem',
    }
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openAddDialog}
              sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Add Appointment</Button>
            <NotificationCenter />
          </Box>
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
                        <Chip
                          label={apt.status === 'upcoming' ? '● Upcoming' : '✓ Done'}
                          size="small"
                          sx={getStatusChipSx(apt.status)}
                        />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.8 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><CalendarTodayRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A' }} /><Typography variant="body2" sx={{ color: '#5A7A7A' }}>{apt.date}</Typography></Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><AccessTimeRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A' }} /><Typography variant="body2" sx={{ color: '#5A7A7A' }}>{formatTime(apt.time)}</Typography></Box>
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
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        <Button size="small" onClick={() => setExpandedId(isExpanded ? null : apt._id)} endIcon={isExpanded ? <ExpandLessRoundedIcon /> : <ExpandMoreRoundedIcon />} sx={{ color: '#5A7A7A' }}>{isExpanded ? 'Less' : 'Details'}</Button>
                        <Button size="small" startIcon={<EditRoundedIcon sx={{ fontSize: 16 }} />} sx={{ color: '#5A7A7A' }} onClick={() => openEditDialog(apt)}>Edit</Button>
                      </Box>
                      <IconButton size="small" color="error" onClick={() => handleDelete(apt._id)}><DeleteRoundedIcon fontSize="small" /></IconButton>
                    </CardActions>
                  </Card>
                </Grid>
              )
            })}
          </Grid>
        )}

        <Dialog open={showModal} onClose={closeDialog} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>{editingAppointment ? 'Edit Appointment' : 'Add Appointment'}</Typography>
            <IconButton onClick={closeDialog} size="small"><CloseRoundedIcon /></IconButton>
          </DialogTitle>
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, pt: 1 }}>
              <TextField label="Doctor Name" value={formData.doctor} onChange={(e) => setFormData({ ...formData, doctor: e.target.value })} fullWidth />
              <TextField label="Specialty" value={formData.specialty} onChange={(e) => setFormData({ ...formData, specialty: e.target.value })} fullWidth />
              <TextField label="Date" type="date" value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                onFocus={() => setDateFocused(true)}
                onBlur={() => setDateFocused(false)}
                slotProps={{ inputLabel: { shrink: dateFocused || !!formData.date } }}
                sx={{
                  '& input[type="date"]:not(:focus)': !formData.date ? {
                    color: 'transparent',
                    '&::-webkit-datetime-edit': { color: 'transparent' },
                  } : {},
                }}
                fullWidth />
              <TextField label="Time" type="time" value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                onFocus={() => setTimeFocused(true)}
                onBlur={() => setTimeFocused(false)}
                slotProps={{ inputLabel: { shrink: timeFocused || !!formData.time } }}
                sx={{
                  '& input[type="time"]:not(:focus)': !formData.time ? {
                    color: 'transparent',
                    '&::-webkit-datetime-edit': { color: 'transparent' },
                  } : {},
                }}
                fullWidth />
              <TextField label="Clinic" value={formData.clinic} onChange={(e) => setFormData({ ...formData, clinic: e.target.value })} fullWidth />
              <TextField label="Notes" value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} multiline rows={2} fullWidth />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2 }}>
            <Button onClick={closeDialog} sx={{ color: '#5A7A7A' }}>Cancel</Button>
            <Button onClick={handleSave} variant="contained" sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>{editingAppointment ? 'Update' : 'Save'}</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default Appointments

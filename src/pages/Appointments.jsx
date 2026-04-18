// Appointments.jsx — Redesigned cards with accessible date/time/clinic layout
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
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import { formatTime } from '../utils/notificationService.js'
import NotificationCenter from '../components/NotificationCenter.jsx'

// Helper to format date into a readable form for senior citizens
const formatReadableDate = (dateStr) => {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
  } catch {
    return dateStr
  }
}

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
              const isUpcoming = apt.status === 'upcoming'
              return (
                <Grid item xs={12} md={6} lg={4} key={apt._id}>
                  <Card sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'visible',
                    position: 'relative',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 8px 28px rgba(17,75,75,0.12)' },
                  }}>
                    <CardContent sx={{ flexGrow: 1, p: 0 }}>
                      {/* Header with doctor info and status */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', p: 2.5, pb: 2 }}>
                        <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center', minWidth: 0, flex: 1 }}>
                          <Avatar sx={{ bgcolor: isUpcoming ? '#114B4B' : '#D5D5D5', width: 44, height: 44, flexShrink: 0 }}>
                            <PersonRoundedIcon sx={{ fontSize: 22 }} />
                          </Avatar>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B', lineHeight: 1.3 }} noWrap>{apt.doctor}</Typography>
                            {apt.specialty && (
                              <Chip label={apt.specialty} size="small"
                                sx={{ bgcolor: '#E4F2F2', color: '#114B4B', mt: 0.5, fontWeight: 500, fontSize: '0.7rem', height: 22 }} />
                            )}
                          </Box>
                        </Box>
                        {isUpcoming ? (
                          <Chip
                            icon={<FiberManualRecordIcon sx={{ fontSize: '8px !important', animation: 'pulse 2s ease-in-out infinite', '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />}
                            label="Upcoming"
                            size="small"
                            sx={{
                              bgcolor: '#114B4B',
                              color: '#fff',
                              fontWeight: 700,
                              fontSize: '0.7rem',
                              height: 26,
                              borderRadius: '13px',
                              boxShadow: '0 2px 10px rgba(17,75,75,0.3)',
                              '& .MuiChip-icon': { color: '#4ADE80', ml: 0.5 },
                              '& .MuiChip-label': { px: 1 },
                            }}
                          />
                        ) : (
                          <Chip
                            label="✓ Done"
                            size="small"
                            sx={{ bgcolor: '#F0F0F0', color: '#999', fontWeight: 600, fontSize: '0.7rem', height: 26, borderRadius: '13px' }}
                          />
                        )}
                      </Box>

                      {/* Date/Time/Clinic — prominent, senior-friendly info blocks */}
                      <Box sx={{ px: 2.5, pb: 2 }}>
                        <Box sx={{
                          display: 'grid',
                          gridTemplateColumns: apt.clinic ? '1fr 1fr' : '1fr 1fr',
                          gap: 1.5,
                        }}>
                          {/* Date Block */}
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: '#F0F8F8',
                            border: '1px solid rgba(17,75,75,0.06)',
                          }}>
                            <Box sx={{
                              width: 36, height: 36, borderRadius: '10px',
                              bgcolor: '#114B4B', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <CalendarTodayRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: '#5A7A7A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>Date</Typography>
                              <Typography sx={{ fontSize: '0.85rem', color: '#114B4B', fontWeight: 600, lineHeight: 1.3 }} noWrap>{formatReadableDate(apt.date)}</Typography>
                            </Box>
                          </Box>

                          {/* Time Block */}
                          <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            p: 1.5,
                            borderRadius: 2.5,
                            bgcolor: '#FDF6EE',
                            border: '1px solid rgba(141,93,70,0.08)',
                          }}>
                            <Box sx={{
                              width: 36, height: 36, borderRadius: '10px',
                              bgcolor: '#8D5D46', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              flexShrink: 0,
                            }}>
                              <AccessTimeRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />
                            </Box>
                            <Box sx={{ minWidth: 0 }}>
                              <Typography sx={{ fontSize: '0.65rem', color: '#5A7A7A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>Time</Typography>
                              <Typography sx={{ fontSize: '0.85rem', color: '#8D5D46', fontWeight: 600, lineHeight: 1.3 }} noWrap>{formatTime(apt.time)}</Typography>
                            </Box>
                          </Box>

                          {/* Clinic Block — spans full width if present */}
                          {apt.clinic && (
                            <Box sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1.5,
                              p: 1.5,
                              borderRadius: 2.5,
                              bgcolor: '#F5F0FB',
                              border: '1px solid rgba(107,78,148,0.08)',
                              gridColumn: '1 / -1',
                            }}>
                              <Box sx={{
                                width: 36, height: 36, borderRadius: '10px',
                                bgcolor: '#6B4E94', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0,
                              }}>
                                <LocationOnRoundedIcon sx={{ fontSize: 17, color: '#fff' }} />
                              </Box>
                              <Box sx={{ minWidth: 0 }}>
                                <Typography sx={{ fontSize: '0.65rem', color: '#5A7A7A', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', lineHeight: 1.2 }}>Clinic</Typography>
                                <Typography sx={{ fontSize: '0.85rem', color: '#6B4E94', fontWeight: 600, lineHeight: 1.3 }}>{apt.clinic}</Typography>
                              </Box>
                            </Box>
                          )}
                        </Box>
                      </Box>

                      {/* Expandable Notes */}
                      <Collapse in={isExpanded}>
                        {apt.notes && (
                          <Box sx={{ mx: 2.5, mb: 2, p: 2, bgcolor: '#E4F2F2', borderRadius: 2 }}>
                            <Typography variant="body2" sx={{ color: '#5A7A7A' }}><strong>Notes:</strong> {apt.notes}</Typography>
                          </Box>
                        )}
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

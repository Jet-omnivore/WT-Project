// Dashboard.jsx — With undo taken, mark attended, and confirmation dialogs
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { getUser, isLoggedIn, medicineAPI, appointmentAPI } from '../api.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'
import UndoRoundedIcon from '@mui/icons-material/UndoRounded'
import EventAvailableRoundedIcon from '@mui/icons-material/EventAvailableRounded'
import { formatTime } from '../utils/notificationService.js'
import NotificationCenter from '../components/NotificationCenter.jsx'

// Helper to get today's date string for localStorage scoping
const getTodayKey = (suffix) => {
  const today = new Date().toISOString().slice(0, 10) // e.g. "2026-04-17"
  const user = getUser()
  return `dashboard_${suffix}_${user?.id || 'guest'}_${today}`
}

const loadPersistedIds = (suffix) => {
  try {
    const data = localStorage.getItem(getTodayKey(suffix))
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const [medicines, setMedicines] = useState([])
  const [appointments, setAppointments] = useState([])
  const [takenIds, setTakenIds] = useState(() => loadPersistedIds('taken'))
  const [skippedIds, setSkippedIds] = useState(() => loadPersistedIds('skipped'))
  const [attendedIds, setAttendedIds] = useState(() => loadPersistedIds('attended'))

  // Confirmation dialog state
  const [confirmDialog, setConfirmDialog] = useState({ open: false, title: '', message: '', onConfirm: null })

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    loadData()
  }, [])

  // Persist taken/skipped/attended IDs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(getTodayKey('taken'), JSON.stringify(takenIds))
  }, [takenIds])

  useEffect(() => {
    localStorage.setItem(getTodayKey('skipped'), JSON.stringify(skippedIds))
  }, [skippedIds])

  useEffect(() => {
    localStorage.setItem(getTodayKey('attended'), JSON.stringify(attendedIds))
  }, [attendedIds])

  const loadData = async () => {
    try {
      const [medsData, aptsData] = await Promise.all([medicineAPI.getAll(), appointmentAPI.getAll()])
      setMedicines(medsData.filter(m => m.status === 'active').slice(0, 4))
      setAppointments(aptsData.filter(a => a.status === 'upcoming').slice(0, 3))
    } catch (error) { console.error(error) }
  }

  const handleTaken = (id) => setTakenIds([...takenIds, id])
  const handleSkip = (id) => setSkippedIds([...skippedIds, id])
  const getCardStatus = (id) => takenIds.includes(id) ? 'taken' : skippedIds.includes(id) ? 'skipped' : 'pending'

  // Undo taken — with confirmation
  const handleUndoTaken = (med) => {
    setConfirmDialog({
      open: true,
      title: 'Undo Mark as Taken',
      message: `Are you sure you want to undo marking "${med.name}" as taken?`,
      onConfirm: () => {
        setTakenIds(takenIds.filter(id => id !== med._id))
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })
      }
    })
  }

  // Undo skipped — with confirmation
  const handleUndoSkipped = (med) => {
    setConfirmDialog({
      open: true,
      title: 'Undo Skip',
      message: `Are you sure you want to undo skipping "${med.name}"?`,
      onConfirm: () => {
        setSkippedIds(skippedIds.filter(id => id !== med._id))
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })
      }
    })
  }

  // Mark appointment as attended
  const handleMarkAttended = (id) => setAttendedIds([...attendedIds, id])

  // Undo attended — with confirmation
  const handleUndoAttended = (apt) => {
    setConfirmDialog({
      open: true,
      title: 'Undo Mark as Attended',
      message: `Are you sure you want to undo marking the appointment with "${apt.doctor}" as attended?`,
      onConfirm: () => {
        setAttendedIds(attendedIds.filter(id => id !== apt._id))
        setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })
      }
    })
  }

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const adherencePercent = medicines.length > 0 ? Math.round((takenIds.length / medicines.length) * 100) : 0

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 4 }}>
          <Box>
            <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 0.5 }}>{greeting}, {user?.fullName?.split(' ')[0] || 'User'} 👋</Typography>
            <Typography variant="body2" sx={{ color: '#5A7A7A' }}>You have {medicines.length} medication{medicines.length !== 1 ? 's' : ''} scheduled today.</Typography>
          </Box>
          <NotificationCenter />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card sx={{ mb: 3 }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <AccessTimeRoundedIcon sx={{ color: '#114B4B' }} />
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>Today's Schedule</Typography>
                </Box>
                {medicines.length === 0 ? (
                  <Typography sx={{ color: '#5A7A7A' }}>No active medicines. Add some from the Medications page!</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {medicines.map((med) => {
                      const status = getCardStatus(med._id)
                      return (
                        <Card key={med._id} variant="outlined"
                          onClick={status === 'taken' ? () => handleUndoTaken(med) : status === 'skipped' ? () => handleUndoSkipped(med) : undefined}
                          sx={{
                            bgcolor: status === 'taken' ? '#E8F8EF' : status === 'skipped' ? '#F5F5F5' : '#F8FDFD',
                            borderColor: status === 'taken' ? '#27AE60' : 'rgba(17,75,75,0.1)',
                            boxShadow: 'none',
                            cursor: (status === 'taken' || status === 'skipped') ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: status === 'taken' ? '0 2px 12px rgba(39,174,96,0.15)' : status === 'skipped' ? '0 2px 12px rgba(0,0,0,0.08)' : 'none',
                            },
                          }}>
                          <CardContent sx={{ pb: '8px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#114B4B', width: 44, height: 44 }}><MedicationRoundedIcon sx={{ fontSize: 22 }} /></Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>{med.name}</Typography>
                                  <Typography variant="body2" sx={{ color: '#5A7A7A' }}>{med.dose} • {med.frequency || 'Once daily'} • {formatTime(med.time)}</Typography>
                                </Box>
                              </Box>
                              {status === 'taken' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Chip icon={<CheckCircleRoundedIcon />} label="Taken" color="success" size="small" variant="outlined" />
                                  <UndoRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A', opacity: 0.5 }} />
                                </Box>
                              )}
                              {status === 'skipped' && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Chip icon={<SkipNextRoundedIcon />} label="Skipped" size="small" variant="outlined" />
                                  <UndoRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A', opacity: 0.5 }} />
                                </Box>
                              )}
                            </Box>
                          </CardContent>
                          {status === 'pending' && (
                            <CardActions sx={{ px: 2, pb: 2 }}>
                              <Button size="small" variant="contained" startIcon={<CheckCircleRoundedIcon />} onClick={() => handleTaken(med._id)}
                                sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Mark Taken</Button>
                              <Button size="small" variant="outlined" startIcon={<SkipNextRoundedIcon />} onClick={() => handleSkip(med._id)}
                                sx={{ borderColor: 'rgba(17,75,75,0.2)', color: '#5A7A7A' }}>Skip</Button>
                            </CardActions>
                          )}
                        </Card>
                      )
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                  <EventNoteRoundedIcon sx={{ color: '#114B4B' }} />
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>Upcoming Appointments</Typography>
                </Box>
                {appointments.length === 0 ? (
                  <Typography sx={{ color: '#5A7A7A' }}>No upcoming appointments.</Typography>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {appointments.map((apt) => {
                      const isAttended = attendedIds.includes(apt._id)
                      return (
                        <Card key={apt._id} variant="outlined"
                          onClick={isAttended ? () => handleUndoAttended(apt) : undefined}
                          sx={{
                            borderColor: isAttended ? 'rgba(39,174,96,0.3)' : 'rgba(17,75,75,0.08)',
                            bgcolor: isAttended ? '#F0FAF4' : '#fff',
                            boxShadow: 'none',
                            opacity: isAttended ? 0.7 : 1,
                            cursor: isAttended ? 'pointer' : 'default',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              boxShadow: isAttended ? '0 2px 12px rgba(39,174,96,0.12)' : 'none',
                              opacity: isAttended ? 0.85 : 1,
                            },
                          }}>
                          <CardContent sx={{ pb: '12px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box>
                                <Typography variant="subtitle1" fontWeight={600} sx={{ color: isAttended ? '#5A7A7A' : '#114B4B', textDecoration: isAttended ? 'line-through' : 'none' }}>{apt.doctor}</Typography>
                                {apt.specialty && <Chip label={apt.specialty} size="small" sx={{ bgcolor: '#E4F2F2', color: '#114B4B', mt: 0.5, fontWeight: 500 }} />}
                              </Box>
                              {isAttended ? (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Chip icon={<EventAvailableRoundedIcon />} label="Attended" size="small" color="success" variant="outlined" />
                                  <UndoRoundedIcon sx={{ fontSize: 16, color: '#5A7A7A', opacity: 0.5 }} />
                                </Box>
                              ) : (
                                <Button size="small" variant="outlined" startIcon={<EventAvailableRoundedIcon sx={{ fontSize: 16 }} />}
                                  onClick={() => handleMarkAttended(apt._id)}
                                  sx={{ borderColor: 'rgba(17,75,75,0.2)', color: '#114B4B', fontSize: '0.75rem', '&:hover': { borderColor: '#114B4B', bgcolor: 'rgba(17,75,75,0.04)' } }}>
                                  Mark Attended
                                </Button>
                              )}
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                              <Typography variant="body2" sx={{ color: '#5A7A7A' }}>📆 {apt.date}</Typography>
                              <Typography variant="body2" sx={{ color: '#5A7A7A' }}>🕐 {formatTime(apt.time)}</Typography>
                            </Box>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ mb: 3, textAlign: 'center' }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B', mb: 3 }}>Weekly Summary</Typography>
                <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
                  <CircularProgress variant="determinate" value={100} size={120} thickness={4} sx={{ color: 'rgba(17,75,75,0.08)' }} />
                  <CircularProgress variant="determinate" value={adherencePercent} size={120} thickness={4} sx={{ position: 'absolute', left: 0, color: '#114B4B' }} />
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>{adherencePercent}%</Typography>
                  </Box>
                </Box>
                <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#114B4B' }}>Adherence Score</Typography>
                <Typography variant="body2" sx={{ color: '#5A7A7A', mt: 0.5 }}>{adherencePercent >= 80 ? 'Excellent!' : 'Keep going!'}</Typography>
                <Divider sx={{ my: 2.5 }} />
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#27AE60' }}>{takenIds.length}/{medicines.length}</Typography>
                    <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Taken Today</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="h5" fontWeight={700} sx={{ color: '#8D5D46' }}>
                      <LocalFireDepartmentRoundedIcon sx={{ fontSize: 20, verticalAlign: 'text-bottom', mr: 0.5 }} />{takenIds.length}
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Day Streak</Typography>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: '#FDE8D2', border: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <TipsAndUpdatesRoundedIcon sx={{ color: '#8D5D46' }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#8D5D46' }}>Guardian Tip</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#8D5D46', lineHeight: 1.7 }}>Drinking water with your medication helps absorption. Stay hydrated throughout the day!</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
        PaperProps={{ sx: { borderRadius: 3, px: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#114B4B' }}>{confirmDialog.title}</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#5A7A7A' }}>{confirmDialog.message}</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setConfirmDialog({ open: false, title: '', message: '', onConfirm: null })}
            sx={{ color: '#5A7A7A' }}>No</Button>
          <Button variant="contained" onClick={confirmDialog.onConfirm}
            sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Yes</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Dashboard

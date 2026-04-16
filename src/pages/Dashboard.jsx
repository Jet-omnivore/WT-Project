// Dashboard.jsx — Fixed borderRadius
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
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import SkipNextRoundedIcon from '@mui/icons-material/SkipNextRounded'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded'
import LocalFireDepartmentRoundedIcon from '@mui/icons-material/LocalFireDepartmentRounded'

function Dashboard() {
  const navigate = useNavigate()
  const user = getUser()
  const [medicines, setMedicines] = useState([])
  const [appointments, setAppointments] = useState([])
  const [takenIds, setTakenIds] = useState([])
  const [skippedIds, setSkippedIds] = useState([])

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    loadData()
  }, [])

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

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening'
  const adherencePercent = medicines.length > 0 ? Math.round((takenIds.length / medicines.length) * 100) : 0

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 0.5 }}>{greeting}, {user?.fullName?.split(' ')[0] || 'User'} 👋</Typography>
          <Typography variant="body2" sx={{ color: '#5A7A7A' }}>You have {medicines.length} medication{medicines.length !== 1 ? 's' : ''} scheduled today.</Typography>
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
                          sx={{ bgcolor: status === 'taken' ? '#E8F8EF' : status === 'skipped' ? '#F5F5F5' : '#F8FDFD', borderColor: status === 'taken' ? '#27AE60' : 'rgba(17,75,75,0.1)', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
                          <CardContent sx={{ pb: '8px !important' }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                <Avatar sx={{ bgcolor: '#114B4B', width: 44, height: 44 }}><MedicationRoundedIcon sx={{ fontSize: 22 }} /></Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>{med.name}</Typography>
                                  <Typography variant="body2" sx={{ color: '#5A7A7A' }}>{med.dose} • {med.frequency || 'Once daily'} • {med.time}</Typography>
                                </Box>
                              </Box>
                              {status === 'taken' && <Chip icon={<CheckCircleRoundedIcon />} label="Taken" color="success" size="small" variant="outlined" />}
                              {status === 'skipped' && <Chip icon={<SkipNextRoundedIcon />} label="Skipped" size="small" variant="outlined" />}
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
                    {appointments.map((apt) => (
                      <Card key={apt._id} variant="outlined" sx={{ borderColor: 'rgba(17,75,75,0.08)', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
                        <CardContent sx={{ pb: '12px !important' }}>
                          <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>{apt.doctor}</Typography>
                          {apt.specialty && <Chip label={apt.specialty} size="small" sx={{ bgcolor: '#E4F2F2', color: '#114B4B', mt: 0.5, fontWeight: 500 }} />}
                          <Box sx={{ display: 'flex', gap: 2, mt: 1.5 }}>
                            <Typography variant="body2" sx={{ color: '#5A7A7A' }}>📆 {apt.date}</Typography>
                            <Typography variant="body2" sx={{ color: '#5A7A7A' }}>🕐 {apt.time}</Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
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
    </Box>
  )
}

export default Dashboard

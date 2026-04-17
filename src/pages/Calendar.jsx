// Calendar.jsx — Fixed borderRadius
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { isLoggedIn, appointmentAPI } from '../api.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded'
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import TipsAndUpdatesRoundedIcon from '@mui/icons-material/TipsAndUpdatesRounded'
import NotificationCenter from '../components/NotificationCenter.jsx'

function Calendar() {
  const navigate = useNavigate()
  const [appointments, setAppointments] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(new Date())

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    appointmentAPI.getAll().then(setAppointments).catch(console.error)
  }, [])

  const daysInMonth = (d) => new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const firstDay = (d) => new Date(d.getFullYear(), d.getMonth(), 1).getDay()
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const dayNames = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
  const fmt = (y, m, d) => `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`

  const getAptsForDay = (day) => appointments.filter(a => a.date === fmt(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  const isToday = (day) => { const t = new Date(); return day === t.getDate() && currentMonth.getMonth() === t.getMonth() && currentMonth.getFullYear() === t.getFullYear() }
  const isSel = (day) => day === selectedDate.getDate() && currentMonth.getMonth() === selectedDate.getMonth() && currentMonth.getFullYear() === selectedDate.getFullYear()

  const selStr = fmt(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())
  const selApts = appointments.filter(a => a.date === selStr)

  const total = daysInMonth(currentMonth)
  const start = firstDay(currentMonth)
  const cells = []
  for (let i = 0; i < start; i++) cells.push(null)
  for (let i = 1; i <= total; i++) cells.push(i)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CalendarMonthRoundedIcon sx={{ color: '#114B4B', fontSize: 28 }} />
            <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>Health Calendar</Typography>
          </Box>
          <NotificationCenter />
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <Card>
              <CardContent sx={{ p: { xs: 2, md: 3 } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))} sx={{ color: '#114B4B' }}><ChevronLeftRoundedIcon /></IconButton>
                  <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</Typography>
                  <IconButton onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))} sx={{ color: '#114B4B' }}><ChevronRightRoundedIcon /></IconButton>
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5, mb: 1 }}>
                  {dayNames.map((d, i) => (
                    <Typography key={i} variant="caption" sx={{ textAlign: 'center', color: '#5A7A7A', fontWeight: 600, py: 1 }}>{d}</Typography>
                  ))}
                </Box>
                <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 0.5 }}>
                  {cells.map((day, i) => {
                    if (!day) return <Box key={`e-${i}`} />
                    const has = getAptsForDay(day).length > 0
                    const sel = isSel(day)
                    const today = isToday(day)
                    return (
                      <Box key={day} onClick={() => setSelectedDate(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
                        sx={{
                          position: 'relative', height: { xs: 40, md: 48 }, display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', borderRadius: 2, cursor: 'pointer',
                          bgcolor: sel ? '#114B4B' : today ? '#E4F2F2' : 'transparent',
                          color: sel ? '#fff' : today ? '#114B4B' : '#1A2B2B',
                          fontWeight: today || sel ? 700 : 400, transition: 'all 0.15s',
                          '&:hover': { bgcolor: sel ? '#0C3636' : 'rgba(17,75,75,0.06)' },
                        }}>
                        <Typography variant="body2" fontWeight="inherit">{day}</Typography>
                        {has && <Box sx={{ position: 'absolute', bottom: 4, width: 5, height: 5, borderRadius: '50%', bgcolor: sel ? '#FDE8D2' : '#114B4B' }} />}
                      </Box>
                    )
                  })}
                </Box>
              </CardContent>
            </Card>

            <Card sx={{ mt: 3, bgcolor: '#FDE8D2', border: 'none' }}>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <TipsAndUpdatesRoundedIcon sx={{ color: '#8D5D46', fontSize: 20 }} />
                  <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#8D5D46' }}>Preparation Tip</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: '#8D5D46', lineHeight: 1.7 }}>Upload your recent blood work results before your next appointment to save time during consultation.</Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} lg={4}>
            <Card sx={{ position: { lg: 'sticky' }, top: { lg: 24 } }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B', mb: 0.5 }}>
                  {selectedDate.toLocaleDateString('en-IN', { weekday: 'long', month: 'long', day: 'numeric' })}
                </Typography>
                <Typography variant="body2" sx={{ color: '#5A7A7A', mb: 3 }}>{selApts.length} appointment{selApts.length !== 1 ? 's' : ''}</Typography>
                {selApts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CalendarMonthRoundedIcon sx={{ fontSize: 40, color: '#114B4B', opacity: 0.15, mb: 1 }} />
                    <Typography variant="body2" sx={{ color: '#5A7A7A' }}>No appointments.</Typography>
                  </Box>
                ) : (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {selApts.map(apt => (
                      <Card key={apt._id} variant="outlined" sx={{ borderColor: 'rgba(17,75,75,0.08)', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}>
                        <CardContent sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                            <Avatar sx={{ bgcolor: '#114B4B', width: 36, height: 36 }}><PersonRoundedIcon sx={{ fontSize: 18 }} /></Avatar>
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#114B4B' }}>{apt.doctor}</Typography>
                              {apt.specialty && <Typography variant="caption" sx={{ color: '#5A7A7A' }}>{apt.specialty}</Typography>}
                            </Box>
                          </Box>
                          <Typography variant="caption" sx={{ color: '#5A7A7A', display: 'block', mt: 1 }}>🕐 {apt.time}</Typography>
                          {apt.clinic && <Typography variant="caption" sx={{ color: '#5A7A7A', display: 'block' }}>📍 {apt.clinic}</Typography>}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Calendar

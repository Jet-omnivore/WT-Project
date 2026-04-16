// Profile.jsx — Fixed borderRadius
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { getUser, isLoggedIn, logout, medicineAPI, appointmentAPI } from '../api.js'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'

function Profile() {
  const navigate = useNavigate()
  const user = getUser()
  const [mc, setMc] = useState(0)
  const [ac, setAc] = useState(0)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    Promise.all([medicineAPI.getAll(), appointmentAPI.getAll()]).then(([m, a]) => { setMc(m.length); setAc(a.length) }).catch(console.error)
  }, [])

  const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 4 }}>My Profile</Typography>
        <Box sx={{ maxWidth: 600, mx: 'auto' }}>
          <Card sx={{ textAlign: 'center', mb: 3 }}>
            <CardContent sx={{ py: 5 }}>
              <Avatar sx={{ width: 80, height: 80, bgcolor: '#FDE8D2', color: '#8D5D46', fontSize: '1.8rem', fontWeight: 700, mx: 'auto', mb: 2 }}>{initials}</Avatar>
              <Typography variant="h5" fontWeight={700} sx={{ color: '#114B4B' }}>{user?.fullName || 'User'}</Typography>
              <Typography variant="body2" sx={{ color: '#5A7A7A', mt: 0.5 }}>{user?.email}</Typography>
              <Chip label={user?.role === 'caregiver' ? 'Caregiver' : 'Patient'} size="small"
                sx={{ mt: 1.5, bgcolor: '#E4F2F2', color: '#114B4B', fontWeight: 600, textTransform: 'capitalize' }} />
            </CardContent>
          </Card>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ bgcolor: '#E4F2F2', color: '#114B4B', width: 44, height: 44, mx: 'auto', mb: 1 }}><MedicationRoundedIcon /></Avatar>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>{mc}</Typography>
                  <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Medicines</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={6}>
              <Card>
                <CardContent sx={{ textAlign: 'center', py: 3 }}>
                  <Avatar sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', width: 44, height: 44, mx: 'auto', mb: 1 }}><EventNoteRoundedIcon /></Avatar>
                  <Typography variant="h4" fontWeight={700} sx={{ color: '#8D5D46' }}>{ac}</Typography>
                  <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Appointments</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B', mb: 2 }}>Account Details</Typography>
              <List disablePadding>
                {[['Full Name', user?.fullName], ['Email', user?.email], ['Role', user?.role]].map(([k, v]) => (
                  <Box key={k}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemText primary={k} secondary={v || '-'}
                        primaryTypographyProps={{ variant: 'body2', color: '#5A7A7A' }}
                        secondaryTypographyProps={{ variant: 'body1', color: '#114B4B', fontWeight: 500, textTransform: k === 'Role' ? 'capitalize' : 'none' }} />
                    </ListItem>
                    <Divider />
                  </Box>
                ))}
                <ListItem sx={{ px: 0 }}>
                  <ListItemText primary="Status" primaryTypographyProps={{ variant: 'body2', color: '#5A7A7A' }} />
                  <Chip icon={<CheckCircleRoundedIcon sx={{ fontSize: 16 }} />} label="Active" size="small" sx={{ bgcolor: '#E8F8EF', color: '#27AE60', fontWeight: 600 }} />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Button variant="contained" color="error" fullWidth size="large" startIcon={<LogoutRoundedIcon />}
            onClick={() => { logout(); navigate('/') }} sx={{ py: 1.5 }}>Logout</Button>
        </Box>
      </Box>
    </Box>
  )
}

export default Profile

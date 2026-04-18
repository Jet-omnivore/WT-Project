// Sidebar.jsx — Dark teal sidebar with logout confirmation
import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'
import Paper from '@mui/material/Paper'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import MedicalServicesRoundedIcon from '@mui/icons-material/MedicalServicesRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import AddRoundedIcon from '@mui/icons-material/AddRounded'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import { logout, getUser } from '../api.js'

const DRAWER_WIDTH = 260

const mainNavItems = [
  { path: '/dashboard', icon: <DashboardRoundedIcon />, label: 'Dashboard' },
  { path: '/medicines', icon: <MedicalServicesRoundedIcon />, label: 'Medications' },
  { path: '/appointments', icon: <EventNoteRoundedIcon />, label: 'Appointments' },
  { path: '/calendar', icon: <CalendarMonthRoundedIcon />, label: 'Calendar' },
  { path: '/profile', icon: <PersonRoundedIcon />, label: 'Profile' },
]

const bottomNavItems = [
  { path: '/dashboard', icon: <DashboardRoundedIcon />, label: 'Home' },
  { path: '/medicines', icon: <MedicalServicesRoundedIcon />, label: 'Meds' },
  { path: '/appointments', icon: <EventNoteRoundedIcon />, label: 'Appts' },
  { path: '/profile', icon: <PersonRoundedIcon />, label: 'Profile' },
]

function Sidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const user = getUser()
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const handleLogoutClick = () => setLogoutConfirmOpen(true)

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false)
    logout()
    window.location.href = '/'
  }

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const currentBottomNav = bottomNavItems.findIndex(item => item.path === location.pathname)

  return (
    <>
      {/* Desktop Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            bgcolor: '#114B4B',
            color: '#fff',
            borderRight: 'none',
            borderRadius: '0 16px 16px 0',
            py: 2,
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ px: 3, py: 2 }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1.5, textDecoration: 'none', color: '#fff' }}>
            <Box sx={{ width: 40, height: 40, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 22, color: '#fff' }} />
            </Box>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2, color: '#fff' }}>MediRemind</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Serene Guardian</Typography>
            </Box>
          </Box>
        </Box>

        {/* User section */}
        <Box sx={{ px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
            <Avatar sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', width: 38, height: 38, fontSize: '0.85rem', fontWeight: 700 }}>{initials}</Avatar>
            <Box>
              <Typography variant="body2" fontWeight={600} sx={{ color: '#fff', lineHeight: 1.3 }}>{user?.fullName || 'User'}</Typography>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{user?.role === 'caregiver' ? 'Caregiver' : 'Premium Member'}</Typography>
            </Box>
          </Box>
        </Box>

        {/* Nav */}
        <List sx={{ px: 2, flexGrow: 1, mt: 1 }}>
          {mainNavItems.map((item) => {
            const isActive = location.pathname === item.path
            return (
              <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton component={Link} to={item.path}
                  sx={{
                    borderRadius: 2, py: 1.2, px: 2,
                    bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                    '&:hover': { bgcolor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.08)' },
                    '& .MuiListItemIcon-root': { color: isActive ? '#fff' : 'rgba(255,255,255,0.6)', minWidth: 40 },
                  }}>
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.label} primaryTypographyProps={{ fontSize: '0.88rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#fff' : 'rgba(255,255,255,0.7)' }} />
                </ListItemButton>
              </ListItem>
            )
          })}
        </List>

        {/* Add Medication */}
        <Box sx={{ px: 2.5, pb: 1 }}>
          <Button component={Link} to="/medicines" fullWidth variant="contained" startIcon={<AddRoundedIcon />}
            sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: 2, py: 1.3, boxShadow: 'none', '&:hover': { bgcolor: 'rgba(255,255,255,0.25)', boxShadow: 'none' } }}>
            Add Medication
          </Button>
        </Box>

        {/* Logout */}
        <Box sx={{ px: 2, pb: 1 }}>
          <ListItemButton onClick={handleLogoutClick} sx={{ borderRadius: 2, py: 1.2, px: 2, '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
            <ListItemIcon sx={{ color: 'rgba(255,255,255,0.5)', minWidth: 40 }}><LogoutRoundedIcon /></ListItemIcon>
            <ListItemText primary="Logout" primaryTypographyProps={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.6)' }} />
          </ListItemButton>
        </Box>
      </Drawer>

      {/* Mobile Bottom Nav */}
      <Paper sx={{ display: { xs: 'block', md: 'none' }, position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1200, borderRadius: '12px 12px 0 0' }} elevation={8}>
        <BottomNavigation value={currentBottomNav >= 0 ? currentBottomNav : false} onChange={(_, v) => navigate(bottomNavItems[v].path)} showLabels
          sx={{ height: 64, borderRadius: '12px 12px 0 0', '& .MuiBottomNavigationAction-root': { minWidth: 'auto', '&.Mui-selected': { color: '#114B4B' } } }}>
          {bottomNavItems.map((item) => (<BottomNavigationAction key={item.label} label={item.label} icon={item.icon} />))}
        </BottomNavigation>
      </Paper>

      {/* Logout Confirmation Dialog */}
      <Dialog
        open={logoutConfirmOpen}
        onClose={() => setLogoutConfirmOpen(false)}
        PaperProps={{ sx: { borderRadius: 3, px: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 600, color: '#114B4B' }}>Confirm Logout</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ color: '#5A7A7A' }}>
            Are you sure you want to log out of your account?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutConfirmOpen(false)} sx={{ color: '#5A7A7A' }}>Cancel</Button>
          <Button variant="contained" onClick={handleLogoutConfirm}
            sx={{ bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' } }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export { DRAWER_WIDTH }
export default Sidebar

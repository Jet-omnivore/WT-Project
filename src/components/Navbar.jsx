// Navbar.jsx — Auth-aware navbar: shows profile avatar when logged in
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import Divider from '@mui/material/Divider'
import Avatar from '@mui/material/Avatar'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { isLoggedIn, getUser, logout } from '../api.js'

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Medications', to: '/medicines' },
  { label: 'Appointments', to: '/appointments' },
]

function Navbar() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)

  const loggedIn = isLoggedIn()
  const user = loggedIn ? getUser() : null

  const initials = user?.fullName
    ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U'

  const handleProfileMenuOpen = (event) => setAnchorEl(event.currentTarget)
  const handleProfileMenuClose = () => setAnchorEl(null)

  const handleLogout = () => {
    handleProfileMenuClose()
    setMobileOpen(false)
    logout()
    navigate('/')
  }

  const handleMenuNavigate = (path) => {
    handleProfileMenuClose()
    navigate(path)
  }

  return (
    <>
      <AppBar position="sticky" sx={{ bgcolor: 'transparent', backdropFilter: 'blur(12px)', color: '#114B4B', boxShadow: 'none' }} elevation={0}>
        <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto', px: { xs: 2, md: 4 } }}>
          <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', color: '#114B4B', flexGrow: { xs: 1, md: 0 }, mr: { md: 6 } }}>
            <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: '#114B4B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: 20, color: '#fff' }} />
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>MediRemind</Typography>
          </Box>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexGrow: 1 }}>
            {navLinks.map((link) => (
              <Button key={link.label} component={Link} to={link.to} sx={{ color: '#5A7A7A', fontWeight: 500, '&:hover': { bgcolor: 'rgba(17,75,75,0.06)', color: '#114B4B' } }}>{link.label}</Button>
            ))}
          </Box>

          {/* Desktop right side: auth-aware */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5, alignItems: 'center' }}>
            {loggedIn ? (
              <>
                <Button component={Link} to="/dashboard" variant="outlined" size="small"
                  sx={{ borderColor: 'rgba(17,75,75,0.2)', color: '#114B4B', fontWeight: 500, '&:hover': { borderColor: '#114B4B', bgcolor: 'rgba(17,75,75,0.04)' } }}>
                  Dashboard
                </Button>
                <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0.5 }}>
                  <Avatar sx={{ bgcolor: '#114B4B', color: '#fff', width: 36, height: 36, fontSize: '0.85rem', fontWeight: 700 }}>
                    {initials}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleProfileMenuClose}
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  slotProps={{
                    paper: {
                      sx: { mt: 1.5, minWidth: 200, borderRadius: 2, boxShadow: '0 8px 32px rgba(17,75,75,0.12)' }
                    }
                  }}
                >
                  <Box sx={{ px: 2, py: 1.5 }}>
                    <Typography variant="subtitle2" fontWeight={600} sx={{ color: '#114B4B' }}>{user?.fullName || 'User'}</Typography>
                    <Typography variant="caption" sx={{ color: '#5A7A7A' }}>{user?.email || ''}</Typography>
                  </Box>
                  <Divider />
                  <MenuItem onClick={() => handleMenuNavigate('/dashboard')}>
                    <ListItemIcon><DashboardRoundedIcon sx={{ color: '#114B4B', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Dashboard</ListItemText>
                  </MenuItem>
                  <MenuItem onClick={() => handleMenuNavigate('/profile')}>
                    <ListItemIcon><PersonRoundedIcon sx={{ color: '#114B4B', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.875rem' }}>Profile</ListItemText>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon><LogoutRoundedIcon sx={{ color: '#e74c3c', fontSize: 20 }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', color: '#e74c3c' }}>Logout</ListItemText>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: '#114B4B', color: '#114B4B', '&:hover': { borderColor: '#0C3636', bgcolor: 'rgba(17,75,75,0.04)' } }}>Login</Button>
                <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Get Started</Button>
              </>
            )}
          </Box>

          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)} color="inherit"><MenuIcon /></IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280, pt: 2, bgcolor: '#114B4B', color: '#fff' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>MediRemind</Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />

        {/* Show user info in mobile drawer if logged in */}
        {loggedIn && user && (
          <Box sx={{ px: 2, py: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, p: 1.5, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.08)' }}>
              <Avatar sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', width: 38, height: 38, fontSize: '0.85rem', fontWeight: 700 }}>{initials}</Avatar>
              <Box>
                <Typography variant="body2" fontWeight={600} sx={{ color: '#fff', lineHeight: 1.3 }}>{user.fullName || 'User'}</Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{user.email || ''}</Typography>
              </Box>
            </Box>
          </Box>
        )}

        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton component={Link} to={link.to} onClick={() => setMobileOpen(false)} sx={{ '&:hover': { bgcolor: 'rgba(255,255,255,0.08)' } }}>
                <ListItemText primary={link.label} primaryTypographyProps={{ color: 'rgba(255,255,255,0.8)' }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>

        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          {loggedIn ? (
            <>
              <Button component={Link} to="/dashboard" variant="contained" fullWidth onClick={() => setMobileOpen(false)}
                sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', '&:hover': { bgcolor: '#fce0c4' } }}>Dashboard</Button>
              <Button component={Link} to="/profile" variant="outlined" fullWidth onClick={() => setMobileOpen(false)}
                sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Profile</Button>
              <Button variant="outlined" fullWidth onClick={handleLogout}
                sx={{ borderColor: 'rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', '&:hover': { borderColor: 'rgba(255,255,255,0.4)', bgcolor: 'rgba(255,255,255,0.05)' } }}>Logout</Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Login</Button>
              <Button component={Link} to="/register" variant="contained" fullWidth onClick={() => setMobileOpen(false)} sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', '&:hover': { bgcolor: '#fce0c4' } }}>Get Started</Button>
            </>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar

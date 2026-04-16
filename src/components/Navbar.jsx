// Navbar.jsx — Transparent navbar, fixed borderRadius
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
import Divider from '@mui/material/Divider'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'

const navLinks = [
  { label: 'Dashboard', to: '/dashboard' },
  { label: 'Medications', to: '/medicines' },
  { label: 'Appointments', to: '/appointments' },
]

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

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

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1.5 }}>
            <Button component={Link} to="/login" variant="outlined" sx={{ borderColor: '#114B4B', color: '#114B4B', '&:hover': { borderColor: '#0C3636', bgcolor: 'rgba(17,75,75,0.04)' } }}>Login</Button>
            <Button component={Link} to="/register" variant="contained" sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>Get Started</Button>
          </Box>

          <IconButton sx={{ display: { md: 'none' } }} onClick={() => setMobileOpen(true)} color="inherit"><MenuIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={() => setMobileOpen(false)} PaperProps={{ sx: { width: 280, pt: 2, bgcolor: '#114B4B', color: '#fff' } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>MediRemind</Typography>
          <IconButton onClick={() => setMobileOpen(false)} sx={{ color: '#fff' }}><CloseIcon /></IconButton>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
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
          <Button component={Link} to="/login" variant="outlined" fullWidth onClick={() => setMobileOpen(false)} sx={{ borderColor: 'rgba(255,255,255,0.3)', color: '#fff' }}>Login</Button>
          <Button component={Link} to="/register" variant="contained" fullWidth onClick={() => setMobileOpen(false)} sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', '&:hover': { bgcolor: '#fce0c4' } }}>Get Started</Button>
        </Box>
      </Drawer>
    </>
  )
}

export default Navbar

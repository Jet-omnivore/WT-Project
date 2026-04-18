// Profile.jsx — Profile page with edit functionality and logout confirmation
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar, { DRAWER_WIDTH } from '../components/Sidebar.jsx'
import { getUser, isLoggedIn, logout, medicineAPI, appointmentAPI, authAPI } from '../api.js'
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
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Snackbar from '@mui/material/Snackbar'
import Alert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded'
import EditRoundedIcon from '@mui/icons-material/EditRounded'
import SaveRoundedIcon from '@mui/icons-material/SaveRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import NotificationCenter from '../components/NotificationCenter.jsx'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(getUser())
  const [mc, setMc] = useState(0)
  const [ac, setAc] = useState(0)

  // Edit mode state
  const [editing, setEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [editRole, setEditRole] = useState('')
  const [saving, setSaving] = useState(false)

  // Snackbar state
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' })
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  useEffect(() => {
    if (!isLoggedIn()) { navigate('/login'); return }
    Promise.all([medicineAPI.getAll(), appointmentAPI.getAll()]).then(([m, a]) => { setMc(m.length); setAc(a.length) }).catch(console.error)
  }, [])

  const initials = user?.fullName ? user.fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) : 'U'

  const handleEditStart = () => {
    setEditName(user?.fullName || '')
    setEditRole(user?.role || 'patient')
    setEditing(true)
  }

  const handleEditCancel = () => {
    setEditing(false)
  }

  const handleEditSave = async () => {
    if (!editName.trim()) {
      setSnackbar({ open: true, message: 'Full name cannot be empty', severity: 'error' })
      return
    }
    setSaving(true)
    try {
      const result = await authAPI.updateProfile({ fullName: editName.trim(), role: editRole })
      setUser(result.user)
      setEditing(false)
      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' })
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Failed to update profile', severity: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, ml: { md: `${DRAWER_WIDTH}px` }, p: { xs: 2, md: 4 }, pb: { xs: 10, md: 4 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B' }}>My Profile</Typography>
          <NotificationCenter />
        </Box>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B' }}>Account Details</Typography>
                {!editing && (
                  <Button startIcon={<EditRoundedIcon />} size="small" onClick={handleEditStart}
                    sx={{ color: '#114B4B', fontWeight: 600, '&:hover': { bgcolor: 'rgba(17,75,75,0.06)' } }}>
                    Edit Profile
                  </Button>
                )}
              </Box>

              {editing ? (
                /* ——— Edit Mode ——— */
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                  <TextField
                    label="Full Name"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': { borderColor: '#114B4B' },
                      },
                      '& .MuiInputLabel-root.Mui-focused': { color: '#114B4B' },
                    }}
                  />
                  <TextField
                    label="Email"
                    value={user?.email || ''}
                    fullWidth
                    variant="outlined"
                    size="small"
                    disabled
                    helperText="Email cannot be changed"
                  />
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ '&.Mui-focused': { color: '#114B4B' } }}>Role</InputLabel>
                    <Select
                      value={editRole}
                      label="Role"
                      onChange={(e) => setEditRole(e.target.value)}
                      sx={{
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#114B4B' },
                      }}
                    >
                      <MenuItem value="patient">Patient</MenuItem>
                      <MenuItem value="caregiver">Caregiver</MenuItem>
                    </Select>
                  </FormControl>
                  <Box sx={{ display: 'flex', gap: 1.5, mt: 1 }}>
                    <Button
                      variant="contained"
                      startIcon={<SaveRoundedIcon />}
                      onClick={handleEditSave}
                      disabled={saving}
                      sx={{ bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' }, flex: 1 }}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<CloseRoundedIcon />}
                      onClick={handleEditCancel}
                      disabled={saving}
                      sx={{ borderColor: '#114B4B', color: '#114B4B', '&:hover': { borderColor: '#0C3636', bgcolor: 'rgba(17,75,75,0.04)' } }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (
                /* ——— Display Mode ——— */
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
              )}
            </CardContent>
          </Card>

          <Button variant="contained" color="error" fullWidth size="large" startIcon={<LogoutRoundedIcon />}
            onClick={() => setLogoutConfirmOpen(true)} sx={{ py: 1.5 }}>Logout</Button>
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

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
          <Button variant="contained" onClick={() => { logout(); window.location.href = '/' }}
            sx={{ bgcolor: '#e74c3c', '&:hover': { bgcolor: '#c0392b' } }}>Logout</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Profile

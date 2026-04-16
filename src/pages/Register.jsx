// Register.jsx — Fixed borderRadius
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import CircularProgress from '@mui/material/CircularProgress'
import InputAdornment from '@mui/material/InputAdornment'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import LocalHospitalRoundedIcon from '@mui/icons-material/LocalHospitalRounded'
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded'
import { authAPI, saveAuth } from '../api.js'

function Register() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (!fullName.trim()) e.fullName = 'Required'
    if (!email.includes('@')) e.email = 'Invalid email'
    if (password.length < 6) e.password = 'Min 6 chars'
    if (password !== confirmPassword) e.confirmPassword = 'Mismatch'
    if (!role) e.role = 'Select a role'
    if (!termsAccepted) e.terms = 'Accept terms'
    setErrors(e); return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); if (!validate()) return
    setLoading(true); setServerError('')
    try {
      const data = await authAPI.register({ fullName, email, password, role })
      saveAuth(data.token, data.user); navigate('/dashboard')
    } catch (e) { setServerError(e.message) } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Navbar />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: { xs: 4, md: 8 } }}>
        <Card sx={{ width: '100%', maxWidth: 500, boxShadow: '0 8px 40px rgba(17,75,75,0.08)', border: 'none' }}>
          <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 1 }}>Create Account</Typography>
              <Typography variant="body2" sx={{ color: '#5A7A7A' }}>Join your serene health guardian</Typography>
            </Box>
            {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} error={!!errors.fullName} helperText={errors.fullName} sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />
              <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!errors.email} helperText={errors.email} sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />
              <TextField fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={!!errors.password} helperText={errors.password} sx={{ mb: 2 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />
              <TextField fullWidth label="Confirm Password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={!!errors.confirmPassword} helperText={errors.confirmPassword} sx={{ mb: 3 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />

              <Typography variant="subtitle2" sx={{ mb: 1.5, fontWeight: 600, color: '#114B4B' }}>I am a...</Typography>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                {[
                  { val: 'patient', icon: <LocalHospitalRoundedIcon />, label: 'Patient' },
                  { val: 'caregiver', icon: <VolunteerActivismRoundedIcon />, label: 'Caregiver' },
                ].map(r => (
                  <Card key={r.val} onClick={() => setRole(r.val)}
                    sx={{
                      cursor: 'pointer', textAlign: 'center', py: 2.5,
                      border: 2, borderColor: role === r.val ? '#114B4B' : 'rgba(17,75,75,0.1)',
                      bgcolor: role === r.val ? 'rgba(17,75,75,0.04)' : 'transparent',
                      boxShadow: 'none', '&:hover': { borderColor: '#114B4B', transform: 'none', boxShadow: 'none' },
                    }}>
                    <CardContent sx={{ p: '0 !important' }}>
                      <Box sx={{ color: role === r.val ? '#114B4B' : '#5A7A7A', mb: 0.5 }}>{r.icon}</Box>
                      <Typography variant="body2" fontWeight={600} sx={{ color: role === r.val ? '#114B4B' : '#5A7A7A' }}>{r.label}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
              {errors.role && <Typography variant="caption" color="error" sx={{ mb: 1, display: 'block' }}>{errors.role}</Typography>}

              <FormControlLabel
                control={<Checkbox checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} size="small" sx={{ color: '#114B4B', '&.Mui-checked': { color: '#114B4B' } }} />}
                label={<Typography variant="body2" sx={{ color: '#5A7A7A' }}>I agree to the <Typography component="span" variant="body2" sx={{ color: '#114B4B', fontWeight: 600 }}>Terms</Typography> and <Typography component="span" variant="body2" sx={{ color: '#114B4B', fontWeight: 600 }}>Privacy Policy</Typography></Typography>}
                sx={{ mb: 1 }}
              />
              {errors.terms && <Typography variant="caption" color="error" sx={{ mb: 2, display: 'block' }}>{errors.terms}</Typography>}

              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                sx={{ py: 1.5, mt: 1, mb: 3, bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#5A7A7A' }} textAlign="center">
              Already have an account?{' '}
              <Typography component={Link} to="/login" variant="body2" sx={{ color: '#114B4B', fontWeight: 600, textDecoration: 'none' }}>Login</Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Register

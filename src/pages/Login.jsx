// Login.jsx — Fixed borderRadius
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
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import CircularProgress from '@mui/material/CircularProgress'
import EmailRoundedIcon from '@mui/icons-material/EmailRounded'
import LockRoundedIcon from '@mui/icons-material/LockRounded'
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded'
import VisibilityOffRoundedIcon from '@mui/icons-material/VisibilityOffRounded'
import { authAPI, saveAuth } from '../api.js'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [serverError, setServerError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    let valid = true
    if (!email.includes('@')) { setEmailError('Invalid email'); valid = false } else setEmailError('')
    if (password.length < 6) { setPasswordError('Min 6 characters'); valid = false } else setPasswordError('')
    if (!valid) return
    setLoading(true); setServerError('')
    try {
      const data = await authAPI.login({ email, password })
      saveAuth(data.token, data.user); navigate('/dashboard')
    } catch (e) { setServerError(e.message) } finally { setLoading(false) }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Navbar />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', px: 2, py: { xs: 6, md: 10 } }}>
        <Card sx={{ width: '100%', maxWidth: 440, boxShadow: '0 8px 40px rgba(17,75,75,0.08)', border: 'none' }}>
          <CardContent sx={{ p: { xs: 3, md: 4.5 } }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 1 }}>Welcome Back</Typography>
              <Typography variant="body2" sx={{ color: '#5A7A7A' }}>Login to your MediRemind account</Typography>
            </Box>
            {serverError && <Alert severity="error" sx={{ mb: 3 }}>{serverError}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField fullWidth label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={!!emailError} helperText={emailError} sx={{ mb: 2.5 }}
                InputProps={{ startAdornment: <InputAdornment position="start"><EmailRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment> }} />
              <TextField fullWidth label="Password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} error={!!passwordError} helperText={passwordError} sx={{ mb: 3.5 }}
                InputProps={{
                  startAdornment: <InputAdornment position="start"><LockRoundedIcon sx={{ color: '#5A7A7A', fontSize: 20 }} /></InputAdornment>,
                  endAdornment: <InputAdornment position="end"><IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">{showPassword ? <VisibilityOffRoundedIcon fontSize="small" /> : <VisibilityRoundedIcon fontSize="small" />}</IconButton></InputAdornment>,
                }} />
              <Button type="submit" variant="contained" fullWidth size="large" disabled={loading}
                sx={{ py: 1.5, mb: 3, bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
              </Button>
            </Box>
            <Typography variant="body2" sx={{ color: '#5A7A7A' }} textAlign="center">
              Don't have an account?{' '}
              <Typography component={Link} to="/register" variant="body2" sx={{ color: '#114B4B', fontWeight: 600, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>Sign Up</Typography>
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  )
}

export default Login

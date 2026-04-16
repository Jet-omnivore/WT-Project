// Footer.jsx — Dark teal footer, fixed borderRadius
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#0C2E2E', color: '#fff', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Box sx={{ width: 36, height: 36, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <LocalHospitalIcon sx={{ color: '#FDE8D2', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" fontWeight={700}>MediRemind</Typography>
            </Box>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.8, maxWidth: 300 }}>The Serene Guardian for your health routine. Precision medical tracking with a wellness-first philosophy.</Typography>
            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', display: 'block', mt: 2 }}>Available on iOS, Android, and Web. HIPAA Compliant.</Typography>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.8)' }}>Product</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {['Features', 'Medicine Tracker', 'Appointment Sync', 'Pricing'].map((item) => (
                <Typography key={item} component={Link} to="/" variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', '&:hover': { color: '#FDE8D2' } }}>{item}</Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.8)' }}>Company</Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2 }}>
              {[{ l: 'About Us', to: '/about' }, { l: 'Contact', to: '/' }, { l: 'Careers', to: '/' }, { l: 'Press', to: '/' }].map((item) => (
                <Typography key={item.l} component={Link} to={item.to} variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', '&:hover': { color: '#FDE8D2' } }}>{item.l}</Typography>
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: 'rgba(255,255,255,0.8)' }}>Newsletter</Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.4)', mb: 2 }}>Subscribe for wellness tips and product updates.</Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <TextField placeholder="your@email.com" size="small" fullWidth
                sx={{ '& .MuiOutlinedInput-root': { bgcolor: 'rgba(255,255,255,0.06)', color: '#fff', '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' }, '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' } }, '& .MuiOutlinedInput-input::placeholder': { color: 'rgba(255,255,255,0.3)' } }} />
              <Button variant="contained" sx={{ minWidth: 'auto', px: 2, bgcolor: '#FDE8D2', color: '#8D5D46', '&:hover': { bgcolor: '#fce0c4' } }}><ArrowForwardIcon /></Button>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', my: 4 }} />
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)' }}>© 2025 MediRemind. All rights reserved.</Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {['Privacy Policy', 'Terms of Service', 'Cookies Settings'].map((item) => (
              <Typography key={item} component="a" href="#" variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', '&:hover': { color: 'rgba(255,255,255,0.6)' } }}>{item}</Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default Footer

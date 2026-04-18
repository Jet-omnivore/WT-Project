// Home.jsx — Landing page with bento grid, fixed borderRadius
import { Link } from 'react-router-dom'
import { isLoggedIn } from '../api.js'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Chip from '@mui/material/Chip'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import InsightsRoundedIcon from '@mui/icons-material/InsightsRounded'
import SecurityRoundedIcon from '@mui/icons-material/SecurityRounded'

function Home() {
  const loggedIn = isLoggedIn()

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Navbar />

      {/* Hero */}
      <Box sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 8, md: 14 } }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="animate-fade-in-up">
                <Chip label="✦ The Serene Guardian" size="small" sx={{ bgcolor: '#114B4B', color: '#fff', fontWeight: 600, mb: 3, fontSize: '0.75rem', py: 0.5 }} />
                <Typography variant="h2" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, fontWeight: 700, lineHeight: 1.1, color: '#114B4B', mb: 3 }}>
                  MediRemind is your serene guardian.
                </Typography>
                <Typography variant="body1" sx={{ color: '#5A7A7A', fontSize: '1.1rem', lineHeight: 1.8, mb: 4, maxWidth: 460 }}>
                  A calm, intelligent system designed to orchestrate your health journey with editorial precision and spa-like tranquility.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button component={Link} to={loggedIn ? '/dashboard' : '/register'} variant="contained" size="large" endIcon={<ArrowForwardIcon />}
                    sx={{ px: 4, py: 1.5, bgcolor: '#114B4B', '&:hover': { bgcolor: '#0C3636' } }}>{loggedIn ? 'Go to Dashboard' : 'Start Free'}</Button>
                  <Button component={Link} to="/about" variant="outlined" size="large"
                    sx={{ px: 4, py: 1.5, borderColor: '#114B4B', color: '#114B4B', '&:hover': { borderColor: '#0C3636', bgcolor: 'rgba(17,75,75,0.04)' } }}>Learn More</Button>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="animate-fade-in-up-delay" sx={{ display: 'flex', justifyContent: 'center' }}>
                <Card sx={{ width: 300, p: 3, bgcolor: '#114B4B', color: '#fff', position: 'relative', overflow: 'visible', border: 'none' }}>
                  <CardContent sx={{ p: 0 }}>
                    <Typography sx={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', mb: 1 }}>Daily Routine</Typography>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Morning medications taken at 8:00 AM</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Chip label="✓ Taken" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.75rem' }} />
                      <Chip label="3/3 Done" size="small" sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', fontSize: '0.75rem' }} />
                    </Box>
                  </CardContent>
                  <Card sx={{ position: 'absolute', bottom: -24, right: -16, bgcolor: '#FDE8D2', color: '#8D5D46', px: 2.5, py: 1.5, boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: 'none' }}>
                    <Typography variant="body2" fontWeight={600} sx={{ fontSize: '0.8rem' }}>💊 Next dose in 4h</Typography>
                  </Card>
                </Card>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Bento Grid Features */}
      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.6rem' }, fontWeight: 700, color: '#114B4B', mb: 2 }}>Designed for clarity and calm</Typography>
            <Typography variant="body1" sx={{ color: '#5A7A7A', maxWidth: 520, mx: 'auto', fontSize: '1.05rem' }}>Four pillars of serene health management.</Typography>
          </Box>
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1.5fr' }, gridTemplateRows: { md: 'auto auto' }, gap: 2.5 }}>
            {/* Medicine Tracking — dark teal */}
            <Card sx={{ bgcolor: '#114B4B', color: '#fff', p: 0, border: 'none' }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <MedicationRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, color: '#fff' }}>Medicine Tracking</Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>Smart reminders that adapt to your schedule. Intelligent dosage tracking with visual pill identification.</Typography>
              </CardContent>
            </Card>
            {/* Appointments — mint bg */}
            <Card sx={{ bgcolor: '#E4F2F2', border: '1px solid rgba(17,75,75,0.08)', p: 0 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#114B4B', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <EventNoteRoundedIcon sx={{ fontSize: 24, color: '#fff' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, color: '#114B4B' }}>Appointments</Typography>
                <Typography variant="body2" sx={{ color: '#5A7A7A', lineHeight: 1.7 }}>Sync with your doctor's calendar and get pre-visit preparations automatically.</Typography>
                <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day, i) => (
                    <Box key={day} sx={{ width: 48, textAlign: 'center', py: 1, borderRadius: 2, bgcolor: i === 2 ? '#114B4B' : 'rgba(17,75,75,0.05)', color: i === 2 ? '#fff' : '#5A7A7A' }}>
                      <Typography sx={{ fontSize: '0.6rem', mb: 0.3 }}>{day}</Typography>
                      <Typography fontWeight={600} sx={{ fontSize: '0.85rem' }}>{10 + i}</Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
            {/* Health Insights — peach */}
            <Card sx={{ bgcolor: '#FDE8D2', border: 'none', p: 0 }}>
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: '#8D5D46', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                  <InsightsRoundedIcon sx={{ fontSize: 24, color: '#FDE8D2' }} />
                </Box>
                <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, color: '#8D5D46' }}>Health Insights</Typography>
                <Typography variant="body2" sx={{ color: '#8D5D46', opacity: 0.75, lineHeight: 1.7 }}>Visualize your progress with calming health rings and editorial-grade data reports.</Typography>
              </CardContent>
            </Card>
            {/* Secure & Private */}
            <Card sx={{ bgcolor: '#F0F8F8', border: '1px solid rgba(17,75,75,0.08)', p: 0 }}>
              <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <Box>
                  <Box sx={{ width: 48, height: 48, borderRadius: '50%', bgcolor: 'rgba(17,75,75,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
                    <SecurityRoundedIcon sx={{ fontSize: 24, color: '#114B4B' }} />
                  </Box>
                  <Typography variant="h5" fontWeight={700} sx={{ mb: 1.5, color: '#114B4B' }}>Secure & Private</Typography>
                  <Typography variant="body2" sx={{ color: '#5A7A7A', lineHeight: 1.7 }}>Your health data is encrypted and never shared. HIPAA compliant across all platforms.</Typography>
                </Box>
                <Button endIcon={<ArrowForwardIcon />} sx={{ mt: 3, color: '#114B4B', fontWeight: 600, alignSelf: 'flex-start' }}>Learn about our security</Button>
              </CardContent>
            </Card>
          </Box>
        </Container>
      </Box>

      {/* Rings of Health */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#E4F2F2' }}>
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.4rem' }, fontWeight: 700, mb: 3, color: '#114B4B' }}>Rings of Health</Typography>
              <Typography variant="body1" sx={{ color: '#5A7A7A', lineHeight: 1.8, mb: 4, fontSize: '1.05rem' }}>
                We replace stressful spreadsheets with concentric "Rings of Health." Easily monitor your adherence, hydration, and activity levels in a single, calming view.
              </Typography>
              <Card sx={{ bgcolor: '#FDE8D2', border: 'none', boxShadow: 'none' }}>
                <CardContent sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Box sx={{ width: 4, minHeight: 48, bgcolor: '#8D5D46', borderRadius: 1, mt: 0.5 }} />
                  <Typography variant="body2" sx={{ color: '#8D5D46', lineHeight: 1.7, fontStyle: 'italic' }}>"Your vitals are steady today. Remember to drink extra water before your morning dose."</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Box sx={{ position: 'relative', width: 280, height: 280 }}>
                  <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx="140" cy="140" r="120" fill="none" stroke="rgba(17,75,75,0.08)" strokeWidth="16" />
                    <circle cx="140" cy="140" r="120" fill="none" stroke="#114B4B" strokeWidth="16" strokeDasharray={`${2*Math.PI*120*0.82} ${2*Math.PI*120}`} strokeLinecap="round" transform="rotate(-90 140 140)" />
                  </svg>
                  <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx="140" cy="140" r="96" fill="none" stroke="rgba(17,75,75,0.06)" strokeWidth="14" />
                    <circle cx="140" cy="140" r="96" fill="none" stroke="#FDE8D2" strokeWidth="14" strokeDasharray={`${2*Math.PI*96*0.68} ${2*Math.PI*96}`} strokeLinecap="round" transform="rotate(-90 140 140)" />
                  </svg>
                  <svg width="280" height="280" style={{ position: 'absolute', top: 0, left: 0 }}>
                    <circle cx="140" cy="140" r="74" fill="none" stroke="rgba(17,75,75,0.04)" strokeWidth="12" />
                    <circle cx="140" cy="140" r="74" fill="none" stroke="#8D5D46" strokeWidth="12" strokeDasharray={`${2*Math.PI*74*0.55} ${2*Math.PI*74}`} strokeLinecap="round" transform="rotate(-90 140 140)" />
                  </svg>
                  <Box sx={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography variant="h3" fontWeight={700} sx={{ color: '#114B4B' }}>82%</Typography>
                    <Typography variant="caption" sx={{ color: '#5A7A7A' }}>Overall Health</Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA */}
      <Box sx={{ py: { xs: 8, md: 10 }, bgcolor: '#114B4B', textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, mb: 2, fontSize: { xs: '1.6rem', md: '2rem' } }}>Begin your serene health journey</Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.65)', mb: 4, lineHeight: 1.7 }}>Join thousands who trust MediRemind as their personal health guardian.</Typography>
          <Button component={Link} to={loggedIn ? '/dashboard' : '/register'} variant="contained" size="large" endIcon={<ArrowForwardIcon />}
            sx={{ bgcolor: '#FDE8D2', color: '#8D5D46', px: 5, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#fce0c4' }, boxShadow: 'none' }}>{loggedIn ? 'Go to Dashboard' : 'Get Started Free'}</Button>
        </Container>
      </Box>

      <Footer />
    </Box>
  )
}

export default Home

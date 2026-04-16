// About.jsx — Fixed borderRadius
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import Grid from '@mui/material/Grid'
import Chip from '@mui/material/Chip'

const team = [
  { name: 'Avinash', role: 'Backend Developer', initials: 'AV', color: '#114B4B' },
  { name: 'Nitish', role: 'Frontend & UI/UX', initials: 'NI', color: '#8D5D46' },
  { name: 'Animesh Singh Vijay', role: 'Frontend & UI/UX', initials: 'AS', color: '#27AE60' },
  { name: 'Amit Kumar Patel', role: 'Backend Database', initials: 'AK', color: '#1162d4' },
  { name: 'Rahul', role: 'Content Generator', initials: 'RA', color: '#E74C3C' },
]

function About() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#E4F2F2' }}>
      <Navbar />
      <Box sx={{ py: { xs: 8, md: 12 }, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Chip label="✦ About Us" size="small" sx={{ bgcolor: '#114B4B', color: '#fff', fontWeight: 600, mb: 3 }} />
          <Typography variant="h3" sx={{ fontWeight: 700, fontSize: { xs: '2rem', md: '2.8rem' }, color: '#114B4B', mb: 2 }}>About MediRemind</Typography>
          <Typography variant="body1" sx={{ color: '#5A7A7A', maxWidth: 560, mx: 'auto', fontSize: '1.1rem', lineHeight: 1.8 }}>
            MediRemind helps you track daily medicines and doctor appointments with timely reminders — all from one simple, serene dashboard.
          </Typography>
        </Container>
      </Box>
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#fff' }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" fontWeight={700} sx={{ color: '#114B4B', mb: 3 }}>Our Mission</Typography>
          <Typography variant="body1" sx={{ color: '#5A7A7A', maxWidth: 600, mx: 'auto', fontSize: '1.05rem', lineHeight: 1.8 }}>
            To make health management accessible and effortless — so no one has to rely on memory alone for life-saving medications.
          </Typography>
        </Container>
      </Box>
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: '#E4F2F2' }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ color: '#114B4B', mb: 2 }}>Meet Our Team</Typography>
          <Typography variant="body1" sx={{ color: '#5A7A7A' }} textAlign="center" mb={6}>The minds behind your serene health guardian.</Typography>
          <Grid container spacing={3} justifyContent="center">
            {team.map((m) => (
              <Grid item xs={12} sm={6} md={4} key={m.name}>
                <Card sx={{ textAlign: 'center', height: '100%', '&:hover': { transform: 'translateY(-4px)' } }}>
                  <CardContent sx={{ py: 4 }}>
                    <Avatar sx={{ width: 64, height: 64, bgcolor: m.color, fontSize: '1.3rem', fontWeight: 700, mx: 'auto', mb: 2 }}>{m.initials}</Avatar>
                    <Typography variant="h6" fontWeight={600} sx={{ color: '#114B4B', fontSize: '1.05rem' }}>{m.name}</Typography>
                    <Chip label={m.role} size="small" sx={{ bgcolor: '#E4F2F2', color: m.color, fontWeight: 500, mt: 1 }} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Footer />
    </Box>
  )
}

export default About

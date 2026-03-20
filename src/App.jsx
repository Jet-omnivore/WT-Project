import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Medicines from './pages/Medicines.jsx'
import Appointments from './pages/Appointments.jsx'
import Calendar from './pages/Calendar.jsx'
import Profile from './pages/Profile.jsx'
import About from './pages/About.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/about" element={<About />} />

      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/medicines" element={<Medicines />} />
      <Route path="/appointments" element={<Appointments />} />
      <Route path="/calendar" element={<Calendar />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  )
}

export default App

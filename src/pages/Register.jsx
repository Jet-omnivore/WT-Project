import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
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
    const newErrors = {}
    if (!fullName.trim()) newErrors.fullName = 'Full name is required'
    if (!email.includes('@')) newErrors.email = 'Email must contain @ symbol'
    if (password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match'
    if (!role) newErrors.role = 'Please select a role'
    if (!termsAccepted) newErrors.terms = 'You must accept the terms'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    setServerError('')

    try {
      const data = await authAPI.register({ fullName, email, password, role })
      saveAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (error) {
      setServerError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const borderStyle = (field, value) => {
    if (errors[field]) return 'border-danger'
    if (value) return 'border-success'
    return 'border-gray-200'
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-lg">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold text-darkblue">Create Your Account 🚀</h1>
            <p className="text-gray-500 mt-2">Join MediRemind to manage your health better</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-danger text-danger text-sm px-4 py-3 rounded-lg mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-darkblue mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition focus:border-primary ${borderStyle('fullName', fullName)}`}
              />
              {errors.fullName && <p className="text-danger text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-darkblue mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition focus:border-primary ${borderStyle('email', email.includes('@') ? email : '')}`}
              />
              {errors.email && <p className="text-danger text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-darkblue mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition focus:border-primary ${borderStyle('password', password.length >= 6 ? password : '')}`}
              />
              {errors.password && <p className="text-danger text-xs mt-1">{errors.password}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-darkblue mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition focus:border-primary ${borderStyle('confirmPassword', confirmPassword && password === confirmPassword ? confirmPassword : '')}`}
              />
              {errors.confirmPassword && <p className="text-danger text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-darkblue mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setRole('patient')}
                  className={`p-4 rounded-xl border-2 text-center transition
                    ${role === 'patient' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/50'}`}
                >
                  <div className="text-3xl mb-2">🏥</div>
                  <p className="font-semibold">Patient</p>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('caregiver')}
                  className={`p-4 rounded-xl border-2 text-center transition
                    ${role === 'caregiver' ? 'border-primary bg-primary/10 text-primary' : 'border-gray-200 text-gray-500 hover:border-primary/50'}`}
                >
                  <div className="text-3xl mb-2">👨‍⚕️</div>
                  <p className="font-semibold">Caregiver</p>
                </button>
              </div>
              {errors.role && <p className="text-danger text-xs mt-1">{errors.role}</p>}
            </div>

            <div className="mb-6 flex items-start gap-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 w-4 h-4 accent-primary"
              />
              <label className="text-sm text-gray-600">
                I agree to the <span className="text-primary cursor-pointer hover:underline">Terms & Conditions</span> and <span className="text-primary cursor-pointer hover:underline">Privacy Policy</span>
              </label>
            </div>
            {errors.terms && <p className="text-danger text-xs mb-4 -mt-4">{errors.terms}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register

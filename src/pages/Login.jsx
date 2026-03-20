import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
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
  const [emailTouched, setEmailTouched] = useState(false)
  const [passwordTouched, setPasswordTouched] = useState(false)

  const validateEmail = (value) => {
    setEmail(value)
    setEmailTouched(true)
    if (!value.includes('@')) {
      setEmailError('Email must contain @ symbol')
    } else {
      setEmailError('')
    }
  }

  const validatePassword = (value) => {
    setPassword(value)
    setPasswordTouched(true)
    if (value.length < 6) {
      setPasswordError('Password must be at least 6 characters')
    } else {
      setPasswordError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    validateEmail(email)
    validatePassword(password)

    if (!email.includes('@') || password.length < 6) return

    setLoading(true)
    setServerError('')

    try {
      const data = await authAPI.login({ email, password })
      saveAuth(data.token, data.user)
      navigate('/dashboard')
    } catch (error) {
      setServerError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="flex items-center justify-center px-4 py-16">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-heading font-bold text-darkblue">Welcome Back 👋</h1>
            <p className="text-gray-500 mt-2">Login to your MediRemind account</p>
          </div>

          {serverError && (
            <div className="bg-red-50 border border-danger text-danger text-sm px-4 py-3 rounded-lg mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-darkblue mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => validateEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition
                  ${emailError ? 'border-danger' : emailTouched && !emailError ? 'border-success' : 'border-gray-200'}
                  focus:border-primary`}
              />
              {emailError && <p className="text-danger text-xs mt-1">{emailError}</p>}
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-darkblue mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => validatePassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border-2 outline-none transition
                    ${passwordError ? 'border-danger' : passwordTouched && !passwordError ? 'border-success' : 'border-gray-200'}
                    focus:border-primary`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-darkblue"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {passwordError && <p className="text-danger text-xs mt-1">{passwordError}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login

import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="md:w-1/2 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-heading font-bold text-darkblue leading-tight">
              Never Miss a Dose. <br />
              <span className="text-primary">Never Miss an Appointment.</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600 leading-relaxed">
              MediRemind helps you track your medicines and doctor appointments
              — all in one simple dashboard.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Link
                to="/register"
                className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-secondary transition shadow-lg"
              >
                Start Free
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-3 border-2 border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-white transition"
              >
                See How It Works
              </a>
            </div>
          </div>

          <div className="md:w-1/2 flex justify-center">
            <div className="w-72 h-72 md:w-96 md:h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center">
              <div className="text-center">
                <span className="text-8xl md:text-9xl">💊</span>
                <div className="mt-4 flex justify-center space-x-4 text-4xl">
                  <span>📅</span>
                  <span>🔔</span>
                  <span>❤️</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center text-darkblue mb-4">
            Why Choose MediRemind?
          </h2>
          <p className="text-center text-gray-500 mb-12 max-w-xl mx-auto">
            Packed with features designed to make health management effortless.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100">
              <div className="text-5xl mb-4">💊</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Smart Medicine Reminders</h3>
              <p className="text-sm text-gray-600">Get timely reminders for each dose so you never forget your medicines again.</p>
            </div>
            <div className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100">
              <div className="text-5xl mb-4">📅</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Appointment Tracker</h3>
              <p className="text-sm text-gray-600">Keep track of all your doctor appointments in one place with easy reminders.</p>
            </div>
            <div className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100">
              <div className="text-5xl mb-4">👨‍👩‍👦</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Caregiver Access</h3>
              <p className="text-sm text-gray-600">Let family members monitor your medicine schedule and health progress remotely.</p>
            </div>
            <div className="bg-background rounded-xl p-6 text-center hover:shadow-lg transition border border-gray-100">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Health History Log</h3>
              <p className="text-sm text-gray-600">View your complete medicine intake and appointment history at a glance.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-heading font-bold text-center text-darkblue mb-12">
            How It Works
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Add Your Medicines & Schedule</h3>
              <p className="text-gray-600 text-sm">Enter your medicine details, dosage, and timings into MediRemind.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Get Reminded at the Right Time</h3>
              <p className="text-gray-600 text-sm">Receive timely notifications so you never miss a dose or appointment.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-heading font-semibold text-lg text-darkblue mb-2">Track Your Health History</h3>
              <p className="text-gray-600 text-sm">View your adherence data, appointment history, and streaks — all in one place.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default Home

import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

function About() {
  const team = [
    { name: 'Avinash', role: 'Backend Developer', initials: 'AV', color: 'bg-primary', bio: 'Develops the core server logic, APIs, and authentication flow.' },
    { name: 'Nitish', role: 'Frontend & UI/UX', initials: 'NI', color: 'bg-secondary', bio: 'Designs the user experience and builds the frontend components.' },
    { name: 'Animesh Singh Vijay', role: 'Frontend & UI/UX', initials: 'AS', color: 'bg-warning', bio: 'Designs the user experience and builds the frontend components.' },
    { name: 'Amit Kumar Patel', role: 'Backend Database', initials: 'AK', color: 'bg-success', bio: 'Architects the database schema and manages data storage.' },
    { name: 'Rahul', role: 'Content Generator', initials: 'RA', color: 'bg-danger', bio: 'Generates project content, text, and handles documentation.' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-heading font-bold text-darkblue mb-4">About MediRemind 💊</h1>
        <p className="text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto">
          MediRemind helps you track daily medicines and doctor appointments with timely reminders — all from one simple dashboard.
        </p>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-heading font-bold text-darkblue mb-4">🎯 Our Mission</h2>
          <p className="text-gray-600 text-lg leading-relaxed max-w-2xl mx-auto">
            To make health management accessible and effortless — so no one has to rely on memory alone for life-saving medications.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-heading font-bold text-center text-darkblue mb-12">👥 Meet Our Team</h2>
          <div className="flex flex-wrap justify-center gap-6 lg:gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-md text-center hover:shadow-lg transition w-full sm:w-72 lg:w-[30%] max-w-sm">
                <div className={`w-20 h-20 ${member.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-white text-xl font-bold">{member.initials}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg text-darkblue">{member.name}</h3>
                <p className="text-primary text-sm font-medium mt-1">{member.role}</p>
                <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default About

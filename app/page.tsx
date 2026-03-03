import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Sidebar from './components/Sidebar'

export default function Home() {
  return (
    <main>
      <Navbar />
      <Sidebar />
      <Hero />
      <About />
    </main>
  )
}
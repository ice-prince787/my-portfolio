import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Sidebar from './components/Sidebar'
import MobileBlock from './components/MobileBlock'

export default function Home() {
  return (
    <main>
      <MobileBlock />
      <Navbar />
      <Sidebar />
      <Hero />
      <About />
    </main>
  )
}
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Sidebar from './components/Sidebar'
import MobileBlock from './components/MobileBlock'
import Skills from './components/Skills'
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main>
      <MobileBlock />
      <Navbar />
      <Sidebar />
      <Hero />
      <About />
      <Skills />
      <Projects />
    </main>
  )
}
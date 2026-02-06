'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, UtensilsCrossed, ExternalLink } from 'lucide-react'
import { Button } from "@/components/ui/button"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('') // Estado para la sección activa

  useEffect(() => {
    const handleScroll = () => {
      // 1. Detectar si hubo scroll para el fondo del navbar
      setIsScrolled(window.scrollY > 10)

      // 2. Lógica para detectar qué sección está en pantalla (Scroll Spy)
      const sections = ['how-it-works', 'features', 'partners', 'contact']
      let current = ''

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          // Si el top de la sección está cerca del tercio superior de la pantalla
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section
          }
        }
      }
      setActiveSection(current)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setMobileMenuOpen(false)
    }
  }

  // Helper para clases de links
  const getLinkClass = (section: string) => {
    const base = "text-sm font-medium transition-colors "
    return activeSection === section 
      ? base + "text-orange-500 font-bold" // Activo: Naranja
      : base + "text-slate-600 hover:text-orange-500" // Inactivo
  }

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-orange-500 p-1.5 rounded-lg">
            <UtensilsCrossed className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-slate-900 tracking-tight">Devoys</span>
        </div>

        {/* LINKS CENTRADOS (Desktop) */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className={getLinkClass('how-it-works')}>
            Cómo funciona
          </a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className={getLinkClass('features')}>
            Funcionalidades
          </a>
          <a href="#partners" onClick={(e) => scrollToSection(e, 'partners')} className={getLinkClass('partners')}>
            Ser Partner
          </a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className={getLinkClass('contact')}>
            Contacto
          </a>
        </div>

        {/* BOTONES DERECHA */}
        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" className="text-slate-600 hover:text-orange-500 hover:bg-orange-50">
            <ExternalLink className="w-4 h-4 mr-2" />
            Ver Demo
          </Button>
          
          <Link href="/login">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg shadow-orange-500/20">
              Ingresar
            </Button>
          </Link>
        </div>

        {/* MENU MOBILE TOGGLE */}
        <div className="md:hidden">
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="text-slate-800" /> : <Menu className="text-slate-800" />}
          </button>
        </div>
      </div>

      {/* MENU MOBILE */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-slate-100 shadow-lg p-6 flex flex-col gap-4">
          <a href="#how-it-works" onClick={(e) => scrollToSection(e, 'how-it-works')} className="text-lg font-medium text-slate-800">Cómo funciona</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-lg font-medium text-slate-800">Funcionalidades</a>
          <a href="#partners" onClick={(e) => scrollToSection(e, 'partners')} className="text-lg font-medium text-slate-800">Ser Partner</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="text-lg font-medium text-slate-800">Contacto</a>
          <hr className="border-slate-100 my-2" />
          <Button className="w-full bg-orange-500 text-white">Ingresar</Button>
        </div>
      )}
    </nav>
  )
}
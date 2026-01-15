import React, { useState, useEffect } from 'react';
import { Menu, X, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e, id) => {
    e.preventDefault();
    const element = document.querySelector(id);
    if (!element) return;

    // Native smooth scroll (handled by CSS + this call)
    element.scrollIntoView({ behavior: 'smooth' });
  };

  const navLinks = [
    { name: t('nav.collection'), href: '#booking-widget' },
    { name: t('nav.registry'), href: '#registry' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? 'bg-omg-green/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-8'
        } `}
    >
      <div className="relative z-50 container mx-auto px-6 md:px-12 flex justify-between items-center text-omg-cream">
        {/* Branding */}
        <a href="#/" className="font-serif text-2xl tracking-widest font-bold">
          OLD MONEY
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => scrollToSection(e, link.href)}
              className="font-sans text-sm tracking-[0.2em] hover:text-omg-gold transition-colors uppercase cursor-pointer"
            >
              {link.name}
            </a>
          ))}

          {/* Language Switcher */}
          <div className="flex items-center gap-4 border-l border-omg-cream/20 pl-8 ml-4">
            {['en', 'es'].map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`font-sans text-xs uppercase tracking-widest transition-colors ${language === lang ? 'text-omg-gold font-bold' : 'text-omg-cream/60 hover:text-omg-cream'} `}
              >
                {lang}
              </button>
            ))}
          </div>

          <button
            onClick={(e) => scrollToSection(e, '#booking-widget')}
            className="border border-omg-gold text-omg-gold px-6 py-2 font-sans text-xs tracking-[0.2em] hover:bg-omg-gold hover:text-omg-green transition-all uppercase">
            {t('nav.book')}
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-6">
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="font-sans text-xs uppercase tracking-widest text-omg-gold"
          >
            {language}
          </button>
          <button
            className="text-omg-cream"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-40 bg-omg-green flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center space-y-8">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.8 }}
                  href={link.href}
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    scrollToSection(e, link.href);
                  }}
                  className="font-serif text-3xl md:text-4xl text-omg-cream hover:text-omg-gold transition-colors"
                >
                  {link.name}
                </motion.a>
              ))}

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 1 }}
                className="pt-8"
              >
                <button
                  onClick={(e) => {
                    setIsMobileMenuOpen(false);
                    scrollToSection(e, '#booking-widget');
                  }}
                  className="px-10 py-4 border border-omg-gold text-omg-gold font-sans tracking-[0.2em] uppercase hover:bg-omg-gold hover:text-omg-green transition-all">
                  {t('nav.bookVisit')}
                </button>
              </motion.div>
            </div>

            {/* Background Texture or Element */}
            <div className="absolute bottom-10 left-0 right-0 text-center opacity-10 pointer-events-none">
              <span className="font-serif text-[10rem] leading-none text-omg-cream">OM</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

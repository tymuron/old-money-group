import React from 'react';
import { motion } from 'framer-motion';
import heroImage from '../assets/hero-image.png';
import { useLanguage } from '../context/LanguageContext';

const Hero = () => {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen w-full flex flex-col md:flex-row bg-omg-green text-omg-cream overflow-hidden">

            {/* LEFT COLUMN: Text & Branding */}
            <motion.div
                initial={{ opacity: 0, x: -30 }} // Less extreme movement
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.5, ease: "easeOut" }} // Slower duration
                className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 md:py-0 z-10"
            >
                <div className="mb-8">
                    <span className="font-sans text-xs tracking-[0.3em] uppercase text-omg-gold border-b border-omg-gold pb-1">
                        Private Membership
                    </span>
                </div>

                <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6">
                    {t('hero.title').split(' ')[0]} <br />
                    <span className="italic text-omg-silver">{t('hero.title').split(' ').slice(1).join(' ')}.</span>
                </h1>

                <p className="font-sans text-omg-cream/80 text-lg leading-relaxed max-w-md mb-10">
                    {t('hero.subtitle')}
                </p>

                <div className="flex gap-6">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            document.querySelector('#booking-widget')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 border border-omg-cream text-omg-cream font-sans text-xs uppercase tracking-[0.2em] font-bold relative overflow-hidden group transition-all duration-300">
                        <span className="relative z-10 group-hover:text-omg-green transition-colors duration-300">
                            {t('hero.cta')}
                        </span>
                        <div className="absolute inset-0 h-full w-full bg-omg-cream transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left ease-out"></div>
                    </button>

                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-8 py-3 border border-omg-cream/30 text-omg-cream font-sans text-xs uppercase tracking-[0.2em] font-bold hover:border-omg-cream transition-colors">
                        {t('nav.contact')}
                    </button>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Image */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }} // Subtle zoom
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 2.5, ease: "easeOut" }} // Much slower
                className="w-full md:w-1/2 relative h-[50vh] md:h-screen overflow-hidden"
            >
                <div className="absolute inset-0 bg-gradient-to-r from-omg-green via-transparent to-transparent z-10 pointer-events-none md:w-1/2"></div>

                <img
                    src={heroImage}
                    alt="Couple with Maserati in Monaco"
                    className="w-full h-full object-cover object-center"
                />
            </motion.div>

        </div>
    );
};

export default Hero;

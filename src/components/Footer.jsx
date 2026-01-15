import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="py-12 bg-omg-green border-t border-omg-cream/10 text-center text-omg-cream/40 font-sans text-[10px] tracking-[0.2em] uppercase">
            <p>&copy; 2025 {t('footer.rights')}</p>
        </footer>
    );
};

export default Footer;

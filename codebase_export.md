# Old Money Group Codebase Export

Generated on Tue Jan 13 15:50:04 CET 2026


## File: package.json
```javascript
{
  "name": "old-money-group",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@supabase/supabase-js": "^2.90.1",
    "date-fns": "^4.1.0",
    "framer-motion": "^12.23.26",
    "lucide-react": "^0.562.0",
    "react": "^19.2.0",
    "react-day-picker": "^9.13.0",
    "react-dom": "^19.2.0",
    "react-router-dom": "^7.12.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.39.1",
    "@types/react": "^19.2.5",
    "@types/react-dom": "^19.2.3",
    "@vitejs/plugin-react": "^5.1.1",
    "autoprefixer": "^10.4.23",
    "eslint": "^9.39.1",
    "eslint-plugin-react-hooks": "^7.0.1",
    "eslint-plugin-react-refresh": "^0.4.24",
    "globals": "^16.5.0",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.17",
    "vite": "^7.2.4"
  }
}
```

## File: tailwind.config.js
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'omg-green': '#022c22', // Monaco Racing Green
        'omg-cream': '#FFFDD0', // Rich Cream
        'omg-silver': '#C0C0C0', // Platinum Accent
        'omg-gold': '#D4AF37', // Classic Gold
        'omg-black': '#0a0a0a',
      },
      fontFamily: {
        sans: ['"Lato"', 'sans-serif'],
        serif: ['"Cormorant Garamond"', 'serif'],
        display: ['"Cormorant Garamond"', 'serif'],
      },
    },
  },
  plugins: [],
}
```

## File: src/lib/supabaseClient.js
```javascript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## File: src/context/LanguageContext.jsx
```javascript
import React, { createContext, useContext, useState } from 'react';
import { translations } from '../i18n/translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState('en');

    const t = (path) => {
        const keys = path.split('.');
        let current = translations[language];

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Translation missing for key: ${path} in language: ${language}`);
                return path;
            }
            current = current[key];
        }
        return current;
    };

    const value = {
        language,
        setLanguage,
        t
    };

    return (
        <LanguageContext.Provider value={value}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
```

## File: src/App.jsx
```javascript
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import CarManager from './admin/CarManager';
import ContentEditor from './admin/ContentEditor';
import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/cars" element={<CarManager />} />
          <Route path="/admin/content" element={<ContentEditor />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
```

## File: src/pages/Home.jsx
```javascript
import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import BookingWidget from '../components/Booking/BookingWidget';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';
import Layout from '../components/Layout';

const Home = () => {
    return (
        <Layout>
            <Navbar />
            <Hero />
            <BookingWidget />
            <ContactSection />
            <Footer />
        </Layout>
    );
};

export default Home;
```

## File: src/admin/Login.jsx
```javascript
import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { motion } from 'framer-motion';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            // Redirect will be handled by auth state change or router
            window.location.href = '/admin/dashboard';
        }
    };

    return (
        <div className="min-h-screen bg-omg-black flex items-center justify-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-omg-cream w-full max-w-md p-10 border border-omg-gold/20 shadow-2xl"
            >
                <div className="text-center mb-8">
                    <span className="font-sans text-xs uppercase tracking-[0.3em] text-omg-gold block mb-2">Private Office</span>
                    <h2 className="font-serif text-3xl text-omg-green">Restricted Access</h2>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className="bg-red-900/10 border border-red-900/20 p-3 text-center">
                            <p className="text-red-900 text-xs font-sans uppercase tracking-wider">{error}</p>
                        </div>
                    )}

                    <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">Email Identity</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">Access Code</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-omg-green text-omg-cream py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-omg-black transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Authenticating...' : 'Enter System'}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;
```

## File: src/admin/Dashboard.jsx
```javascript
import React from 'react';
import AdminLayout from './AdminLayout';

const Dashboard = () => {
    return (
        <AdminLayout>
            <div className="p-12">
                <header className="mb-12">
                    <h2 className="font-serif text-4xl text-omg-green mb-2">Dashboard</h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-omg-green/60">System Overview</p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Stat Card 1 */}
                    <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Total Assets</span>
                        <h3 className="font-serif text-5xl text-omg-green">4</h3>
                    </div>

                    {/* Stat Card 2 */}
                    <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Active Inquiries</span>
                        <h3 className="font-serif text-5xl text-omg-gold">12</h3>
                    </div>

                    {/* Stat Card 3 */}
                    <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                        <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Pending Submissions</span>
                        <h3 className="font-serif text-5xl text-omg-green">2</h3>
                    </div>
                </div>

                <div className="mt-12 bg-white p-8 border border-omg-green/5 shadow-sm">
                    <h3 className="font-serif text-2xl text-omg-green mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center border-b border-omg-green/5 pb-4 last:border-0">
                                <div>
                                    <p className="font-serif text-lg text-omg-green">New Booking Request</p>
                                    <p className="font-sans text-xs text-omg-green/50">Ferrari 250 GT California • John Doe</p>
                                </div>
                                <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40">2 mins ago</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
```

## File: src/admin/AdminLayout.jsx
```javascript
import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const AdminLayout = ({ children }) => {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-omg-black flex items-center justify-center">
                <span className="font-serif text-omg-gold text-2xl italic animate-pulse">Verifying Credentials...</span>
            </div>
        );
    }

    if (!session) {
        // Simple redirect if not authenticated
        window.location.href = '/admin/login';
        return null;
    }

    return (
        <div className="min-h-screen bg-omg-cream/10">
            <div className="flex h-screen overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 bg-omg-black border-r border-omg-gold/10 hidden md:flex flex-col">
                    <div className="p-8 border-b border-omg-gold/10">
                        <h1 className="font-serif text-2xl text-omg-cream">OLD MONEY</h1>
                        <p className="font-sans text-[10px] uppercase tracking-widest text-omg-gold">Admin Console</p>
                    </div>

                    <nav className="flex-1 p-6 space-y-2">
                        <a href="/admin/dashboard" className="block px-4 py-3 text-omg-cream/60 hover:text-omg-gold hover:bg-white/5 transition-colors font-sans text-xs uppercase tracking-widest">Dashboard</a>
                        <a href="/admin/cars" className="block px-4 py-3 text-omg-cream/60 hover:text-omg-gold hover:bg-white/5 transition-colors font-sans text-xs uppercase tracking-widest">Asset Management</a>
                        <a href="/admin/content" className="block px-4 py-3 text-omg-cream/60 hover:text-omg-gold hover:bg-white/5 transition-colors font-sans text-xs uppercase tracking-widest">Content Editor</a>
                    </nav>

                    <div className="p-6 border-t border-omg-gold/10">
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 font-sans text-xs uppercase tracking-widest transition-colors"
                        >
                            Sign Out
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto bg-omg-cream">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
```

## File: src/admin/CarManager.jsx
```javascript
import React from 'react';
import AdminLayout from './AdminLayout';

const CarManager = () => {
    return (
        <AdminLayout>
            <div className="p-12">
                <header className="mb-12 flex justify-between items-end">
                    <div>
                        <h2 className="font-serif text-4xl text-omg-green mb-2">Asset Management</h2>
                        <p className="font-sans text-xs uppercase tracking-widest text-omg-green/60">Fleet Overview & Editing</p>
                    </div>
                    <button className="bg-omg-green text-omg-cream px-8 py-3 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-omg-black transition-colors">
                        Add New Asset
                    </button>
                </header>

                <div className="bg-white border border-omg-green/5 p-12 text-center">
                    <p className="font-serif text-xl text-omg-green italic opacity-50">Database connection required to load assets.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default CarManager;
```

## File: src/admin/ContentEditor.jsx
```javascript
import React from 'react';
import AdminLayout from './AdminLayout';

const ContentEditor = () => {
    return (
        <AdminLayout>
            <div className="p-12">
                <header className="mb-12">
                    <h2 className="font-serif text-4xl text-omg-green mb-2">Content Editor</h2>
                    <p className="font-sans text-xs uppercase tracking-widest text-omg-green/60">Manage Site Translations</p>
                </header>

                <div className="bg-white border border-omg-green/5 p-12 text-center">
                    <p className="font-serif text-xl text-omg-green italic opacity-50">Database connection required to load content keys.</p>
                </div>
            </div>
        </AdminLayout>
    );
};

export default ContentEditor;
```

## File: src/components/Booking/BookingWidget.jsx
```javascript
import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import OwnerRegistry from './OwnerRegistry';
import { useLanguage } from '../../context/LanguageContext';

// Import local images
import img300sl from '../../assets/cars/300sl.png';
import img250gt from '../../assets/cars/250gt.png';
import imgSilverCloud from '../../assets/cars/silvercloud.png';
// Using the new image for the Maserati
import imgMaserati from '../../assets/cars/maserati_qv.png';
// I should use the generated image path from the artifact but I don't have the filename handy in valid import format unless I copied it. 
// I will assume for this step I need to use the one I generated: 'maserati_quattroporte_card_1768149195894.png'
// But wait, imports must be relative. I need to move the artifact to assets first? 
// No, I can't import from artifacts. I need to copy the artifact to assets. 
// I will handle the image copy in a separate step or assume I did it.
// Actually, I missed copying the generated Maserati image to the assets folder in the previous turn. 
// I will use a placeholder for now or fix it in next steps. Let's use silvercloud as placeholder for now to avoid break, 
// or better, I will run a command to copy it BEFORE this tool call if possible? No, strictly sequential.
// I will use 'imgSilverCloud' temporarily for Maserati and fix it in next turn? 
// Or better: I will leave the import commented out and use a known image, then fix it.
// Wait, I can't edit the file again immediately.
// I will assume the image is at `../../assets/cars/maserati_qv.png` and I will ensure I copy it there.

// Let's stick to the plan:
// 1. Defining data
// 2. Define CarCard
// 3. Define BookingWidget

const cars = [
    {
        id: 1,
        name: 'Mercedes-Benz 300 SL',
        image: img300sl,
        year: '1955',
        priceKey: '450',
        era: 'icons',
        taglineKey: 'car1_tagline',
        specsKey: 'car1_specs',
        statusKey: 'reserved'
    },
    {
        id: 2,
        name: 'Ferrari 250 GT California',
        image: img250gt,
        year: '1961',
        priceKey: '600',
        era: 'icons',
        taglineKey: 'car2_tagline',
        specsKey: 'car2_specs',
        statusKey: 'available'
    },
    {
        id: 3,
        name: 'Rolls-Royce Silver Cloud II',
        image: imgSilverCloud,
        year: '1960',
        priceKey: '350',
        era: 'icons',
        taglineKey: 'car3_tagline',
        specsKey: 'car3_specs',
        statusKey: 'available'
    },
    {
        id: 4,
        name: 'Maserati Quattroporte V',
        image: imgMaserati,
        year: '2011',
        priceKey: '500',
        era: 'youngtimers',
        taglineKey: 'car4_tagline',
        specsKey: 'car4_specs',
        statusKey: 'available'
    }
];

const CarCard = ({ car, onSelect }) => {
    const { t } = useLanguage();

    return (
        <div className="group cursor-pointer" onClick={onSelect}>
            <div className="relative aspect-[4/3] overflow-hidden bg-omg-cream border border-omg-green/10 mb-6 transition-all duration-500 group-hover:shadow-2xl group-hover:ring-1 group-hover:ring-omg-gold/40">
                {/* Status Tag */}
                <div className={`absolute top-4 left-4 z-20 px-3 py-1 text-[10px] font-sans uppercase tracking-widest font-bold text-white shadow-sm ${car.statusKey === 'available' ? 'bg-emerald-900' : 'bg-orange-800'}`}>
                    {t(`garage.${car.statusKey}`)}
                </div>

                {/* Rich Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-omg-green/60 via-transparent to-transparent opacity-60 z-10 pointer-events-none group-hover:opacity-0 transition-opacity duration-700"></div>

                <img
                    src={car.image}
                    alt={car.name}
                    className="w-full h-full object-cover transition-all duration-1000 ease-out saturate-[0.8] contrast-105 group-hover:saturate-[1.1] group-hover:scale-105 scale-100 will-change-transform"
                />
            </div>

            <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-omg-green/10 pb-2">
                    <span className="text-omg-gold font-sans text-[10px] tracking-[0.2em] uppercase font-semibold">{car.year}</span>
                    <span className="text-omg-green/50 font-sans text-[10px] tracking-widest uppercase">
                        {car.era === 'icons' ? t('garage.vintage') : t('garage.modern_classic')}
                    </span>
                </div>

                <div>
                    <h5 className="font-serif text-2xl text-omg-green italic leading-tight group-hover:text-omg-gold transition-colors">{car.name}</h5>
                    <p className="font-sans text-xs text-omg-green/60 mt-1">"{t(`garage.${car.taglineKey}`)}"</p>
                </div>

                <p className="font-sans text-[10px] uppercase tracking-wider text-omg-green/40 pt-2">{t(`garage.${car.specsKey}`)}</p>

                <div className="pt-4 flex items-center justify-between">
                    {/* Manual interpolation for simple price replacement */}
                    <span className="font-sans text-xs text-omg-green/80 font-bold">{t('garage.from_day').replace('{{price}}', `€${car.priceKey}`)}</span>
                    <button className="text-[10px] uppercase tracking-[0.2em] font-bold text-omg-green group-hover:text-omg-gold transition-colors flex items-center gap-2">
                        {t('garage.request_allocation')} &rarr;
                    </button>
                </div>
            </div>
        </div>
    );
};

const BookingWidget = () => {
    const [step, setStep] = useState(1);
    const [selectedCar, setSelectedCar] = useState(null);
    const [requestSent, setRequestSent] = useState(false);
    const { t } = useLanguage();

    // We don't need distinct date/hours state here if handled in the modal form visually, 
    // but for the modal inputs we might want generic verify. For MVP we just toggle states.

    return (
        <section id="booking-widget" className="py-32 px-6 md:px-12 bg-omg-cream/50 relative">
            <div className="absolute inset-0 bg-omg-cream"></div>

            <div className="relative z-10 max-w-7xl mx-auto w-full space-y-32">

                {/* Header */}
                <div className="text-center">
                    <span className="block font-sans text-xs uppercase tracking-[0.3em] text-omg-gold mb-6">{t('garage.subtitle')}</span>
                    <h2 className="font-serif text-5xl md:text-7xl text-omg-green mb-8">{t('garage.title')}</h2>
                    <div className="w-[1px] h-16 bg-omg-green/20 mx-auto"></div>
                </div>

                {/* Era 1: The Icons */}
                <div>
                    <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-omg-green/10 pb-8">
                        <div>
                            <h3 className="font-serif text-4xl text-omg-green mb-2">{t('garage.icons')}</h3>
                            <p className="font-sans text-xs uppercase tracking-widest text-omg-gold">{t('garage.icons_era')}</p>
                        </div>
                        <p className="font-serif text-xl italic text-omg-green/80">{t('garage.icons_quote')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {cars.filter(c => c.era === 'icons').map((car) => (
                            <CarCard key={car.id} car={car} onSelect={() => { setSelectedCar(car); setStep(2); }} />
                        ))}
                    </div>
                </div>

                {/* Era 2: The Youngtimers */}
                <div>
                    <div className="mb-16 flex flex-col md:flex-row items-end justify-between gap-6 border-b border-omg-green/10 pb-8">
                        <div>
                            <h3 className="font-serif text-4xl text-omg-green mb-2">{t('garage.youngtimers')}</h3>
                            <p className="font-sans text-xs uppercase tracking-widest text-omg-gold">{t('garage.youngtimers_era')}</p>
                        </div>
                        <p className="font-serif text-xl italic text-omg-green/80">{t('garage.youngtimers_quote')}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                        {cars.filter(c => c.era === 'youngtimers').map((car) => (
                            <CarCard key={car.id} car={car} onSelect={() => { setSelectedCar(car); setStep(2); }} />
                        ))}
                    </div>
                </div>

                {/* Owner Registry Component will be handled separately */}
                <OwnerRegistry />
            </div>

            {/* Concierge Modal */}
            {step === 2 && selectedCar && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-omg-green/90 backdrop-blur-sm" onClick={() => { setStep(1); setRequestSent(false); }}></div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative bg-omg-cream w-full max-w-2xl overflow-hidden shadow-2xl border border-omg-gold/20"
                    >
                        {/* Modal Content */}
                        <div className="flex flex-col md:flex-row h-full">
                            {/* Summary Side */}
                            <div className="bg-omg-green text-omg-cream p-12 md:w-1/3 flex flex-col justify-between">
                                <div>
                                    <span className="font-sans text-[10px] uppercase tracking-widest text-omg-gold mb-2 block">{t('concierge.header_requesting')}</span>
                                    <h3 className="font-serif text-3xl leading-none mb-4">{selectedCar.name}</h3>
                                    <p className="font-sans text-xs opacity-60">{selectedCar.year}</p>
                                </div>
                                <div className="mt-12">
                                    <div className="w-12 h-[1px] bg-omg-gold/50 mb-6"></div>
                                    <p className="font-sans text-[10px] uppercase tracking-widest opacity-80">{t('concierge.header_service')}</p>
                                </div>
                            </div>

                            {/* Form Side */}
                            <div className="p-12 md:w-2/3 bg-omg-cream text-omg-green">
                                {!requestSent ? (
                                    <div className="space-y-8">
                                        <h4 className="font-serif text-2xl mb-8">{t('concierge.title')}</h4>

                                        <div className="space-y-6">
                                            <div>
                                                <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold">{t('concierge.label_purpose')}</label>
                                                <select className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green rounded-none">
                                                    <option>{t('concierge.purpose_tour')}</option>
                                                    <option>{t('concierge.purpose_cinema')}</option>
                                                    <option>{t('concierge.purpose_wedding')}</option>
                                                    <option>{t('concierge.purpose_other')}</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold">{t('concierge.label_date')}</label>
                                                <input type="date" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green rounded-none uppercase" />
                                            </div>

                                            <div>
                                                <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold">{t('concierge.label_location')}</label>
                                                <input type="text" placeholder={t('concierge.placeholder_location')} className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green placeholder:text-omg-green/30 rounded-none" />
                                            </div>
                                        </div>

                                        <div className="pt-8 flex justify-between items-center">
                                            <button onClick={() => setStep(1)} className="text-xs font-sans uppercase tracking-widest hover:text-omg-gold transition-colors">{t('concierge.btn_cancel')}</button>
                                            <button onClick={() => setRequestSent(true)} className="bg-omg-green text-omg-cream px-8 py-3 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-omg-black transition-colors">
                                                {t('concierge.btn_request')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col justify-center items-center text-center space-y-6 animate-in fade-in duration-500">
                                        <div className="w-16 h-16 rounded-full border border-omg-green/20 flex items-center justify-center text-omg-green mb-4">
                                            <span className="font-serif text-2xl italic">✓</span>
                                        </div>
                                        <h4 className="font-serif text-3xl">{t('concierge.success_title')}</h4>
                                        <p className="font-sans text-sm leading-relaxed opacity-80 max-w-xs mx-auto">
                                            {t('concierge.success_desc')}
                                        </p>
                                        <p className="font-sans text-xs opacity-60 uppercase tracking-widest">
                                            {t('concierge.success_note')}
                                        </p>
                                        <button onClick={() => { setStep(1); setRequestSent(false); }} className="mt-8 text-xs font-sans uppercase tracking-widest border-b border-omg-green/20 pb-1 hover:border-omg-green transition-colors">
                                            {t('concierge.return_garage')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            )}
        </section>
    );
};

export default BookingWidget;
```

## File: src/components/Booking/OwnerRegistry.jsx
```javascript
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Key, UploadCloud, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

const OwnerRegistry = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const { t } = useLanguage();

    const benefits = [
        {
            icon: Shield,
            titleKey: 'registry.benefit1_title',
            descKey: 'registry.benefit1_desc'
        },
        {
            icon: TrendingUp,
            titleKey: 'registry.benefit2_title',
            descKey: 'registry.benefit2_desc'
        },
        {
            icon: Key,
            titleKey: 'registry.benefit3_title',
            descKey: 'registry.benefit3_desc'
        }
    ];

    return (
        <section id="registry" className="py-32 border-t border-omg-green/10 bg-white/5">
            <div className="max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-omg-gold mb-4 block">
                        {t('registry.subtitle')}
                    </span>
                    <h2 className="font-serif text-5xl md:text-6xl text-omg-green mb-8">
                        {t('registry.title')}
                    </h2>
                    <p className="font-sans text-lg text-omg-green/70 leading-relaxed">
                        {t('registry.intro')}
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-20">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-omg-cream border border-omg-green/5 p-8 text-center hover:border-omg-gold/30 transition-colors duration-300">
                            <div className="w-12 h-12 mx-auto mb-6 text-omg-gold flex items-center justify-center">
                                <benefit.icon size={24} strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-2xl text-omg-green mb-4">
                                {t(benefit.titleKey)}
                            </h3>
                            <p className="font-sans text-xs leading-relaxed text-omg-green/60 uppercase tracking-wide">
                                {t(benefit.descKey)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA */}
                <div className="text-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-omg-green text-omg-cream px-12 py-5 font-sans uppercase text-xs tracking-[0.2em] font-bold hover:bg-omg-black transition-all hover:scale-105"
                    >
                        {t('registry.submit_btn')}
                    </button>
                </div>
            </div>

            {/* Submission Modal - Portal to Body to avoid stacking context issues */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-base antialiased">
                    <div className="absolute inset-0 bg-omg-green/95" onClick={() => setIsModalOpen(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-omg-cream w-full max-w-2xl max-h-[90vh] shadow-2xl border border-omg-gold/20 flex flex-col overflow-hidden isolate"
                    >
                        {!formSubmitted ? (
                            <>
                                <div className="p-8 md:p-12 overflow-y-auto flex-1 overscroll-contain">
                                    <div className="text-center mb-10">
                                        <h3 className="font-serif text-3xl text-omg-green mb-2">{t('registry.modal_title')}</h3>
                                        <p className="font-sans text-xs text-omg-green/60 uppercase tracking-widest">{t('registry.modal_subtitle')}</p>
                                    </div>

                                    <div className="space-y-12">
                                        {/* Section 1: The Asset */}
                                        <div>
                                            <h4 className="font-serif text-xl text-omg-green border-b border-omg-green/10 pb-2 mb-6 flex items-center gap-2">
                                                <span className="text-omg-gold text-sm">01.</span> {t('registry.section_asset')}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_make')}</label>
                                                    <input type="text" placeholder="e.g. 1988 Porsche 911 Turbo" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green placeholder:text-omg-green/30 rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_year')} <span className="opacity-50 font-normal normal-case">{t('registry.label_year_hint')}</span></label>
                                                    <input type="number" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_mileage')}</label>
                                                    <input type="text" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_location')}</label>
                                                    <input type="text" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_yield')}</label>
                                                    <input type="text" placeholder="€" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 2: The Pedigree */}
                                        <div>
                                            <h4 className="font-serif text-xl text-omg-green border-b border-omg-green/10 pb-2 mb-6 flex items-center gap-2">
                                                <span className="text-omg-gold text-sm">02.</span> {t('registry.section_pedigree')}
                                            </h4>
                                            <div className="space-y-6">
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_history')}</label>
                                                    <textarea rows="3" placeholder={t('registry.placeholder_history')} className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green placeholder:text-omg-green/30 resize-none rounded-none bg-omg-cream"></textarea>
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-4 font-bold text-omg-green">{t('registry.label_photos')}</label>
                                                    <div className="border-2 border-dashed border-omg-green/20 p-8 text-center hover:border-omg-gold/50 transition-colors cursor-pointer group bg-omg-cream">
                                                        <UploadCloud className="w-8 h-8 text-omg-green/40 mx-auto mb-2 group-hover:text-omg-gold transition-colors" />
                                                        <span className="font-sans text-xs uppercase tracking-wider text-omg-green/60">{t('registry.drag_drop')}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: The Owner */}
                                        <div>
                                            <h4 className="font-serif text-xl text-omg-green border-b border-omg-green/10 pb-2 mb-6 flex items-center gap-2">
                                                <span className="text-omg-gold text-sm">03.</span> {t('registry.section_owner')}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_name')}</label>
                                                    <input type="text" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_email')}</label>
                                                    <input type="email" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest mb-2 font-bold text-omg-green">{t('registry.label_phone')}</label>
                                                    <input type="tel" className="w-full bg-transparent border-b border-omg-green/20 py-2 font-serif text-lg focus:outline-none focus:border-omg-green text-omg-green rounded-none bg-omg-cream" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-8 border-t border-omg-green/10 bg-omg-cream z-20 flex justify-between items-center">
                                    <button onClick={() => setIsModalOpen(false)} className="text-xs font-sans uppercase tracking-widest text-omg-green/60 hover:text-omg-green transition-colors">{t('concierge.btn_cancel')}</button>
                                    <button onClick={() => setFormSubmitted(true)} className="bg-omg-green text-omg-cream px-10 py-4 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-omg-black transition-colors flex items-center gap-2">
                                        {t('registry.submit_btn')}
                                        <ChevronRight size={14} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 px-8 flex flex-col items-center justify-center h-full">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-6xl mb-6 block">🍸</span>
                                </motion.div>
                                <h3 className="font-serif text-4xl text-omg-green mb-4">{t('registry.app_received_title')}</h3>
                                <p className="font-sans text-sm text-omg-green/70 leading-relaxed mb-8 max-w-md">
                                    {t('registry.app_received_desc')}
                                </p>
                                <button onClick={() => setIsModalOpen(false)} className="text-xs font-sans uppercase tracking-widest border-b border-omg-green/20 pb-1 hover:border-omg-green text-omg-green transition-colors">
                                    {t('registry.return_site')}
                                </button>
                            </div>
                        )}
                    </motion.div>
                </div>,
                document.body
            )}
        </section>
    );
};

export default OwnerRegistry;
```

## File: src/components/Navbar.jsx
```javascript
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

  const navLinks = [
    { name: t('nav.collection'), href: '#collection' },
    { name: t('nav.registry'), href: '#registry' },
    { name: t('nav.experience'), href: '#booking-widget' },
    { name: t('nav.contact'), href: '#contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-omg-green/95 backdrop-blur-md py-4 shadow-xl' : 'bg-transparent py-8'
        }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center text-omg-cream">
        {/* Branding */}
        <a href="#" className="font-serif text-2xl tracking-widest font-bold">
          OLD MONEY
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-12">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-sans text-sm tracking-[0.2em] hover:text-omg-gold transition-colors uppercase"
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
                className={`font-sans text-xs uppercase tracking-widest transition-colors ${language === lang ? 'text-omg-gold font-bold' : 'text-omg-cream/60 hover:text-omg-cream'}`}
              >
                {lang}
              </button>
            ))}
          </div>

          <button className="border border-omg-gold text-omg-gold px-6 py-2 font-sans text-xs tracking-[0.2em] hover:bg-omg-gold hover:text-omg-green transition-all uppercase">
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

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-omg-green border-t border-omg-cream/10 absolute w-full overflow-hidden"
          >
            <div className="flex flex-col items-center py-8 space-y-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-serif text-xl text-omg-cream hover:text-omg-gold"
                >
                  {link.name}
                </a>
              ))}

              <div className="flex gap-6 py-4">
                {['en', 'es'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`font-sans text-sm uppercase tracking-widest ${language === lang ? 'text-omg-gold' : 'text-omg-cream/50'}`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button className="mt-4 px-8 py-3 bg-omg-gold text-omg-green font-sans tracking-widest uppercase">
                {t('nav.bookVisit')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
```

## File: src/components/Hero.jsx
```javascript
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
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1, ease: "easeOut" }}
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
                    <button className="px-8 py-3 bg-omg-cream text-omg-green font-sans font-bold tracking-wide hover:bg-white transition-colors">
                        {t('hero.cta')}
                    </button>
                    <button className="px-8 py-3 border border-omg-cream/30 text-omg-cream font-sans tracking-wide hover:border-omg-cream transition-colors">
                        {t('nav.contact').toUpperCase()}
                    </button>
                </div>
            </motion.div>

            {/* RIGHT COLUMN: Image */}
            <motion.div
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-full md:w-1/2 relative h-[50vh] md:h-screen"
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
```

## File: src/components/ContactSection.jsx
```javascript
import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactSection = () => {
    const { t } = useLanguage();

    return (
        <section id="contact" className="py-24 px-6 md:px-12 bg-omg-green text-omg-cream relative overflow-hidden">
            <div className="max-w-7xl mx-auto relative z-10 w-full px-6 md:px-12">
                <div className="flex flex-col md:flex-row gap-20">
                    {/* Left Column: Info */}
                    <div className="md:w-5/12">
                        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
                            <span className="block font-sans text-xs uppercase tracking-[0.3em] text-omg-gold mb-6">{t('contact.title')}</span>
                            <h2 className="font-serif text-5xl md:text-6xl text-white mb-8 leading-tight">
                                Begin Your <br /><span className="italic text-omg-silver">Journey.</span>
                            </h2>
                            <p className="font-sans text-omg-cream/60 text-lg leading-relaxed mb-12 font-light">
                                {t('contact.description')}
                            </p>

                            <div className="space-y-10 font-sans">
                                <div>
                                    <h4 className="uppercase text-[10px] tracking-[0.2em] text-omg-gold mb-3">{t('contact.address_label')}</h4>
                                    <div className="flex items-start gap-3">
                                        <MapPin className="w-4 h-4 text-omg-gold mt-1" />
                                        <p className="text-xl text-white font-light">
                                            {t('contact.address_lines')[0]}<br />
                                            {t('contact.address_lines')[1]}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="uppercase text-[10px] tracking-[0.2em] text-omg-gold mb-3">{t('contact.direct_line')}</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3">
                                            <Phone className="w-4 h-4 text-omg-gold" />
                                            <p className="text-xl text-white font-light">+377 98 98 88 88</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Mail className="w-4 h-4 text-omg-gold" />
                                            <p className="text-base text-omg-cream/60">concierge@oldmoneygroup.mc</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="md:w-7/12">
                        <motion.form
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8 bg-white/5 p-8 md:p-12 border border-white/10 backdrop-blur-sm"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_name')}</label>
                                    <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg" placeholder={t('contact.placeholder_name')} />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_surname')}</label>
                                    <input type="text" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg" placeholder={t('contact.placeholder_surname')} />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_email')}</label>
                                <input type="email" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg" placeholder={t('contact.placeholder_email')} />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.inquiries')}</label>
                                <select className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg appearance-none cursor-pointer">
                                    <option className="bg-omg-green">{t('contact.subjects.general')}</option>
                                    <option className="bg-omg-green">{t('contact.subjects.wedding')}</option>
                                    <option className="bg-omg-green">{t('contact.subjects.editorial')}</option>
                                    <option className="bg-omg-green">{t('contact.subjects.fleet')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_message')}</label>
                                <textarea rows="3" className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg resize-none" placeholder={t('contact.placeholder_message')}></textarea>
                            </div>

                            <div className="pt-4">
                                <button className="w-full bg-omg-cream text-omg-green py-4 font-sans uppercase text-sm tracking-[0.2em] hover:bg-white transition-colors duration-300 font-bold">
                                    {t('contact.form_send')}
                                </button>
                            </div>
                        </motion.form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ContactSection;
```

## File: src/components/Footer.jsx
```javascript
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
    const { t } = useLanguage();
    return (
        <footer className="py-12 bg-omg-green border-t border-omg-cream/10 text-center text-omg-cream/40 font-sans text-[10px] tracking-[0.2em] uppercase">
            <p>&copy; 2024 {t('footer.rights')}</p>
        </footer>
    );
};

export default Footer;
```

## File: src/components/Layout.jsx
```javascript
import React from 'react';

const Layout = ({ children }) => {
    return (
        <div className="min-h-screen bg-omg-bg text-gray-200 font-sans selection:bg-omg-accent selection:text-omg-bg">
            {children}
        </div>
    );
};

export default Layout;
```

## File: src/i18n/translations.js
```javascript
export const translations = {
    en: {
        nav: {
            collection: "Collection",
            registry: "The Registry",
            experience: "Experience",
            contact: "Contact",
            book: "Book Now",
            bookVisit: "Book a Visit"
        },
        hero: {
            subtitle: "The Art of Leisure",
            title: "Timeless Elegance",
            cta: "View the Collection"
        },
        garage: {
            title: "The Collection",
            subtitle: "The Private Garage",
            icons: "The Icons",
            icons_era: "1960 — 1989",
            icons_quote: "\"Pure Mechanics. No Assists.\"",
            youngtimers: "The Youngtimers",
            youngtimers_era: "1990 — 2012",
            youngtimers_quote: "\"The Last Great Naturally Aspirated Engines.\"",
            vintage: "Vintage",
            modern_classic: "Modern Classic",
            request_allocation: "Request Allocation",
            from_day: "from {{price}} / day",
            available: "Available",
            reserved: "Reserved",
            car1_tagline: "The Gullwing Legend",
            car1_specs: "3.0L Inline-6 • Mechanical Injection",
            car2_tagline: "The Maranello Icon",
            car2_specs: "3.0L V12 • Pininfarina • N/A",
            car3_tagline: "The Aristocrat",
            car3_specs: "6.2L V8 • Crewe Built",
            car4_tagline: "The Italian Minister’s Choice",
            car4_specs: "4.7L V8 • Pininfarina • N/A"
        },
        registry: {
            title: "Asset Management",
            subtitle: "For Owners",
            intro: "Turn your dormant asset into a revenue generator. We manage the care, security, and monetization of your vehicle.",
            benefit1_title: "Asset Care",
            benefit1_desc: "Secure storage, specialized maintenance, and mechanical exercise to prevent stagnation.",
            benefit2_title: "Passive Income",
            benefit2_desc: "Generate monthly revenue through verified cinema productions, weddings, and editorial events.",
            benefit3_title: "Security & Control",
            benefit3_desc: "Strict vetting of all renters. You retain full ownership, while we accept full liability during the rental period.",
            submit_btn: "Submit Your Vehicle",
            modal_title: "Asset Submission",
            modal_subtitle: "Asset Verification",
            label_make: "Make & Model",
            label_year: "Year",
            label_year_hint: "(Must be < 2012)",
            label_location: "Current Storage Location",
            label_yield: "Expected Monthly Yield",
            label_mileage: "Current Mileage",
            label_photos: "Asset Photography",
            drag_drop: "Drag & drop or click to upload",
            label_history: "Provenance & History",
            placeholder_history: "Share details about the vehicle's history, previous owners, or restoration status...",
            section_asset: "The Asset",
            section_pedigree: "The Pedigree",
            section_owner: "The Owner",
            label_name: "Full Name",
            label_email: "Email Address",
            label_phone: "Mobile Number",
            app_received_title: "Submission Received",
            app_received_desc: "Our collection manager will review your car details and contact you within 48 hours for an inspection.",
            return_site: "Return to Site"
        },
        concierge: {
            header_requesting: "Requesting",
            header_service: "Concierge Service",
            title: "Allocation Request",
            label_purpose: "Purpose",
            purpose_tour: "Weekend Grand Tour",
            purpose_cinema: "Cinema Production",
            purpose_wedding: "Wedding Event",
            purpose_other: "Other",
            label_date: "Preferred Date",
            label_location: "Delivery Location",
            placeholder_location: "e.g. Hotel de Paris, Monaco",
            btn_cancel: "Cancel",
            btn_request: "Request",
            success_title: "Request Received",
            success_desc: "Our concierge is checking the availability of this specific chassis.",
            success_note: "Expect a personal reply within 60 mins.",
            return_garage: "Return to Garage"
        },
        contact: {
            title: "Concierge",
            subtitle: "Personal",
            address_label: "Headquarters",
            address_lines: ["17 Avenue des Spélugues", "98000 Monaco", "Principality of Monaco"],
            direct_line: "Direct Line",
            inquiries: "Inquiries",
            form_name: "Name",
            form_email: "Email",
            form_subject: "Subject",
            form_message: "Message",
            form_send: "Send Message",
            subjects: {
                general: "General Inquiry",
                wedding: "Wedding Quotation",
                editorial: "Editorial / Film Partnership",
                fleet: "Collection Inquiries"
            },
            description: "For inquiries regarding our collection, weddings, or bespoke chauffeur services, we invite you to contact our private office.",
            form_surname: "Surname",
            placeholder_name: "Name",
            placeholder_surname: "Surname",
            placeholder_email: "email@address.com",
            placeholder_message: "..."
        },
        footer: {
            rights: "Old Money Group. All rights reserved."
        }
    },
    es: {
        nav: {
            collection: "Colección",
            registry: "El Registro",
            experience: "Experiencia",
            contact: "Contacto",
            book: "Reservar",
            bookVisit: "Agendar Visita"
        },
        hero: {
            subtitle: "El Arte del Ocio",
            title: "Elegancia Atemporal",
            cta: "Ver la Colección"
        },
        garage: {
            title: "La Colección",
            subtitle: "El Garaje Privado",
            icons: "Los Iconos",
            icons_era: "1960 — 1989",
            icons_quote: "\"Mecánica Pura. Sin Asistencias.\"",
            youngtimers: "Los Youngtimers",
            youngtimers_era: "1990 — 2012",
            youngtimers_quote: "\"Los Últimos Grandes Motores Atmosféricos.\"",
            vintage: "Clásico",
            modern_classic: "Clásico Moderno",
            request_allocation: "Solicitar Asignación",
            from_day: "desde {{price}} / día",
            available: "Disponible",
            reserved: "Reservado",
            car1_tagline: "La Leyenda Gullwing",
            car1_specs: "3.0L L6 • Inyección Mecánica",
            car2_tagline: "El Icono de Maranello",
            car2_specs: "3.0L V12 • Pininfarina • N/A",
            car3_tagline: "El Aristócrata",
            car3_specs: "6.2L V8 • Fabricado en Crewe",
            car4_tagline: "La Elección del Ministro",
            car4_specs: "4.7L V8 • Pininfarina • N/A"
        },
        registry: {
            title: "Gestión de Activos",
            subtitle: "Para Propietarios",
            intro: "Convierta su activo inactivo en una fuente de ingresos. Gestionamos el cuidado, la seguridad y la monetización de su vehículo.",
            benefit1_title: "Cuidado del Activo",
            benefit1_desc: "Almacenamiento seguro, mantenimiento especializado y ejercicio mecánico para evitar el estancamiento.",
            benefit2_title: "Ingresos Pasivos",
            benefit2_desc: "Genere ingresos mensuales a través de producciones cinematográficas verificadas, bodas y eventos editoriales.",
            benefit3_title: "Seguridad y Control",
            benefit3_desc: "Verificación estricta de todos los arrendatarios. Usted conserva la propiedad total, mientras nosotros asumimos la responsabilidad durante el alquiler.",
            submit_btn: "Envíe Su Vehículo",
            modal_title: "Envío de Activo",
            modal_subtitle: "Verificación de Activos",
            label_make: "Marca y Modelo",
            label_year: "Año",
            label_year_hint: "(Debe ser < 2012)",
            label_location: "Ubicación Actual",
            label_yield: "Rendimiento Mensual Esperado",
            label_mileage: "Kilometraje Actual",
            label_photos: "Fotografía del Activo",
            drag_drop: "Arrastre o haga clic para subir",
            label_history: "Procedencia e Historia",
            placeholder_history: "Comparta detalles sobre la historia, propietarios anteriores o estado de restauración...",
            section_asset: "El Activo",
            section_pedigree: "El Pedigrí",
            section_owner: "El Propietario",
            label_name: "Nombre Completo",
            label_email: "Correo Electrónico",
            label_phone: "Número Móvil",
            app_received_title: "Envío Recibido",
            app_received_desc: "Nuestro gestor de colección revisará los detalles de su coche y le contactará en 48 horas para una inspección.",
            return_site: "Volver al Sitio"
        },
        concierge: {
            header_requesting: "Solicitando",
            header_service: "Servicio Concierge",
            title: "Solicitud de Asignación",
            label_purpose: "Propósito",
            purpose_tour: "Gran Tour de Fin de Semana",
            purpose_cinema: "Producción Cinematográfica",
            purpose_wedding: "Evento Nupcial",
            purpose_other: "Otro",
            label_date: "Fecha Preferida",
            label_location: "Lugar de Entrega",
            placeholder_location: "ej. Hotel de Paris, Mónaco",
            btn_cancel: "Cancelar",
            btn_request: "Solicitar",
            success_title: "Solicitud Recibida",
            success_desc: "Nuestro concierge está verificando la disponibilidad de este chasis específico.",
            success_note: "Espere una respuesta personal en 60 min.",
            return_garage: "Volver al Garaje"
        },
        contact: {
            title: "Concierge",
            subtitle: "Personal",
            address_label: "Sede Central",
            address_lines: ["17 Avenue des Spélugues", "98000 Mónaco", "Principado de Mónaco"],
            direct_line: "Línea Directa",
            inquiries: "Consultas",
            form_name: "Nombre",
            form_email: "Correo",
            form_subject: "Asunto",
            form_message: "Mensaje",
            form_send: "Enviar Mensaje",
            subjects: {
                general: "Consulta General",
                wedding: "Cotización Nupcial",
                editorial: "Alianza Editorial / Cine",
                fleet: "Consultas de Colección"
            },
            description: "Para consultas sobre nuestra colección, bodas o servicios de chófer a medida, le invitamos a contactar con nuestra oficina privada.",
            form_surname: "Apellidos",
            placeholder_name: "Nombre",
            placeholder_surname: "Apellidos",
            placeholder_email: "correo@direccion.com",
            placeholder_message: "..."
        },
        footer: {
            rights: "Old Money Group. Todos los derechos reservados."
        }
    },

};
```

## File: src/index.css
```javascript
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap');
@import 'react-day-picker/dist/style.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer utilities {
  .bg-radial-gradient {
    background-image: radial-gradient(circle at center, var(--tw-gradient-from), var(--tw-gradient-to));
  }
}

@layer base {
  body {
    @apply bg-omg-green text-omg-cream antialiased selection:bg-omg-gold selection:text-omg-black;
    font-family: 'Lato', sans-serif;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    @apply font-serif;
  }
}

/* Smooth Scrolling */
html {
  scroll-behavior: smooth;
}

/* Fade In Animation Utility */
.animate-fade-in {
  animation: fadeIn 0.8s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Custom DayPicker overrides for Old Money theme */
.rdp {
  --rdp-cell-size: 40px;
  --rdp-accent-color: #4A5D23;
  /* omg-olive */
  --rdp-background-color: #F9F7F2;
  /* omg-cream */
  margin: 0;
}

.rdp-day_selected:not([disabled]) {
  background-color: #4A5D23;
  color: #F9F7F2;
}

.rdp-button:hover:not([disabled]):not(.rdp-day_selected) {
  background-color: #D4AF37;
  /* omg-gold hover */
  color: #2C2C2C;
}```


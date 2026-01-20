import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { format } from 'date-fns';
import { api } from '../../services/api';

const BookingWidget = () => {
    const { t } = useLanguage();

    // --- STATE ---
    const [fleet, setFleet] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedEra, setSelectedEra] = useState('icons'); // 'icons' | 'youngtimers'
    const [selectedCar, setSelectedCar] = useState(null); // For Modal
    const [isBookingOpen, setIsBookingOpen] = useState(false);

    // Booking Form State
    const [bookingDate, setBookingDate] = useState({ from: null, to: null });
    const [purpose, setPurpose] = useState('cinema'); // 'cinema' | 'wedding' | 'tour'
    const [clientName, setClientName] = useState('');
    const [clientEmail, setClientEmail] = useState('');
    const [submitting, setSubmitting] = useState(false);

    // --- EFFECTS ---
    useEffect(() => {
        loadFleet();
    }, []);

    const loadFleet = async () => {
        try {
            setLoading(true);
            const data = await api.fetchFleet();
            setFleet(data || []);
        } catch (error) {
            console.error("Failed to load fleet:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- DERIVED STATE ---
    const filteredCars = fleet.filter(car => car.era === selectedEra);

    // --- HANDLERS ---
    const handleEraChange = (era) => {
        setSelectedEra(era);
    };

    const openBookingModal = (car) => {
        setSelectedCar(car);
        setIsBookingOpen(true);
    };

    const closeBookingModal = () => {
        setIsBookingOpen(false);
        setSelectedCar(null);
        setBookingDate({ from: null, to: null });
        setClientName('');
        setClientEmail('');
    };

    const handleBookingSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            // Format dates for DATERANGE or simple text description
            const dateRange = bookingDate.from && bookingDate.to
                ? `[${format(bookingDate.from, 'yyyy-MM-dd')}, ${format(bookingDate.to, 'yyyy-MM-dd')}]`
                : null;

            await api.submitBookingRequest({
                car_id: selectedCar.id,
                client_name: clientName,
                client_email: clientEmail,
                dates: dateRange,
                purpose: purpose,
                status: 'pending'
            });

            // Simulate success UI (or show real success message)
            alert(t('booking.request_success') || `Request Sent for ${selectedCar?.name}`);
            closeBookingModal();
        } catch (error) {
            console.error('Booking Error:', error);
            alert('Failed to submit request. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };


    // --- RENDER HELPERS ---
    const EraTab = ({ id, label }) => (
        <button
            onClick={() => handleEraChange(id)}
            className={`pb-4 text-sm font-sans uppercase tracking-[0.2em] transition-all duration-500 relative ${selectedEra === id ? 'text-omg-black font-bold' : 'text-omg-black hover:opacity-70 font-medium'}`}
        >
            {label}
            {selectedEra === id && (
                <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 w-full h-[1px] bg-omg-gold"
                />
            )}
        </button>
    );

    return (
        <section id="booking-widget" className="py-32 px-6 md:px-12 bg-omg-cream/50 relative">
            <div className="absolute inset-0 bg-omg-cream"></div>

            <div className="relative z-10 max-w-7xl mx-auto w-full space-y-32">

                {/* HEADLINE & TABS */}
                <div className="flex flex-col md:flex-row justify-between items-end border-b border-omg-black/5 pb-10">
                    <div className="mb-10 md:mb-0">
                        <span className="block text-omg-gold font-sans text-xs uppercase tracking-[0.3em] my-4">
                            {t('booking.collection_title')}
                        </span>
                        <h2 className="text-5xl md:text-7xl font-serif text-omg-black leading-none">
                            {t('booking.curated_assets')}
                        </h2>
                    </div>

                    <div className="flex gap-12">
                        <EraTab id="icons" label={t('booking.era_icons')} />
                        <EraTab id="youngtimers" label={t('booking.era_youngtimers')} />
                    </div>
                </div>

                {/* CAR GRID */}
                {loading ? (
                    <div className="h-64 flex items-center justify-center text-omg-black/40 font-serif italic">
                        Retrieving Asset Data...
                    </div>
                ) : filteredCars.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-20">
                        {filteredCars.map((car) => (
                            <div
                                key={car.id}
                                className="group cursor-pointer"
                                onClick={() => openBookingModal(car)}
                            >
                                {/* Image Container */}
                                <div className="relative aspect-[4/3] overflow-hidden bg-omg-black/5 mb-8">
                                    <div className="absolute inset-0 bg-omg-black/0 group-hover:bg-omg-black/10 transition-colors duration-700 z-10"></div>
                                    <img
                                        src={car.image_url}
                                        alt={car.name || 'Car Image'}
                                        loading="lazy"
                                        style={{ objectPosition: 'center top' }} // Ensure top is preserved
                                        className="w-full h-full object-cover scale-[1.08] transform group-hover:scale-[1.15] transition-transform duration-[1.5s] ease-out" // Zoom in to push watermark out
                                    />

                                    {/* Status Badge */}
                                    <div className="absolute top-4 right-4 z-20">
                                        <div className={`px-4 py-2 font-sans text-[10px] uppercase tracking-widest backdrop-blur-md ${car.status === 'available'
                                            ? 'bg-omg-cream/90 text-omg-green'
                                            : 'bg-red-900/90 text-white'
                                            }`}>
                                            {car.status === 'available' ? t('booking.status_available') : t('booking.status_reserved')}
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-baseline">
                                        <h3 className="font-serif text-2xl text-omg-black group-hover:text-omg-gold transition-colors duration-300">
                                            {car.name}
                                        </h3>
                                        <span className="font-sans text-xs text-omg-black/40">{car.year}</span>
                                    </div>
                                    <p className="font-sans text-xs uppercase tracking-widest text-omg-black/60 pt-2 border-t border-omg-black/10">
                                        {car.tagline || t('booking.view_details')}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-48 flex items-center justify-center text-omg-black/40 font-serif italic border border-dashed border-omg-black/10">
                        No assets found in this era yet.
                    </div>
                )}
            </div>

            {/* BOOKING MODAL */}
            <AnimatePresence>
                {isBookingOpen && selectedCar && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    >
                        <div className="absolute inset-0 bg-omg-black/60 backdrop-blur-md" onClick={closeBookingModal}></div>

                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-omg-cream w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col md:flex-row"
                        >
                            {/* Close Button */}
                            <button onClick={closeBookingModal} className="absolute top-4 right-4 z-20 text-omg-black hover:text-omg-gold transition-colors">
                                <X size={24} />
                            </button>

                            {/* Left: Car Image & Info */}
                            <div className="md:w-5/12 bg-omg-green text-omg-cream p-10 flex flex-col justify-between relative overflow-hidden">
                                <div className="relative z-10 space-y-6">
                                    <div>
                                        <h3 className="font-serif text-4xl mb-2">{selectedCar.name}</h3>
                                        <p className="font-sans text-xs uppercase tracking-widest opacity-60">{selectedCar.year} • {t('booking.daily_rate')} €{selectedCar.daily_rate}</p>
                                    </div>
                                    <div className="w-full aspect-video bg-black/20 overflow-hidden">
                                        <img src={selectedCar.image_url} className="w-full h-full object-cover" alt={selectedCar.name} />
                                    </div>
                                    <p className="font-serif text-lg leading-relaxed opacity-80 italic">
                                        "{selectedCar.specs || selectedCar.tagline || 'A timeless classic.'}"
                                    </p>
                                </div>
                                <div className="mt-8 pt-8 border-t border-omg-cream/10">
                                    <p className="font-sans text-[10px] uppercase tracking-widest opacity-50 mb-2">{t('booking.conditions_title')}</p>
                                    <ul className="text-xs space-y-1 opacity-70">
                                        <li>• 25+ {t('booking.age_req')}</li>
                                        <li>• {t('booking.deposit_req')}</li>
                                    </ul>
                                </div>
                            </div>

                            {/* Right: Booking Form */}
                            <div className="md:w-7/12 p-10 bg-omg-cream">
                                <h4 className="font-serif text-2xl text-omg-black mb-8">{t('booking.request_allocation')}</h4>
                                <form onSubmit={handleBookingSubmit} className="space-y-6">
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-omg-black font-bold opacity-70">From</label>
                                            <div className="border border-omg-black/20 p-3 flex items-center justify-between cursor-pointer hover:border-omg-gold transition-colors">
                                                <input
                                                    type="date"
                                                    className="bg-transparent border-none outline-none w-full font-sans text-sm text-omg-black placeholder:text-omg-black/40"
                                                    onChange={(e) => setBookingDate({ ...bookingDate, from: new Date(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-omg-black font-bold opacity-70">To</label>
                                            <div className="border border-omg-black/20 p-3 flex items-center justify-between cursor-pointer hover:border-omg-gold transition-colors">
                                                <input
                                                    type="date"
                                                    className="bg-transparent border-none outline-none w-full font-sans text-sm text-omg-black placeholder:text-omg-black/40"
                                                    onChange={(e) => setBookingDate({ ...bookingDate, to: new Date(e.target.value) })}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase tracking-widest text-omg-black font-bold opacity-70">Experience Type</label>
                                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                                            {['cinema', 'wedding', 'tour', 'other'].map(opt => (
                                                <button
                                                    key={opt}
                                                    type="button"
                                                    onClick={() => setPurpose(opt)}
                                                    className={`py-3 text-[10px] uppercase tracking-widest border transition-all font-bold ${purpose === opt
                                                        ? 'bg-omg-gold text-white border-omg-gold'
                                                        : 'border-omg-black/20 text-omg-black/60 hover:border-omg-gold hover:text-omg-black'
                                                        }`}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-4 pt-4">
                                        <input
                                            type="text"
                                            placeholder={t('contact.placeholder_name')}
                                            value={clientName}
                                            onChange={(e) => setClientName(e.target.value)}
                                            required
                                            className="w-full border-b border-omg-black/20 py-2 bg-transparent outline-none focus:border-omg-gold font-sans text-sm text-omg-black placeholder:text-omg-black/40 transition-colors"
                                        />
                                        <input
                                            type="email"
                                            placeholder={t('contact.placeholder_email')}
                                            value={clientEmail}
                                            onChange={(e) => setClientEmail(e.target.value)}
                                            required
                                            className="w-full border-b border-omg-black/20 py-2 bg-transparent outline-none focus:border-omg-gold font-sans text-sm text-omg-black placeholder:text-omg-black/40 transition-colors"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-omg-black text-omg-gold py-4 mt-8 uppercase tracking-[0.2em] text-xs font-bold hover:bg-omg-gold hover:text-omg-black transition-colors flex items-center justify-center gap-4 disabled:opacity-50"
                                    >
                                        {submitting ? 'SENDING...' : t('booking.submit_request')} <ChevronRight size={14} />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default BookingWidget;

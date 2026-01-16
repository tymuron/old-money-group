import React, { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { Shield, TrendingUp, Key, UploadCloud, ChevronRight, Loader, X, Check } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { api } from '../../services/api';

const OwnerRegistry = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { t } = useLanguage();

    // File Upload State
    const [imageFile, setImageFile] = useState(null);
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        make_model: '',
        year: '',
        mileage: '',
        location: '',
        expected_yield: '',
        history: '',
        contact_name: '',
        email: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async () => {
        if (!formData.make_model || !formData.contact_name || !formData.email) {
            alert("Please fill in the required fields (Make, Name, Email).");
            return;
        }

        setIsSubmitting(true);
        try {
            await api.submitRegistryForm({
                make_model: formData.make_model,
                year: formData.year || 0,
                contact_info: `${formData.contact_name}\n${formData.email}\n${formData.phone}`,
                expected_yield: formData.expected_yield,
                status: 'new'
            }, imageFile); // Pass image file
            setFormSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Submission failed. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

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
        <section id="registry" className="py-32 bg-omg-green relative overflow-hidden">
            {/* Background Texture */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay pointer-events-none"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-omg-gold mb-6 block">
                        {t('registry.subtitle')}
                    </span>
                    <h2 className="font-serif text-5xl md:text-7xl text-omg-cream mb-8">
                        {t('registry.title')}
                    </h2>
                    <p className="font-serif text-xl text-omg-cream/70 leading-relaxed italic">
                        {t('registry.intro')}
                    </p>
                </div>

                {/* Benefits Grid - Dark & Gold Theme (Reverted) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="bg-omg-black/20 border border-omg-cream/5 p-10 text-center hover:bg-omg-black/40 hover:border-omg-gold/30 transition-all duration-300 group">
                            <div className="w-16 h-16 mx-auto mb-8 rounded-full border border-omg-gold/20 flex items-center justify-center text-omg-gold group-hover:bg-omg-gold group-hover:text-omg-black transition-all duration-300">
                                <benefit.icon size={24} strokeWidth={1} />
                            </div>
                            <h3 className="font-serif text-3xl text-omg-cream mb-4">
                                {t(benefit.titleKey)}
                            </h3>
                            <p className="font-sans text-xs leading-loose text-omg-cream/60 uppercase tracking-widest group-hover:text-omg-cream/80 transition-colors">
                                {t(benefit.descKey)}
                            </p>
                        </div>
                    ))}
                </div>

                {/* CTA - Gold Button */}
                <div className="text-center">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-omg-gold text-omg-black px-12 py-5 font-sans uppercase text-xs tracking-[0.25em] font-bold hover:bg-white transition-all hover:scale-105 shadow-2xl shadow-omg-black/50"
                    >
                        {t('registry.submit_btn')}
                    </button>
                    <p className="mt-8 font-serif text-sm text-omg-cream/40 italic">
                        Strictly confidential. Members only.
                    </p>
                </div>
            </div>

            {/* Submission Modal */}
            {isModalOpen && createPortal(
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 font-sans text-base antialiased">
                    <div className="absolute inset-0 bg-omg-green/95 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="relative bg-omg-green w-full max-w-4xl max-h-[90vh] shadow-2xl border border-omg-gold/20 flex flex-col overflow-hidden isolate"
                    >
                        {!formSubmitted ? (
                            <>
                                <div className="p-8 md:p-16 overflow-y-auto flex-1 overscroll-contain">
                                    <div className="text-center mb-16">
                                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-omg-gold block mb-2">Private Office Link</span>
                                        <h3 className="font-serif text-4xl text-omg-cream mb-4">{t('registry.modal_title')}</h3>
                                        <div className="w-20 h-[1px] bg-omg-cream/10 mx-auto"></div>
                                    </div>

                                    <div className="space-y-16">
                                        {/* Section 1: The Asset */}
                                        <div className="bg-omg-black/20 p-8 border border-omg-cream/5">
                                            <h4 className="font-serif text-2xl text-omg-cream mb-8 flex items-baseline justify-between">
                                                <span>{t('registry.section_asset')}</span>
                                                <span className="font-sans text-[10px] text-omg-cream/40 uppercase tracking-widest">Section 01</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_make')}</label>
                                                    <input name="make_model" onChange={handleChange} type="text" placeholder="e.g. 1988 Porsche 911 Turbo" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors placeholder:text-omg-cream/20" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_year')}</label>
                                                    <input name="year" onChange={handleChange} type="number" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_mileage')}</label>
                                                    <input name="mileage" onChange={handleChange} type="text" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_location')}</label>
                                                    <input name="location" onChange={handleChange} type="text" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_yield')}</label>
                                                    <input name="expected_yield" onChange={handleChange} type="text" placeholder="€" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 2: The Pedigree */}
                                        <div className="bg-omg-black/20 p-8 border border-omg-cream/5">
                                            <h4 className="font-serif text-2xl text-omg-cream mb-8 flex items-baseline justify-between">
                                                <span>{t('registry.section_pedigree')}</span>
                                                <span className="font-sans text-[10px] text-omg-cream/40 uppercase tracking-widest">Section 02</span>
                                            </h4>
                                            <div className="space-y-8">
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_history')}</label>
                                                    <textarea name="history" onChange={handleChange} rows="4" placeholder={t('registry.placeholder_history')} className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors placeholder:text-omg-cream/20 resize-none"></textarea>
                                                </div>

                                                {/* File Upload Section */}
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_photos')}</label>

                                                    <input
                                                        type="file"
                                                        ref={fileInputRef}
                                                        onChange={handleFileSelect}
                                                        accept="image/*"
                                                        className="hidden"
                                                    />

                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className={`border border-dashed transition-all cursor-pointer group p-10 text-center ${imageFile ? 'border-omg-gold bg-omg-gold/10' : 'border-omg-cream/20 bg-omg-black/10 hover:bg-omg-black/40 hover:border-omg-gold'}`}
                                                    >
                                                        {imageFile ? (
                                                            <>
                                                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-omg-gold text-omg-black flex items-center justify-center">
                                                                    <Check size={24} />
                                                                </div>
                                                                <span className="font-sans text-xs uppercase tracking-wider text-omg-gold block font-bold">{imageFile.name}</span>
                                                                <span className="text-[10px] text-omg-cream/40 mt-2 block">Click to change</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <UploadCloud className="w-8 h-8 text-omg-cream/40 mx-auto mb-4 group-hover:text-omg-gold transition-colors" />
                                                                <span className="font-sans text-xs uppercase tracking-wider text-omg-cream/60">{t('registry.drag_drop')}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Section 3: The Owner */}
                                        <div className="bg-omg-black/20 p-8 border border-omg-cream/5">
                                            <h4 className="font-serif text-2xl text-omg-cream mb-8 flex items-baseline justify-between">
                                                <span>{t('registry.section_owner')}</span>
                                                <span className="font-sans text-[10px] text-omg-cream/40 uppercase tracking-widest">Section 03</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="md:col-span-2 space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_name')}</label>
                                                    <input name="contact_name" onChange={handleChange} type="text" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_email')}</label>
                                                    <input name="email" onChange={handleChange} type="email" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-cream/60">{t('registry.label_phone')}</label>
                                                    <input name="phone" onChange={handleChange} type="tel" className="w-full bg-omg-black/40 border border-omg-cream/10 p-4 font-serif text-lg text-omg-cream focus:outline-none focus:border-omg-gold transition-colors" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Fixed Footer */}
                                <div className="p-8 border-t border-omg-cream/10 bg-omg-green z-20 flex justify-between items-center">
                                    <button onClick={() => setIsModalOpen(false)} className="text-xs font-sans uppercase tracking-widest text-omg-cream/40 hover:text-omg-cream transition-colors">{t('concierge.btn_cancel')}</button>
                                    <button onClick={handleSubmit} disabled={isSubmitting} className="bg-omg-gold text-omg-black px-10 py-5 font-sans text-xs uppercase tracking-[0.2em] font-bold hover:bg-white transition-colors flex items-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed">
                                        {isSubmitting ? <Loader className="animate-spin" size={14} /> : (
                                            <>
                                                {t('registry.submit_btn')}
                                                <ChevronRight size={14} />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="text-center py-20 px-8 flex flex-col items-center justify-center h-full bg-omg-green">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <span className="text-6xl mb-6 block drop-shadow-2xl">🍸</span>
                                </motion.div>
                                <h3 className="font-serif text-5xl text-omg-cream mb-6">{t('registry.app_received_title')}</h3>
                                <p className="font-sans text-sm text-omg-cream/70 leading-relaxed mb-12 max-w-md mx-auto">
                                    {t('registry.app_received_desc')}
                                </p>
                                <button onClick={() => setIsModalOpen(false)} className="text-xs font-sans uppercase tracking-widest border-b border-omg-cream/20 pb-1 hover:border-omg-cream text-omg-cream transition-colors">
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

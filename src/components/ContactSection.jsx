import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Check, Loader } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../services/api';

const ContactSection = () => {
    const { t } = useLanguage();

    // Form State
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        subject: 'General Inquiries',
        message: ''
    });
    const [status, setStatus] = useState('idle'); // idle | submitting | success | error

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            await api.submitContactMessage(formData);
            setStatus('success');
            setFormData({ full_name: '', email: '', subject: 'General Inquiries', message: '' });
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
        }
    };

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
                                            <Mail className="w-4 h-4 text-omg-gold" />
                                            <p className="text-base text-omg-cream/60">oldmoneygroupltd@gmail.com</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Form */}
                    <div className="md:w-7/12">
                        <motion.form
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="space-y-8 bg-white/5 p-8 md:p-12 border border-white/10 backdrop-blur-sm relative"
                        >
                            {status === 'success' ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-omg-green/90 p-8 text-center animate-in fade-in">
                                    <div className="w-16 h-16 rounded-full bg-omg-gold text-omg-black flex items-center justify-center mb-6">
                                        <Check size={32} />
                                    </div>
                                    <h3 className="font-serif text-3xl text-white mb-4">Message Sent</h3>
                                    <p className="text-omg-cream/60 font-sans">Our private office will be in touch shortly.</p>
                                    <button
                                        type="button"
                                        onClick={() => setStatus('idle')}
                                        className="mt-8 text-xs font-sans uppercase tracking-widest text-omg-gold border-b border-omg-gold/30 pb-1 hover:border-omg-gold transition-colors"
                                    >
                                        Send Another
                                    </button>
                                </div>
                            ) : null}

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_name')}</label>
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg"
                                    placeholder={t('contact.placeholder_name')}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_email')}</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg"
                                    placeholder={t('contact.placeholder_email')}
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.inquiries')}</label>
                                <select
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg appearance-none cursor-pointer"
                                >
                                    <option className="bg-omg-green" value="General Inquiries">{t('contact.subjects.general')}</option>
                                    <option className="bg-omg-green" value="Weddings">{t('contact.subjects.wedding')}</option>
                                    <option className="bg-omg-green" value="Editorial / Cinema">{t('contact.subjects.editorial')}</option>
                                    <option className="bg-omg-green" value="Collection Acquisition">{t('contact.subjects.fleet')}</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase tracking-widest text-omg-gold mb-2">{t('contact.form_message')}</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full bg-transparent border-b border-white/20 pb-2 text-white placeholder-white/20 focus:outline-none focus:border-omg-gold transition-colors font-sans text-lg resize-none"
                                    placeholder={t('contact.placeholder_message')}
                                ></textarea>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-omg-cream text-omg-green py-4 font-sans uppercase text-sm tracking-[0.2em] hover:bg-white transition-colors duration-300 font-bold flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {status === 'submitting' ? <Loader className="animate-spin" size={18} /> : t('contact.form_send')}
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

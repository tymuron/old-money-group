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
        <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
            {/* Left Panel: Brand & Atmosphere */}
            <div className="bg-omg-green relative flex flex-col justify-between p-12 md:p-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=2670&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-omg-green via-omg-green/80 to-transparent"></div>

                <div className="relative z-10">
                    <span className="font-sans text-xs uppercase tracking-[0.3em] text-omg-gold/80 block mb-4">Old Money Group</span>
                    <h1 className="font-serif text-5xl md:text-7xl text-omg-cream leading-none">
                        Legacy <br /> & Heritage.
                    </h1>
                </div>

                <div className="relative z-10">
                    <p className="font-serif text-omg-cream/60 italic text-lg leading-relaxed max-w-md">
                        "Curating the finest automotive icons for the discerning few. Access is a privilege."
                    </p>
                </div>
            </div>

            {/* Right Panel: Auth Form */}
            <div className="bg-omg-cream flex items-center justify-center p-8 md:p-20">
                <div className="w-full max-w-sm space-y-12">

                    <div className="space-y-2">
                        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-omg-black/40 block">Restricted Area</span>
                        <h2 className="font-serif text-4xl text-omg-black">Executive Login</h2>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-8">
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-red-50 border-l-2 border-red-900 p-4"
                            >
                                <p className="text-red-900 text-xs font-sans uppercase tracking-wider font-bold">Access Denied: {error}</p>
                            </motion.div>
                        )}

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-black/70">Email Identity</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-omg-black/5 text-omg-black p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-omg-gold transition-all duration-300 placeholder-omg-black/20"
                                    placeholder="Enter corporate email"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block font-sans text-[10px] uppercase tracking-widest font-bold text-omg-black/70">Access Code</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-omg-black/5 text-omg-black p-4 font-sans text-sm focus:outline-none focus:bg-white focus:ring-1 focus:ring-omg-gold transition-all duration-300 placeholder-omg-black/20"
                                    placeholder="••••••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-omg-black text-omg-gold py-5 font-sans text-xs uppercase tracking-[0.25em] font-bold hover:bg-omg-gold hover:text-omg-black transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-3">
                                {loading ? 'Verifying Credentials...' : 'Access Dashboard'}
                            </span>
                        </button>
                    </form>

                    <div className="flex items-center justify-between pt-8 border-t border-omg-black/5">
                        <a href="#/" className="font-sans text-[10px] uppercase tracking-widest text-omg-black/40 hover:text-omg-black transition-colors">Return to Site</a>
                        <span className="font-sans text-[10px] text-omg-black/20">Secured via Supabase</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

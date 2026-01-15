import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CarFront, FileText, Inbox, LogOut, Search, Bell } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const AdminLayout = ({ children }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                navigate('/admin/login');
            } else {
                setUser(session.user);
            }
        };

        checkAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) {
                navigate('/admin/login');
            } else {
                setUser(session.user);
            }
        });

        return () => subscription.unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/admin/login');
    };

    const navItems = [
        { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
        { label: 'Fleet Registry', path: '/admin/cars', icon: <CarFront size={20} /> },
        { label: 'Inbox', path: '/admin/inbox', icon: <Inbox size={20} /> },
        { label: 'Content', path: '/admin/content', icon: <FileText size={20} /> },
    ];

    return (
        <div className="flex h-screen bg-[#F9F7F2] text-omg-black font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-omg-green text-omg-cream flex flex-col shadow-2xl z-20">
                <div className="p-8 border-b border-omg-gold/20">
                    <h1 className="font-serif text-2xl tracking-wider text-omg-gold">OLD MONEY</h1>
                    <p className="text-[10px] uppercase tracking-[0.3em] opacity-60 mt-1">Admin Console</p>
                </div>

                <nav className="flex-1 py-8 space-y-2 px-4">
                    {navItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 group ${isActive
                                    ? 'bg-omg-gold text-omg-black font-bold shadow-lg'
                                    : 'hover:bg-white/5 hover:text-omg-gold text-gray-400'
                                    }`}
                            >
                                <span className={isActive ? 'text-omg-black' : 'group-hover:text-omg-gold'}>{item.icon}</span>
                                <span className="text-xs uppercase tracking-widest">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-omg-gold/20">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-300 hover:bg-red-900/20 rounded-lg transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="text-xs uppercase tracking-widest font-bold">Sign Out</span>
                    </button>
                    <div className="mt-4 px-4">
                        <p className="text-[10px] text-gray-500 font-mono">
                            Logged in as:<br />
                            <span className="text-omg-gold">{user?.email}</span>
                        </p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {/* Top Bar */}
                <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm z-10">
                    <div className="flex items-center text-gray-400 text-sm">
                        <span className="uppercase tracking-widest font-bold text-xs text-omg-green">
                            {navItems.find(i => i.path === location.pathname)?.label || 'Console'}
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="bg-gray-100 p-2 rounded-full text-gray-400">
                            <Bell size={18} />
                        </div>
                        <div className="w-8 h-8 rounded-full bg-omg-green border-2 border-omg-gold"></div>
                    </div>
                </header>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-8 relative">
                    <div className="max-w-6xl mx-auto pb-20">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;

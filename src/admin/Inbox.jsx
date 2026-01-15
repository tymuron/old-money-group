import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { format } from 'date-fns';
import { Mail, Check, Archive, Clock, AlertCircle } from 'lucide-react';

const Inbox = () => {
    const [activeTab, setActiveTab] = useState('bookings'); // 'bookings' | 'registry'
    const [bookings, setBookings] = useState([]);
    const [registrySubmissions, setRegistrySubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            if (activeTab === 'bookings') {
                const data = await api.fetchBookingRequests('pending');
                setBookings(data);
            } else {
                const data = await api.fetchRegistrySubmissions('new');
                setRegistrySubmissions(data);
            }
        } catch (err) {
            console.error(err);
            setError('Failed to fetch data.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async (id, newStatus, type) => {
        try {
            if (type === 'booking') {
                await api.updateBookingStatus(id, newStatus);
                setBookings(prev => prev.filter(b => b.id !== id));
            } else {
                await api.updateRegistryStatus(id, newStatus);
                setRegistrySubmissions(prev => prev.filter(r => r.id !== id));
            }
        } catch (err) {
            alert('Failed to update status');
        }
    };

    // --- RENDER HELPERS ---

    const TabButton = ({ id, label, count }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`pb-4 px-2 font-sans text-xs uppercase tracking-[0.2em] transition-all relative ${activeTab === id ? 'text-omg-green font-bold' : 'text-gray-400 hover:text-omg-green'
                }`}
        >
            {label}
            {activeTab === id && (
                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-omg-gold"></div>
            )}
        </button>
    );

    if (loading) return <div className="p-12 text-center text-gray-400 font-sans text-sm tracking-widest uppercase animate-pulse">Loading secure data...</div>;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex items-end justify-between border-b border-gray-200">
                <div className="flex gap-8">
                    <TabButton id="bookings" label="Access Requests" />
                    <TabButton id="registry" label="Asset Queue" />
                </div>
                <div className="pb-4 text-xs font-sans text-gray-400 uppercase tracking-widest">
                    {activeTab === 'bookings' ? bookings.length : registrySubmissions.length} Pending
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 border border-red-100 rounded text-sm flex items-center gap-2">
                    <AlertCircle size={16} />
                    {error}
                </div>
            )}

            {/* Bookings View */}
            {activeTab === 'bookings' && (
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="text-center py-20 text-gray-400 font-serif italic text-xl">No pending requests.</div>
                    ) : (
                        bookings.map((req) => (
                            <div key={req.id} className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-1 text-[10px] uppercase tracking-widest font-bold rounded ${req.purpose === 'cinema' ? 'bg-purple-100 text-purple-700' :
                                                req.purpose === 'wedding' ? 'bg-pink-100 text-pink-700' : 'bg-omg-green/10 text-omg-green'
                                            }`}>
                                            {req.purpose}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">{format(new Date(req.created_at), 'MMM dd, HH:mm')}</span>
                                    </div>
                                    <h3 className="font-serif text-xl text-omg-green mb-1">{req.client_name}</h3>
                                    <p className="text-sm text-gray-500 mb-2 font-sans">{req.client_email}</p>
                                    <div className="text-sm font-medium text-omg-black">
                                        Requesting: <span className="text-omg-gold">{req.cars?.name} ({req.cars?.year})</span>
                                    </div>
                                    {req.dates && <div className="text-xs text-gray-400 mt-1">Dates: {req.dates}</div>}
                                </div>

                                <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => window.location.href = `mailto:${req.client_email}`}
                                        className="p-3 text-omg-green hover:bg-omg-green/5 rounded-full transition-colors"
                                        title="Email Client"
                                    >
                                        <Mail size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(req.id, 'approved', 'booking')}
                                        className="p-3 text-green-600 hover:bg-green-50 rounded-full transition-colors"
                                        title="Mark Contacted / Approve"
                                    >
                                        <Check size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(req.id, 'rejected', 'booking')}
                                        className="p-3 text-gray-300 hover:bg-gray-100 rounded-full transition-colors"
                                        title="Archive"
                                    >
                                        <Archive size={18} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Registry View */}
            {activeTab === 'registry' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {registrySubmissions.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-400 font-serif italic text-xl">No pending asset submissions.</div>
                    ) : (
                        registrySubmissions.map((sub) => (
                            <div key={sub.id} className="bg-white p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-[10px] font-mono text-gray-400">{format(new Date(sub.created_at), 'dd MMM yyyy')}</span>
                                        <span className="w-2 h-2 rounded-full bg-omg-gold animate-pulse"></span>
                                    </div>
                                    <h3 className="font-serif text-2xl text-omg-green mb-2">{sub.make_model}</h3>
                                    <div className="space-y-2 mb-6 text-sm">
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                            <span className="text-gray-400">Year</span>
                                            <span>{sub.year}</span>
                                        </div>
                                        <div className="flex justify-between border-b border-gray-50 pb-1">
                                            <span className="text-gray-400">Yield</span>
                                            <span className="text-omg-green font-bold">{sub.expected_yield || 'N/A'}</span>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded text-xs text-gray-600 mb-4 line-clamp-3">
                                        {sub.contact_info}
                                    </div>
                                </div>

                                <div className="border-t border-gray-100 pt-4 flex justify-between items-center">
                                    <div className="text-xs text-gray-400 font-sans uppercase tracking-wider">Owner Action</div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleUpdateStatus(sub.id, 'contacted', 'registry')}
                                            className="text-xs bg-omg-green text-omg-cream px-3 py-2 uppercase tracking-wide hover:bg-omg-black transition-colors"
                                        >
                                            Process
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Inbox;

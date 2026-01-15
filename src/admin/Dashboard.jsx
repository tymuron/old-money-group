import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({ assets: 0, inquiries: 0, submissions: 0 });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                // Fetch all data in parallel
                const [cars, bookings, registry] = await Promise.all([
                    api.fetchAdminFleet(),
                    api.fetchBookingRequests('pending'),
                    api.fetchRegistrySubmissions('new')
                ]);

                setStats({
                    assets: cars?.length || 0,
                    inquiries: bookings?.length || 0,
                    submissions: registry?.length || 0
                });

                // Use bookings as "Recent Activity"
                setRecentActivity(bookings?.slice(0, 3) || []);
            } catch (error) {
                console.error("Dashboard load failed:", error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboardData();
    }, []);

    return (
        <div className="p-12 animate-fade-in">
            <header className="mb-12">
                <h2 className="font-serif text-4xl text-omg-green mb-2">Dashboard</h2>
                <p className="font-sans text-xs uppercase tracking-widest text-omg-green/60">System Overview</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Stat Card 1 */}
                <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Total Assets</span>
                    <h3 className="font-serif text-5xl text-omg-green">{loading ? '-' : stats.assets}</h3>
                </div>

                {/* Stat Card 2 */}
                <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Active Inquiries</span>
                    <h3 className="font-serif text-5xl text-omg-gold">{loading ? '-' : stats.inquiries}</h3>
                </div>

                {/* Stat Card 3 */}
                <div className="bg-white p-8 border border-omg-green/5 shadow-sm">
                    <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40 block mb-4">Pending Submissions</span>
                    <h3 className="font-serif text-5xl text-omg-green">{loading ? '-' : stats.submissions}</h3>
                </div>
            </div>

            <div className="mt-12 bg-white p-8 border border-omg-green/5 shadow-sm">
                <h3 className="font-serif text-2xl text-omg-green mb-6">Recent Activity</h3>
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-xs text-gray-400 font-sans uppercase tracking-widest">Loading Activity...</div>
                    ) : recentActivity.length === 0 ? (
                        <div className="text-sm text-gray-400 font-serif italic">No recent activity found.</div>
                    ) : (
                        recentActivity.map((item) => (
                            <div key={item.id} className="flex justify-between items-center border-b border-omg-green/5 pb-4 last:border-0">
                                <div>
                                    <p className="font-serif text-lg text-omg-green">New Booking Request</p>
                                    <p className="font-sans text-xs text-omg-green/50">{item.cars?.name || 'Asset'} • {item.client_name}</p>
                                </div>
                                <span className="font-sans text-[10px] uppercase tracking-widest text-omg-green/40">
                                    {new Date(item.created_at).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;

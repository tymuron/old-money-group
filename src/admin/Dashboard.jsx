import React from 'react';

const Dashboard = () => {
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
    );
};

export default Dashboard;

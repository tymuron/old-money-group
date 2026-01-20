import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Trash2, Plus, Loader, CarFront, Upload, Edit, Eye } from 'lucide-react';

const CarManager = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    // New Car Form State
    const [newCar, setNewCar] = useState({
        name: '',
        year: new Date().getFullYear(),
        era: 'icons',
        daily_rate: 0,
        status: 'available',
        tagline: '',
        specs: '',
        image_file: null
    });

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        setLoading(true);
        try {
            const data = await api.fetchAdminFleet();
            setCars(data || []);
        } catch (error) {
            console.error('Error fetching cars:', error);
            alert('Failed to load fleet data.');
        } finally {
            setLoading(false);
        }
    };

    const handleCarSubmit = async (e) => {
        e.preventDefault();
        setUploading(true);

        try {
            const carData = {
                name: newCar.name,
                year: newCar.year,
                era: newCar.era,
                daily_rate: newCar.daily_rate,
                status: newCar.status,
                tagline: newCar.tagline,
                specs: newCar.specs
            };

            await api.createCar(carData, newCar.image_file);

            setIsFormOpen(false);
            setNewCar({
                name: '', year: new Date().getFullYear(), era: 'icons',
                daily_rate: 0, status: 'available', tagline: '', specs: '', image_file: null
            });
            fetchCars();
            alert('Asset successfully inducted into fleet.');

        } catch (error) {
            console.error('Error:', error);
            alert('Error: ' + (error.message || 'Failed to create car'));
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to decommission this asset?')) return;
        try {
            await api.deleteCar(id);
            fetchCars();
        } catch (error) {
            console.error(error);
        } catch (error) {
            console.error(error);
            alert(`Error deleting car: ${error.message || error.details || 'Unknown error'}`);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await api.updateCar(id, { status: newStatus });
            fetchCars();
        } catch (error) {
            console.error(error);
            alert('Error updating status');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'available': return 'bg-green-50 text-green-700 border-green-200';
            case 'reserved': return 'bg-red-50 text-red-700 border-red-200';
            case 'maintenance': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
            default: return 'bg-gray-50 text-gray-600 border-gray-200';
        }
    };

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Action Bar */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-serif text-omg-black mb-2">Fleet Management</h2>
                    <p className="text-gray-500 text-sm font-sans max-w-lg">Manage the "Old Money" collection. Add new assets, update availability, or decommission vehicles.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(!isFormOpen)}
                    className="bg-omg-black text-omg-gold border border-omg-gold px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold flex items-center gap-3 hover:bg-omg-gold hover:text-omg-black transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                    <Plus size={16} /> {isFormOpen ? 'Cancel Entry' : 'New Asset'}
                </button>
            </div>

            {/* ADD CAR FORM */}
            {isFormOpen && (
                <div className="bg-white p-10 border border-gray-200 shadow-xl rounded-sm relative z-10 border-t-4 border-t-omg-gold">
                    <div className="mb-8 pb-4 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-serif text-xl text-omg-green">New Asset Entry</h3>
                        <span className="text-[10px] uppercase tracking-widest text-gray-400">Step 1 of 1</span>
                    </div>

                    <form onSubmit={handleCarSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Left Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Model Name</label>
                                    <input required type="text" className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all placeholder:text-gray-300"
                                        value={newCar.name} onChange={e => setNewCar({ ...newCar, name: e.target.value })} placeholder="e.g. Mercedes 190 SL" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Year</label>
                                        <input required type="number" className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all"
                                            value={newCar.year} onChange={e => setNewCar({ ...newCar, year: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Era</label>
                                        <div className="relative">
                                            <select className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all appearance-none"
                                                value={newCar.era} onChange={e => setNewCar({ ...newCar, era: e.target.value })}>
                                                <option value="icons">The Icons (Classics)</option>
                                                <option value="youngtimers">Youngtimers (90s-00s)</option>
                                            </select>
                                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">▼</div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Daily Rate (€)</label>
                                    <input required type="number" className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all"
                                        value={newCar.daily_rate} onChange={e => setNewCar({ ...newCar, daily_rate: e.target.value })} />
                                </div>
                            </div>

                            {/* Right Column */}
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Tagline</label>
                                    <input type="text" className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all placeholder:text-gray-300"
                                        value={newCar.tagline} onChange={e => setNewCar({ ...newCar, tagline: e.target.value })} placeholder="e.g. The Perfect Roadster" />
                                </div>
                                <div className="h-40">
                                    <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Photo</label>
                                    <div className="h-full border-2 border-dashed border-gray-200 hover:border-omg-gold/50 bg-gray-50 hover:bg-omg-gold/5 transition-all flex flex-col items-center justify-center text-gray-400 cursor-pointer relative group">
                                        <input type="file" accept="image/*" onChange={e => setNewCar({ ...newCar, image_file: e.target.files[0] })}
                                            className="absolute inset-0 opacity-0 cursor-pointer z-20" />
                                        <Upload size={32} className="mb-2 group-hover:text-omg-gold transition-colors" />
                                        <span className="text-xs uppercase tracking-widest font-bold group-hover:text-omg-black transition-colors">
                                            {newCar.image_file ? newCar.image_file.name : 'Drop image or Click'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Full Width */}
                            <div className="md:col-span-2">
                                <label className="block text-[10px] uppercase tracking-[0.2em] text-gray-400 mb-2 font-bold">Specs & Details</label>
                                <textarea className="w-full bg-gray-50 text-omg-black border border-gray-200 p-4 font-sans focus:bg-white focus:border-omg-gold focus:ring-1 focus:ring-omg-gold outline-none transition-all text-sm min-h-[100px]"
                                    value={newCar.specs} onChange={e => setNewCar({ ...newCar, specs: e.target.value })} placeholder="e.g. 0-100km/h in 5s, V8 Engine..." />
                            </div>
                        </div>

                        <div className="pt-8 border-t border-gray-100 flex justify-end gap-4">
                            <button type="button" onClick={() => setIsFormOpen(false)} className="px-8 py-4 uppercase tracking-[0.2em] text-xs font-bold text-gray-400 hover:text-omg-black transition-colors">
                                Cancel
                            </button>
                            <button disabled={uploading} type="submit" className="bg-omg-green text-white px-10 py-4 uppercase tracking-[0.2em] text-xs font-bold hover:bg-omg-black transition-all shadow-lg">
                                {uploading ? 'Processing...' : 'Save Asset'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* DATA TABLE */}
            {loading ? (
                <div className="flex flex-col items-center justify-center p-24 opacity-50">
                    <Loader className="animate-spin text-omg-gold mb-4" />
                    <span className="text-[10px] uppercase tracking-widest">Loading Fleet...</span>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 shadow-sm rounded-sm overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200 text-gray-400">
                                <th className="p-6 text-[9px] uppercase tracking-[0.2em] font-normal pl-8">Asset Profile</th>
                                <th className="p-6 text-[9px] uppercase tracking-[0.2em] font-normal">Classification</th>
                                <th className="p-6 text-[9px] uppercase tracking-[0.2em] font-normal">Daily Rate</th>
                                <th className="p-6 text-[9px] uppercase tracking-[0.2em] font-normal">Status</th>
                                <th className="p-6 text-[9px] uppercase tracking-[0.2em] font-normal text-right pr-8">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cars.map(car => (
                                <tr key={car.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="p-6 pl-8">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-12 bg-gray-200 rounded-sm overflow-hidden relative shadow-inner">
                                                {car.image_url ? (
                                                    <img src={car.image_url} alt={car.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300"><CarFront size={14} /></div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-serif font-bold text-lg text-omg-green leading-none mb-1">{car.name}</p>
                                                <p className="text-[10px] text-gray-400 font-sans tracking-wide uppercase">{car.year} • {car.tagline || 'No tagline'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-6 text-xs text-gray-500 font-medium capitalize">
                                        <span className="bg-gray-100 px-3 py-1 rounded-full text-[10px] uppercase tracking-wide text-gray-500">
                                            {car.era === 'icons' ? 'Classic Icon' : 'Youngtimer'}
                                        </span>
                                    </td>
                                    <td className="p-6 text-sm font-mono text-omg-gold font-bold">€{car.daily_rate}</td>
                                    <td className="p-6">
                                        <div className="relative inline-block">
                                            <select
                                                value={car.status}
                                                onChange={(e) => handleStatusUpdate(car.id, e.target.value)}
                                                className={`pl-3 pr-8 py-1.5 text-[9px] uppercase tracking-widest rounded-full border cursor-pointer appearance-none font-bold transition-all hover:brightness-95 focus:ring-2 focus:ring-offset-1 focus:ring-omg-gold/50 outline-none ${getStatusColor(car.status)}`}
                                            >
                                                <option value="available">Available</option>
                                                <option value="reserved">Reserved</option>
                                                <option value="maintenance">Service</option>
                                            </select>
                                            {/* Custom arrow for select */}
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 text-[8px]">▼</div>
                                        </div>
                                    </td>
                                    <td className="p-6 pr-8 text-right">
                                        <div className="flex items-center justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button className="p-2 text-gray-300 hover:text-omg-gold hover:bg-omg-gold/10 rounded-full transition-colors">
                                                <Eye size={16} />
                                            </button>
                                            <button className="p-2 text-gray-300 hover:text-omg-green hover:bg-omg-green/10 rounded-full transition-colors">
                                                <Edit size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(car.id)} className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {cars.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="p-24 text-center">
                                        <div className="flex flex-col items-center justify-center opacity-40">
                                            <CarFront size={48} className="text-gray-300 mb-4" />
                                            <p className="font-serif text-xl text-gray-400">The registry is currently empty.</p>
                                            <button onClick={() => setIsFormOpen(true)} className="text-omg-gold text-xs uppercase tracking-widest mt-4 hover:underline">Add First Asset</button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default CarManager;

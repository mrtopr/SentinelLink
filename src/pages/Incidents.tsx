import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Badge from '../components/ui/Badge';
import { type Incident } from '../data/mockData';
import {
    Search,
    MapPin,
    Calendar,
    ArrowBigUp,
    Share2,
    AlertCircle,
    Loader2,
    Filter,
    X
} from 'lucide-react';
import Button from '../components/ui/Button';
import { incidentApi } from '../api/incidents';

const Incidents: React.FC = () => {
    const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await incidentApi.getIncidents();
            setIncidents(data.data || []);
        } catch (err: any) {
            console.error('Error fetching incidents:', err);
            setError('Failed to load incidents. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpvote = async (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        try {
            await incidentApi.upvoteIncident(id);
            setIncidents(prev => prev.map(inc =>
                inc.id === id ? { ...inc, upvoteCount: (inc.upvoteCount || 0) + 1 } : inc
            ));

            // Also update selected incident if it's the one being upvoted
            if (selectedIncident?.id === id) {
                setSelectedIncident(prev => prev ? { ...prev, upvoteCount: (prev.upvoteCount || 0) + 1 } : null);
            }
        } catch (err) {
            console.error('Error upvoting:', err);
        }
    };

    const filteredIncidents = incidents.filter(incident =>
        (incident.incidentType || incident.type || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (incident.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow">
                <div className="container-custom py-8">
                    {/* Header & Search */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                        <div className="relative w-full max-w-2xl">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search for incidents by type or location..."
                                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                    <Filter className="w-4 h-4 text-gray-500" />
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <Button variant="secondary" size="sm" className="bg-white">
                                <Calendar className="w-4 h-4 mr-2" />
                                Latest
                            </Button>
                            <Link to="/map">
                                <Button variant="secondary" size="sm" className="bg-white">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    Near Me
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-8 bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertCircle className="w-5 h-5" />
                                <p className="font-medium">{error}</p>
                            </div>
                            <Button size="sm" variant="secondary" onClick={fetchIncidents}>Retry</Button>
                        </div>
                    )}

                    <div className="flex gap-8 relative">
                        {/* Grid Layout */}
                        <div className="flex-grow w-full">
                            {isLoading ? (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                                    <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                    <p className="text-gray-500 font-medium">Loading real-time incidents...</p>
                                </div>
                            ) : filteredIncidents.length > 0 ? (
                                <div className={`grid grid-cols-1 md:grid-cols-2 ${selectedIncident ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6 transition-all duration-300`}>
                                    {filteredIncidents.map((incident) => (
                                        <div
                                            key={incident.id}
                                            className={`bg-white rounded-2xl overflow-hidden border transition-all cursor-pointer group flex flex-col h-full
                                                ${selectedIncident?.id === incident.id ? 'border-primary ring-1 ring-primary shadow-lg ring-offset-2 scale-[0.98]' : 'border-gray-100 hover:border-primary/30 hover:shadow-xl hover:-translate-y-1'}
                                            `}
                                            onClick={() => setSelectedIncident(incident)}
                                        >
                                            <div className="relative h-48 sm:h-56 overflow-hidden bg-gray-100">
                                                {(incident.mediaUrl || incident.image) ? (
                                                    <img
                                                        src={incident.mediaUrl || incident.image}
                                                        alt={incident.incidentType || incident.type}
                                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <AlertCircle className="w-12 h-12 text-gray-200" />
                                                    </div>
                                                )}
                                                <div className="absolute top-4 left-4 flex gap-2">
                                                    <Badge label={incident.severity} type="severity" value={incident.severity} />
                                                </div>
                                            </div>

                                            <div className="p-6 space-y-4 flex-grow flex flex-col">
                                                <div className="flex justify-between items-start mb-4">
                                                    <div className="flex items-center gap-3">
                                                        <Badge label={incident.severity} type="severity" value={incident.severity} />
                                                        <Badge label={incident.status} type="status" value={incident.status} />
                                                    </div>
                                                    <div className="flex items-center gap-1 text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                                                        <Calendar className="w-3.5 h-3.5" />
                                                        <span className="text-[10px] font-bold uppercase tracking-wider">
                                                            {new Date(incident.createdAt || incident.reportedAt).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">
                                                    {incident.incidentType || incident.type}
                                                </h3>
                                                <p className="text-gray-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                                                    {incident.description}
                                                </p>

                                                <div className="flex flex-col gap-3 py-6 border-t border-gray-50 mt-auto">
                                                    <div className="flex items-center gap-2 text-gray-600 font-semibold text-sm">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        {incident.location}
                                                    </div>
                                                </div>

                                                <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                                    <div className="flex items-center gap-4">
                                                        <button
                                                            onClick={(e) => handleUpvote(e, incident.id)}
                                                            className="flex items-center gap-1.5 text-gray-400 hover:text-primary transition-all hover:scale-105 active:scale-95 group/btn"
                                                        >
                                                            <div className="p-1.5 rounded-lg group-hover/btn:bg-primary/10 transition-colors">
                                                                <ArrowBigUp className="w-5 h-5 fill-current" />
                                                            </div>
                                                            <span className="text-xs font-black tracking-widest">{incident.upvoteCount ?? 0}</span>
                                                        </button>
                                                        <button className="flex items-center gap-1.5 text-gray-400 hover:text-blue-500 transition-all group/btn">
                                                            <div className="p-1.5 rounded-lg group-hover/btn:bg-blue-50 transition-colors">
                                                                <Share2 className="w-4 h-4" />
                                                            </div>
                                                        </button>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-primary font-black uppercase tracking-widest text-[10px]"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedIncident(incident);
                                                        }}
                                                    >
                                                        Full Report
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 space-y-4 text-center">
                                    <div className="bg-gray-100 p-6 rounded-full">
                                        <Search className="w-12 h-12 text-gray-400" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold text-gray-900">No incidents found</h3>
                                        <p className="text-gray-500">Try adjusting your search or filters.</p>
                                    </div>
                                    <Button variant="secondary" onClick={() => setSearchTerm('')}>Clear Search</Button>
                                </div>
                            )}
                        </div>

                        {/* Side Panel */}
                        {selectedIncident && (
                            <div className="hidden lg:block w-[450px] shrink-0 sticky top-24 h-[calc(100vh-8rem)]">
                                <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl h-full flex flex-col animate-in slide-in-from-right-8 duration-300">
                                    <div className="p-6 border-b border-gray-50 flex justify-between items-center">
                                        <h2 className="text-xl font-bold text-gray-900">{selectedIncident.incidentType || selectedIncident.type}</h2>
                                        <button
                                            onClick={() => setSelectedIncident(null)}
                                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                        >
                                            <X className="w-5 h-5 text-gray-500" />
                                        </button>
                                    </div>

                                    <div className="overflow-y-auto flex-grow">
                                        <div className="p-6 space-y-6">
                                            <div className="rounded-xl overflow-hidden aspect-video shadow-inner bg-gray-100">
                                                {(selectedIncident.mediaUrl || selectedIncident.image) ? (
                                                    <img
                                                        src={selectedIncident.mediaUrl || selectedIncident.image}
                                                        alt={selectedIncident.incidentType || selectedIncident.type}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <AlertCircle className="w-12 h-12 text-gray-200" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-6">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Location:</label>
                                                    <div className="flex items-center gap-2 text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100 italic">
                                                        <MapPin className="w-4 h-4 text-primary" />
                                                        {selectedIncident.location}
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Severity:</label>
                                                        <Badge label={selectedIncident.severity} type="severity" value={selectedIncident.severity} className="w-full justify-center py-2 text-sm" />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Status:</label>
                                                        <Badge label={selectedIncident.status} type="status" value={selectedIncident.status} className="w-full justify-center py-2 text-sm" />
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Description:</label>
                                                    <p className="text-gray-600 leading-relaxed text-sm bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200">
                                                        {selectedIncident.description}
                                                    </p>
                                                </div>

                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-2">Reported At:</label>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {new Date(selectedIncident.createdAt || selectedIncident.reportedAt).toLocaleString()}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 border-t border-gray-50 mt-auto bg-gray-50/30 rounded-b-2xl">
                                        <Button fullWidth onClick={(e) => handleUpvote(e as any, selectedIncident.id)}>Upvote Incident</Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Incidents;

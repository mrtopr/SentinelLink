import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { io, Socket } from 'socket.io-client';
import { incidentApi } from '../../api/incidents';
import type { Incident } from '../../data/mockData';
import IncidentMarker from './IncidentMarker';
import MapFilters, { type MapFilterState } from './MapFilters';
import { Loader2, Navigation } from 'lucide-react';

// Default center (New Delhi for example, or a neutral location)
const DEFAULT_CENTER = { lat: 28.6139, lng: 77.2090 };

// Haversine formula to calculate distance in km
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
}

// Component to recenter map when user location changes
const RecenterMap = ({ lat, lng }: { lat: number, lng: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], 13);
    }, [lat, lng, map]);
    return null;
};

// Component to fit bounds of all markers
const AutoFitBounds = ({ incidents }: { incidents: Incident[] }) => {
    const map = useMap();

    useEffect(() => {
        if (incidents.length > 0) {
            const group = new L.FeatureGroup(
                incidents
                    .filter(i => i.latitude && i.longitude)
                    .map(i => L.marker([Number(i.latitude), Number(i.longitude)]))
            );
            const bounds = group.getBounds();
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
            }
        }
    }, [incidents, map]);

    return null;
};

const IncidentMap: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<MapFilterState>({
        radius: 50,
        severity: ['HIGH', 'MEDIUM', 'LOW'],
        type: 'ALL'
    });
    const [socketConnected, setSocketConnected] = useState(false);

    // Initial Data Fetch
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await incidentApi.getIncidents();
                setIncidents(response.data || []);
            } catch (error) {
                console.error('Failed to load incidents:', error);
            } finally {
                setIsLoading(false);
            }
        };

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude
                    });
                },
                (error) => {
                    console.log('Location access denied, using default center', error);
                }
            );
        }

        loadData();
    }, []);

    // Socket.IO Connection
    useEffect(() => {
        const socketUrl = import.meta.env.VITE_API_BASE_URL
            ? import.meta.env.VITE_API_BASE_URL.replace('/api', '')
            : 'http://localhost:3001';

        const socket: Socket = io(socketUrl, {
            withCredentials: true,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connected to socket server');
            setSocketConnected(true);
        });

        socket.on('incident:new', (newIncident: any) => {
            // Backend sends { type: 'incident:new', data: Incident } or just Incident
            const incident = newIncident.data || newIncident;
            console.log('New Incident received:', incident);
            setIncidents((prev) => [incident, ...prev]);
        });

        socket.on('incident:update', (updatedIncident: any) => {
            const incident = updatedIncident.data || updatedIncident;
            console.log('Incident update received:', incident);
            setIncidents((prev) =>
                prev.map((inc) => inc.id === incident.id ? incident : inc)
            );
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    // Filtering Logic
    const filteredIncidents = useMemo(() => {
        return incidents.filter((incident) => {
            // Type Filter
            if (filters.type !== 'ALL' && incident.incidentType !== filters.type && incident.type !== filters.type) {
                return false;
            }

            // Severity Filter
            if (!filters.severity.includes(incident.severity)) {
                return false;
            }

            // Radius Filter
            if (userLocation) {
                const dist = getDistanceFromLatLonInKm(
                    userLocation.lat,
                    userLocation.lng,
                    incident.latitude,
                    incident.longitude
                );
                if (dist > filters.radius) {
                    return false;
                }
            }

            return true;
        });
    }, [incidents, filters, userLocation]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-medium">Initializing Map System...</p>
            </div>
        );
    }

    const center = userLocation || DEFAULT_CENTER;

    return (
        <div className="relative h-full w-full bg-gray-100 overflow-hidden">
            {/* Map Filters UI */}
            <MapFilters filters={filters} onChange={setFilters} />

            {/* Live Indicator */}
            <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-md border border-gray-100 flex items-center gap-2">
                <div className={`w-2.5 h-2.5 rounded-full ${socketConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
                <span className="text-xs font-bold text-gray-700">
                    {socketConnected ? 'LIVE FEED ACTIVE' : 'CONNECTING...'}
                </span>
            </div>

            <MapContainer
                center={[center.lat, center.lng]}
                zoom={13}
                className="w-full h-full z-0"
                scrollWheelZoom={true}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Markers */}
                {filteredIncidents.map((incident) => (
                    incident.latitude && incident.longitude ? (
                        <IncidentMarker key={incident.id} incident={incident} />
                    ) : null
                ))}

                {/* Auto Fit Bounds */}
                {filteredIncidents.length > 0 && <AutoFitBounds incidents={filteredIncidents} />}

                {/* User Location Marker */}
                {userLocation && (
                    <RecenterMap lat={userLocation.lat} lng={userLocation.lng} />
                )}
            </MapContainer>

            {/* Recenter Button */}
            {userLocation && (
                <button
                    onClick={() => {
                        // Reset view logic could be added here by exposing map instance
                        // For now, this is visual or handled by RecenterMap on prop change
                    }}
                    className="absolute bottom-6 right-6 z-[1000] p-3 bg-white rounded-full shadow-xl hover:bg-gray-50 transition-colors"
                >
                    <Navigation className="w-6 h-6 text-primary" />
                </button>
            )}
        </div>
    );
};

export default IncidentMap;

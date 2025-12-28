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
import { useSearchParams } from 'react-router-dom';

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

// Component to recenter map when user location changes or incident is selected
const RecenterMap = ({ lat, lng, zoom = 13 }: { lat: number, lng: number, zoom?: number }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);
    return null;
};

// Component to fit bounds of all markers
const AutoFitBounds = ({ incidents, disabled }: { incidents: Incident[], disabled: boolean }) => {
    const map = useMap();

    useEffect(() => {
        if (!disabled && incidents.length > 0) {
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
    }, [incidents, map, disabled]);

    return null;
};

const IncidentMap: React.FC = () => {
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
    const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number, zoom: number } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState<MapFilterState>({
        radius: 50,
        severity: ['HIGH', 'MEDIUM', 'LOW'],
        type: 'ALL'
    });
    const [socketConnected, setSocketConnected] = useState(false);
    const [searchParams] = useSearchParams();
    const highlightId = searchParams.get('incidentId');

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

        // Get User Location - only if no specific incident is highlighted
        if (!highlightId && navigator.geolocation) {
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
    }, [highlightId]);

    // Handle Deep Linking / Highlighting
    useEffect(() => {
        if (highlightId && incidents.length > 0) {
            const targetedIncident = incidents.find(i => i.id === highlightId);
            if (targetedIncident && targetedIncident.latitude && targetedIncident.longitude) {
                setMapCenter({
                    lat: targetedIncident.latitude,
                    lng: targetedIncident.longitude,
                    zoom: 16 // Higher zoom to highlight
                });
            }
        }
    }, [highlightId, incidents]);


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

            // If highlighting a specific incident, bypass filters for that incident
            if (highlightId && incident.id === highlightId) {
                return true;
            }

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
    }, [incidents, filters, userLocation, highlightId]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
                <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
                <p className="text-gray-500 font-medium">Initializing Map System...</p>
            </div>
        );
    }

    // Determine initial center: highlight target > mapCenter state > userLocation > global default
    const centerLat = mapCenter?.lat || userLocation?.lat || DEFAULT_CENTER.lat;
    const centerLng = mapCenter?.lng || userLocation?.lng || DEFAULT_CENTER.lng;
    const initialZoom = mapCenter?.zoom || 13;

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
                center={[centerLat, centerLng]}
                zoom={initialZoom}
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
                        <IncidentMarker
                            key={incident.id}
                            incident={incident}
                            isHighlighted={highlightId === incident.id}
                        />
                    ) : null
                ))}

                {/* Auto Fit Bounds - Only if NO specific highlight and NO override center */}
                {filteredIncidents.length > 0 && !highlightId && !mapCenter && <AutoFitBounds incidents={filteredIncidents} disabled={!!highlightId} />}

                {/* Recenter Map Logic */}
                {(mapCenter || userLocation) && (
                    <RecenterMap
                        lat={mapCenter?.lat || userLocation?.lat || DEFAULT_CENTER.lat}
                        lng={mapCenter?.lng || userLocation?.lng || DEFAULT_CENTER.lng}
                        zoom={mapCenter?.zoom || 13}
                    />
                )}
            </MapContainer>

            {/* Recenter Button */}
            {userLocation && (
                <button
                    onClick={() => {
                        setMapCenter(null); // Clear manual center to snap back to user flow
                        // The userLocation effect in RecenterMap will take over if we pass it
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

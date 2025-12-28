import React from 'react';
import { Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import type { Incident } from '../../data/mockData';
import { AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { renderToString } from 'react-dom/server';

interface IncidentMarkerProps {
    incident: Incident;
}

const IncidentMarker: React.FC<IncidentMarkerProps> = ({ incident }) => {
    // Determine color based on severity
    const getColor = (severity: string) => {
        switch (severity.toUpperCase()) {
            case 'HIGH': return 'text-red-600 bg-red-100 border-red-600';
            case 'MEDIUM': return 'text-yellow-600 bg-yellow-100 border-yellow-600';
            case 'LOW': return 'text-green-600 bg-green-100 border-green-600';
            default: return 'text-gray-600 bg-gray-100 border-gray-600';
        }
    };

    // Determine opacity/style based on status
    const getStatusStyle = (status: string) => {
        switch (status.toUpperCase()) {
            case 'UNVERIFIED': return 'opacity-60';
            case 'RESOLVED': return 'grayscale opacity-50';
            case 'VERIFIED': return 'opacity-100';
            default: return 'opacity-100';
        }
    };

    // Create custom icon
    const createCustomIcon = () => {
        const colorClass = getColor(incident.severity);
        const statusClass = getStatusStyle(incident.status);

        // Render Lucide icon to string
        const iconHtml = renderToString(
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all transform hover:scale-110 ${colorClass} ${statusClass}`}>
                <AlertTriangle className="w-5 h-5" />
            </div>
        );

        return L.divIcon({
            html: iconHtml,
            className: 'bg-transparent', // Remove default leaflet background
            iconSize: [32, 32],
            iconAnchor: [16, 32],
            popupAnchor: [0, -32]
        });
    };

    return (
        <Marker position={[incident.latitude, incident.longitude]} icon={createCustomIcon()}>
            <Popup className="incident-popup">
                <div className="p-1 min-w-[200px]">
                    <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${incident.severity === 'HIGH' ? 'bg-red-100 text-red-700' :
                            incident.severity === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-green-100 text-green-700'
                            }`}>
                            {incident.severity}
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                            {new Date(incident.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>

                    <h3 className="font-bold text-gray-900 mb-1">{incident.incidentType || incident.type}</h3>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{incident.description}</p>

                    <div className="flex items-center gap-2 pt-2 border-t border-gray-100 mt-2">
                        {incident.status === 'VERIFIED' ? (
                            <div className="flex items-center gap-1 text-blue-600 text-xs font-bold">
                                <CheckCircle className="w-3 h-3" /> Verified
                            </div>
                        ) : incident.status === 'RESOLVED' ? (
                            <div className="flex items-center gap-1 text-gray-500 text-xs font-bold">
                                <CheckCircle className="w-3 h-3" /> Resolved
                            </div>
                        ) : (
                            <div className="flex items-center gap-1 text-orange-500 text-xs font-bold">
                                <Info className="w-3 h-3" /> Unverified
                            </div>
                        )}
                    </div>
                </div>
            </Popup>
        </Marker>
    );
};

export default IncidentMarker;

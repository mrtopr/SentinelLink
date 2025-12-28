
import { Flame, Ambulance, Car, Megaphone, CloudLightning, AlertTriangle, Droplets, Zap, Eye, HelpCircle } from 'lucide-react';

export const INCIDENT_TYPES = [
    { value: 'FIRE', label: 'Fire Outbreak', icon: Flame },
    { value: 'MEDICAL', label: 'Medical Emergency', icon: Ambulance },
    { value: 'ACCIDENT', label: 'Vehicle Accident', icon: Car },
    { value: 'FLOOD', label: 'Water Leak / Flood', icon: Droplets },
    { value: 'PUBLIC_DISTURBANCE', label: 'Crowd Disturbance', icon: Megaphone },
    { value: 'INFRASTRUCTURE', label: 'Route Hazard', icon: AlertTriangle },
    { value: 'POWER_OUTAGE', label: 'Power Outage', icon: Zap },
    { value: 'NATURAL_DISASTER', label: 'Natural Disaster', icon: CloudLightning },
    { value: 'SUSPICIOUS', label: 'Suspicious Activity', icon: Eye },
    { value: 'OTHER', label: 'Other', icon: HelpCircle },
];

export const INCIDENT_TYPE_LABELS = INCIDENT_TYPES.reduce((acc, curr) => {
    acc[curr.value] = curr.label;
    return acc;
}, {} as Record<string, string>);

export const INCIDENT_TYPE_ICONS = INCIDENT_TYPES.reduce((acc, curr) => {
    acc[curr.value] = curr.icon;
    return acc;
}, {} as Record<string, any>);

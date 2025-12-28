import React from 'react';
import { Filter, Activity } from 'lucide-react';
import { INCIDENT_TYPES, INCIDENT_TYPE_ICONS } from '../../constants/incidents';

export interface MapFilterState {
    radius: number; // in km
    severity: string[]; // 'HIGH', 'MEDIUM', 'LOW'
    type: string; // 'ALL' or specific type
}

interface MapFiltersProps {
    filters: MapFilterState;
    onChange: (filters: MapFilterState) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ filters, onChange }) => {

    const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...filters, radius: parseInt(e.target.value) });
    };

    const handleSeverityToggle = (level: string) => {
        const current = filters.severity;
        const next = current.includes(level)
            ? current.filter(l => l !== level)
            : [...current, level];
        onChange({ ...filters, severity: next });
    };

    const handleTypeChange = (type: string) => {
        onChange({ ...filters, type });
    };

    return (
        <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 w-72 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center gap-2 mb-4 text-gray-800 border-b border-gray-100 pb-2">
                <Filter className="w-4 h-4 text-primary" />
                <h3 className="font-bold text-sm uppercase tracking-wider">Filters</h3>
            </div>

            {/* Radius Filter */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-bold text-gray-500">Radius</label>
                    <span className="text-xs font-bold text-primary">{filters.radius} km</span>
                </div>
                <input
                    type="range"
                    min="1"
                    max="50"
                    value={filters.radius}
                    onChange={handleRadiusChange}
                    className="w-full text-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                    <span>1km</span>
                    <span>50km</span>
                </div>
            </div>

            {/* Severity Filter */}
            <div className="mb-6">
                <label className="text-xs font-bold text-gray-500 block mb-3">Severity</label>
                <div className="flex flex-wrap gap-2">
                    {['HIGH', 'MEDIUM', 'LOW'].map((level) => (
                        <button
                            key={level}
                            onClick={() => handleSeverityToggle(level)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${filters.severity.includes(level)
                                ? level === 'HIGH' ? 'bg-red-50 text-red-600 border-red-200 shadow-sm'
                                    : level === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 border-yellow-200 shadow-sm'
                                        : 'bg-green-50 text-green-600 border-green-200 shadow-sm'
                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                }`}
                        >
                            {level}
                        </button>
                    ))}
                </div>
            </div>

            {/* Type Filter */}
            <div>
                <label className="text-xs font-bold text-gray-500 block mb-3">Incident Type</label>
                <div className="space-y-1">
                    <button
                        key="ALL"
                        onClick={() => handleTypeChange('ALL')}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${filters.type === 'ALL'
                            ? 'bg-primary/5 text-primary font-bold'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Activity className="w-4 h-4" />
                        All Incidents
                    </button>
                    {INCIDENT_TYPES.map((type) => {
                        const Icon = INCIDENT_TYPE_ICONS[type.value];
                        return (
                            <button
                                key={type.value}
                                onClick={() => handleTypeChange(type.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${filters.type === type.value
                                    ? 'bg-primary/5 text-primary font-bold'
                                    : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {type.label}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MapFilters;

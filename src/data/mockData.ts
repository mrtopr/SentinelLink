export interface AdminNote {
    id: string;
    note: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
    };
}

export interface Incident {
    id: string;
    incidentType: string;
    type?: string; // For backward compatibility or UI display
    severity: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'REPORTED' | 'VERIFIED' | 'IN_PROGRESS' | 'RESOLVED' | 'FLAGGED';
    description: string;
    latitude: number;
    longitude: number;
    location: string;
    reportedAt: string;
    createdAt: string;
    updatedAt: string;
    mediaUrl?: string; // Backend uses mediaUrl
    image?: string; // UI uses image
    upvoteCount: number;
    upvotes?: number; // UI uses upvotes
    adminNotes?: AdminNote[];
}

export const mockIncidents: Incident[] = [
    {
        id: 'INC001',
        incidentType: 'Fire',
        severity: 'HIGH',
        status: 'REPORTED',
        description: 'Large structure fire reported at downtown office complex. Fire crews are on scene. Please avoid the area.',
        location: '123 Main St, Downtown',
        latitude: 40.7128,
        longitude: -74.0060,
        reportedAt: '2023-10-26 14:30',
        createdAt: '2023-10-26T14:30:00Z',
        updatedAt: '2023-10-26T14:30:00Z',
        image: 'https://images.unsplash.com/photo-1541447271487-09612b3f49f7?q=80&w=1000&auto=format&fit=crop',
        upvoteCount: 12,
    },
    {
        id: 'INC002',
        incidentType: 'Medical Emergency',
        severity: 'HIGH',
        status: 'IN_PROGRESS',
        description: 'Multi-vehicle accident with reported injuries. Emergency services are providing assistance.',
        location: 'Broadway & 5th Ave',
        latitude: 40.7128,
        longitude: -74.0060,
        reportedAt: '2023-10-26 15:05',
        createdAt: '2023-10-26T15:05:00Z',
        updatedAt: '2023-10-26T15:05:00Z',
        image: 'https://images.unsplash.com/photo-1587019158091-1a103c5dd17f?q=80&w=1000&auto=format&fit=crop',
        upvoteCount: 8,
    }
];

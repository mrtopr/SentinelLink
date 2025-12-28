import React from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import IncidentMap from '../components/map/IncidentMap';

const MapView: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Navbar />

            <main className="flex-grow relative h-[calc(100vh-64px)] w-full">
                <IncidentMap />
            </main>

            <Footer />
        </div>
    );
};

export default MapView;

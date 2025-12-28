import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import Button from '../components/ui/Button';
import { Camera, MapPin, Navigation, Send, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { incidentApi } from '../api/incidents';

const ReportIncident: React.FC = () => {
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLocating, setIsLocating] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        type: '',
        severity: 'Medium',
        location: '',
        description: '',
    });
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleDetectLocation = () => {
        setIsLocating(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    setFormData(prev => ({ ...prev, location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}` }));
                    setIsLocating(false);
                },
                (err) => {
                    console.error('Location error:', err);
                    setFormData(prev => ({ ...prev, location: '37.7749° N, 122.4194° W (Manual)' }));
                    setIsLocating(false);
                }
            );
        } else {
            setIsLocating(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.type || !formData.location || !formData.description) {
            setError('Please fill in all required fields.');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const data = new FormData();

            // Map UI types to backend enum values
            const typeMapping: Record<string, string> = {
                'Fire': 'FIRE',
                'Flood': 'FLOOD',
                'Traffic Accident': 'ACCIDENT',
                'Medical Emergency': 'MEDICAL',
                'Public Safety': 'CRIME',
                'Infrastructure': 'INFRASTRUCTURE',
                'Other': 'OTHER'
            };

            const incidentType = typeMapping[formData.type] || formData.type.toUpperCase();
            data.append('incidentType', incidentType);
            data.append('severity', formData.severity.toUpperCase());
            data.append('description', formData.description);

            // Parse location format: "latitude, longitude"
            const [lat, lng] = formData.location.split(',').map(s => s.trim());
            if (lat && lng) {
                data.append('latitude', lat);
                data.append('longitude', lng);
            } else {
                // Fallback or validation error if format is wrong
                throw new Error('Invalid location format. Please use "Lat, Lng".');
            }

            if (selectedFile) {
                data.append('media', selectedFile);
            }

            await incidentApi.createIncident(data);
            setIsSuccess(true);
            setTimeout(() => navigate('/incidents'), 2000);
        } catch (err: any) {
            console.error('Submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="flex-grow flex items-center justify-center p-4">
                    <div className="bg-white p-12 rounded-[3rem] shadow-2xl border border-gray-100 max-w-lg w-full text-center space-y-6 animate-in zoom-in duration-500">
                        <div className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-gray-900">Report Submitted!</h1>
                            <p className="text-gray-500 font-medium font-sans">Thank you for helping keep the community safe. Redirecting you to the live feed...</p>
                        </div>
                        <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
            <Navbar />

            <main className="flex-grow py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-primary px-8 py-10 text-white relative">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50" />
                            <div className="relative z-10 space-y-2">
                                <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">
                                    <AlertTriangle className="w-3.5 h-3.5" />
                                    Urgent Platform
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Report an Incident</h1>
                                <p className="text-primary-light/80 text-sm max-w-md">
                                    Provide detailed information to help citizens and authorities coordinate efficiently.
                                </p>
                            </div>
                        </div>

                        {error && (
                            <div className="mx-8 mt-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-xl text-sm font-medium flex items-center gap-3">
                                <AlertTriangle className="w-5 h-5 shrink-0" />
                                {error}
                            </div>
                        )}

                        <form className="p-8 md:p-12 space-y-8" onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Incident Type
                                        </label>
                                        <select
                                            className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none text-gray-700 cursor-pointer"
                                            value={formData.type}
                                            onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select an option...</option>
                                            <option value="Fire">Fire</option>
                                            <option value="Flood">Flood</option>
                                            <option value="Traffic Accident">Traffic Accident</option>
                                            <option value="Medical Emergency">Medical Emergency</option>
                                            <option value="Public Safety">Public Safety</option>
                                            <option value="Infrastructure">Infrastructure</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Severity Level
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {['Low', 'Medium', 'High'].map((level) => (
                                                <button
                                                    type="button"
                                                    key={level}
                                                    onClick={() => setFormData(prev => ({ ...prev, severity: level }))}
                                                    className={`py-3 px-4 rounded-xl border-2 text-sm font-bold transition-all ${formData.severity === level
                                                        ? 'border-primary bg-primary/5 text-primary'
                                                        : 'border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-200'
                                                        }`}
                                                >
                                                    {level}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="space-y-1.5">
                                        <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                            Incident Media
                                        </label>
                                        <div
                                            onClick={() => fileInputRef.current?.click()}
                                            className="group relative h-40 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 hover:border-primary/50 transition-all cursor-pointer overflow-hidden"
                                        >
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <>
                                                    <div className="bg-white p-3 rounded-full shadow-sm group-hover:scale-110 transition-transform">
                                                        <Camera className="w-6 h-6 text-gray-400" />
                                                    </div>
                                                    <p className="mt-3 text-sm font-medium text-gray-500">Click to upload photo</p>
                                                    <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest font-bold">Max 10MB • JPG, PNG, MP4</p>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*,video/*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Location
                                </label>
                                <div className="flex gap-2">
                                    <div className="relative flex-grow">
                                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            placeholder="Enter location or use auto-detect"
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            value={formData.location}
                                            onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                            required
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        className="shrink-0 px-4 h-[50px] bg-white border border-gray-200"
                                        onClick={handleDetectLocation}
                                        isLoading={isLocating}
                                    >
                                        {!isLocating && <Navigation className="w-5 h-5" />}
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider">
                                    Detailed Description
                                </label>
                                <textarea
                                    rows={4}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-gray-700 placeholder-gray-400"
                                    placeholder="Tell us more about the incident..."
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    required
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <Button
                                    size="lg"
                                    className="px-12 py-4 h-auto shadow-lg shadow-primary/30 disabled:opacity-70"
                                    isLoading={isSubmitting}
                                >
                                    <Send className="w-5 h-5 mr-2" />
                                    Submit Report
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ReportIncident;

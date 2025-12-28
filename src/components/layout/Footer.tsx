import React from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, Twitter, Facebook, Instagram, Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-100 pt-16 pb-8">
            <div className="container-custom">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Logo and Description */}
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 mb-4">
                            <AlertCircle className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold text-primary">SentinelLink</span>
                        </Link>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Empowering communities through real-time incident reporting and transparent monitoring. Join us in making our environment safer.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Quick Links</h4>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-sm text-gray-600 hover:text-primary transition-colors">Home</Link></li>
                            <li><Link to="/report" className="text-sm text-gray-600 hover:text-primary transition-colors">Report Incident</Link></li>
                            <li><Link to="/incidents" className="text-sm text-gray-600 hover:text-primary transition-colors">Live Incidents</Link></li>
                            <li><Link to="/map" className="text-sm text-gray-600 hover:text-primary transition-colors">Map View</Link></li>
                        </ul>
                    </div>

                    {/* Connect */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Connect</h4>
                        <div className="flex gap-4 mb-6">
                            {[Twitter, Facebook, Instagram].map((Icon, idx) => (
                                <a key={idx} href="#" className="p-2 bg-white border border-gray-200 rounded-full text-gray-400 hover:text-primary hover:border-primary transition-all">
                                    <Icon className="w-4 h-4" />
                                </a>
                            ))}
                        </div>
                        <div className="space-y-3">
                            <a href="mailto:info@sentinellink.com" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary">
                                <Mail className="w-4 h-4 text-gray-400" />
                                info@sentinellink.com
                            </a>
                            <a href="tel:1234567890" className="flex items-center gap-3 text-sm text-gray-600 hover:text-primary">
                                <Phone className="w-4 h-4 text-gray-400" />
                                (123) 456-7890
                            </a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-6">Legal</h4>
                        <ul className="space-y-4">
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">Privacy Policy</a></li>
                            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-600 hover:text-primary transition-colors">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 pt-8 text-center text-xs text-gray-400">
                    © 2025 SentinelLink. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;

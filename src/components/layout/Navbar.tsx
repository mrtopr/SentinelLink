import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import Button from '../ui/Button';

const Navbar: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const isAdmin = location.pathname.startsWith('/admin');
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    return (
        <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
            <div className="container-custom">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-8">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="bg-primary p-1.5 rounded-lg group-hover:bg-primary-dark transition-colors">
                                <AlertCircle className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-xl font-bold text-primary tracking-tight">SentinelLink</span>
                        </Link>

                        {!isAdmin && (
                            <div className="hidden md:flex items-center gap-6">
                                <Link
                                    to="/"
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    Home
                                </Link>
                                <Link
                                    to="/incidents"
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/incidents' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    Incidents
                                </Link>
                                <Link
                                    to="/map"
                                    className={`text-sm font-medium transition-colors ${location.pathname === '/map' ? 'text-primary' : 'text-gray-600 hover:text-primary'}`}
                                >
                                    Map View
                                </Link>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-4">
                        {!isAdmin ? (
                            <>
                                {token ? (
                                    <Link to="/admin/dashboard">
                                        <Button variant="secondary" size="sm">Go to Dashboard</Button>
                                    </Link>
                                ) : (
                                    <Link to="/admin/login">
                                        <Button variant="secondary" size="sm">Admin Login</Button>
                                    </Link>
                                )}
                                <Link to="/report">
                                    <Button size="sm">Report an Incident</Button>
                                </Link>
                            </>
                        ) : (
                            <div className="flex items-center gap-3">
                                <div className="text-right hidden sm:block">
                                    <p className="text-xs font-semibold text-gray-900">Admin User</p>
                                    <p className="text-[10px] text-gray-500">Super Admin</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <img
                                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                        alt="Admin"
                                        className="w-8 h-8 rounded-full border border-gray-200"
                                    />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

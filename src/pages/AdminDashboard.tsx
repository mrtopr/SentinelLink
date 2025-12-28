import React, { useState, useEffect } from 'react';
import {
    BarChart3,
    Users,
    AlertCircle,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    LogOut,
    Settings
} from 'lucide-react';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { type Incident } from '../data/mockData';
import { incidentApi } from '../api/incidents';
import { useNavigate } from 'react-router-dom';
import { userApi } from '../api/users';

interface User {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState<Incident[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
   const [activeTab, setActiveTab] = useState<'dashboard' | 'incidents' | 'users' | 'settings'>('dashboard');

    useEffect(() => {
        fetchIncidents();
        fetchUsers();
    }, []);

    const fetchIncidents = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await incidentApi.getIncidents();
            setIncidents(data.data || []);
        } catch (err: any) {
            console.error('Error fetching incidents:', err);
            setError('Failed to load incidents.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        try {
            await incidentApi.updateIncidentStatus(id, newStatus);
            setIncidents((prev: Incident[]) => prev.map((inc: Incident) =>
                inc.id === id ? { ...inc, status: newStatus as any } : inc
            ));
        } catch (err) {
            console.error('Error updating status:', err);
            alert('Failed to update status. Make sure you are authorized.');
        }
    };

    const fetchUsers = async () => {
        try {
            const data = await userApi.getUsers();
            setUsers(data.data || []);
        } catch (err) {
            console.error('Error fetching users:', err);
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await userApi.deleteUser(id);
            setUsers((prev: User[]) => prev.filter((u: User) => u.id !== id));
        } catch (err) {
            console.error('Error deleting user:', err);
            alert('Failed to delete user.');
        }
    };

    const handleBroadcast = async () => {
        const message = window.prompt('Enter emergency broadcast message:');
        if (!message) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api'}/incidents/broadcast`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            if (data.success) {
                alert('Broadcast sent successfully!');
            }
        } catch (error) {
            console.error('Broadcast error:', error);
            alert('Failed to send broadcast.');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/admin/login');
    };

    const handleExport = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(incidents));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "incidents_report.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    const stats = [
        { label: 'Total Incidents', value: incidents.length, icon: AlertCircle, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Pending Review', value: incidents.filter(i => i.status === 'REPORTED').length, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: 'Active Tasks', value: incidents.filter(i => i.status === 'IN_PROGRESS').length, icon: BarChart3, color: 'text-primary', bg: 'bg-primary/5' },
        { label: 'Resolved Today', value: incidents.filter(i => i.status === 'RESOLVED').length, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    ];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-100 flex flex-col hidden lg:flex">
                <div className="p-8">
                    <div className="flex items-center gap-3 mb-10">
                        <div className="bg-primary p-2 rounded-xl">
                            <AlertTriangle className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xl font-black text-gray-900 tracking-tight">SentinelLink</span>
                    </div>

                    <nav className="space-y-1">
                        <button
                            onClick={() => setActiveTab('dashboard')}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'dashboard' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <BarChart3 className="w-5 h-5" />
                            Dashboard
                        </button>
                        <button
                            onClick={() => setActiveTab('incidents')}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'incidents' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <AlertCircle className="w-5 h-5" />
                            Incidents
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'users' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Users className="w-5 h-5" />
                            Users
                        </button>
                        <button
                            onClick={() => setActiveTab('settings')}
                            className={`flex items-center gap-3 px-4 py-3 w-full rounded-xl font-bold transition-all ${activeTab === 'settings' ? 'bg-primary/5 text-primary' : 'text-gray-500 hover:bg-gray-50'}`}
                        >
                            <Settings className="w-5 h-5" />
                            Settings
                        </button>
                    </nav>
                </div>

                <div className="mt-auto p-8">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-red-500 hover:bg-red-50 rounded-xl font-bold transition-all"
                    >
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-grow p-8 lg:p-12 overflow-y-auto h-screen">
                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Admin Command</h1>
                        <p className="text-gray-500 font-medium">Real-time emergency monitoring and coordination.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="secondary" className="bg-white border-gray-200" onClick={handleExport}>Export Report</Button>
                        <Button onClick={fetchIncidents}>Refresh Data</Button>
                    </div>
                </header>

                {/* Dynamic Content Based on Tab */}
                {activeTab === 'dashboard' && (
                    <>
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            {stats.map((stat, i) => (
                                <div key={i} className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`${stat.bg} ${stat.color} p-3 rounded-2xl`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Live</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">{stat.value}</h3>
                                        <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Incidents Table (Short version for dashboard) */}
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-12">
                            <div className="p-8 border-b border-gray-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active Incidents</h2>
                                <Button variant="secondary" size="sm" onClick={() => setActiveTab('incidents')}>View All</Button>
                            </div>

                            <div className="overflow-x-auto">
                                {isLoading ? (
                                    <div className="py-20 flex flex-col items-center justify-center space-y-4">
                                        <Loader2 className="w-12 h-12 text-primary animate-spin" />
                                        <p className="text-gray-500 font-medium">Synchronizing...</p>
                                    </div>
                                ) : (
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-gray-50/50">
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Incident</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                                <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {incidents.slice(0, 5).map((incident) => (
                                                <tr key={incident.id}>
                                                    <td className="px-8 py-4 font-bold">{incident.incidentType || incident.type}</td>
                                                    <td className="px-8 py-4"><Badge label={incident.status} type="status" value={incident.status} /></td>
                                                    <td className="px-8 py-4">
                                                        <select
                                                            className="text-xs font-bold bg-gray-50 rounded-lg px-2 py-1 cursor-pointer"
                                                            value={incident.status}
                                                            onChange={(e) => handleStatusUpdate(incident.id, e.target.value)}
                                                        >
                                                            <option value="REPORTED">Reported</option>
                                                            <option value="VERIFIED">Verified</option>
                                                            <option value="IN_PROGRESS">In Progress</option>
                                                            <option value="RESOLVED">Resolved</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-primary p-10 rounded-[3rem] text-white relative h-64 flex flex-col justify-center">
                                <h3 className="text-2xl font-black mb-2">System Protocol Alpha</h3>
                                <p className="text-white/70 mb-4">Emergency broadcast system ready.</p>
                                <Button variant="secondary" className="bg-white text-primary w-fit" onClick={handleBroadcast}>Initiate Broadcast</Button>
                            </div>
                            <div className="bg-white p-10 rounded-[3rem] border border-gray-100 flex flex-col justify-center">
                                <h4 className="font-black text-amber-600 uppercase text-xs mb-2">Alert Bulletin</h4>
                                <p className="text-gray-600 italic">"Detected increase in local incident reports. Standard protocols in effect."</p>
                            </div>
                        </div>
                    </>
                )}

                {activeTab === 'incidents' && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Comprehensive Incident Log</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Incident</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Location</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Priority</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Status</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {incidents.map((incident) => (
                                        <tr key={incident.id}>
                                            <td className="px-8 py-6 flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden">
                                                    {incident.mediaUrl && <img src={incident.mediaUrl} className="w-full h-full object-cover" />}
                                                </div>
                                                <div className="font-bold">{incident.incidentType || incident.type}</div>
                                            </td>
                                            <td className="px-8 py-6 text-sm">{incident.location}</td>
                                            <td className="px-8 py-6"><Badge label={incident.severity} type="severity" value={incident.severity} /></td>
                                            <td className="px-8 py-6"><Badge label={incident.status} type="status" value={incident.status} /></td>
                                            <td className="px-8 py-6">
                                                <select
                                                    className="text-xs bg-gray-50 p-1 rounded cursor-pointer"
                                                    value={incident.status}
                                                    onChange={(e) => handleStatusUpdate(incident.id, e.target.value)}
                                                >
                                                    <option value="REPORTED">Reported</option>
                                                    <option value="VERIFIED">Verified</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="RESOLVED">Resolved</option>
                                                    <option value="FLAGGED">Flagged</option>
                                                </select>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-8 border-b border-gray-50">
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Active User Directory</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-gray-50/50">
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">User</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Email</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Role</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Joined</th>
                                        <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-[0.2em]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {users.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-8 py-6 font-bold">{user.name}</td>
                                            <td className="px-8 py-6 text-sm">{user.email}</td>
                                            <td className="px-8 py-6"><Badge label={user.role} type="status" value={user.role === 'ADMIN' ? 'RESOLVED' : 'VERIFIED'} /></td>
                                            <td className="px-8 py-6 text-xs text-gray-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                                            <td className="px-8 py-6">
                                                <button
                                                    onClick={() => handleDeleteUser(user.id)}
                                                    className="text-red-500 hover:text-red-700 font-bold text-xs"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'settings' && (
                    <div className="bg-white p-12 rounded-[3.5rem] border border-gray-100 shadow-sm max-w-2xl">
                        <h2 className="text-3xl font-black text-gray-900 mb-8">System Settings</h2>
                        <div className="space-y-8">
                            <div className="p-6 bg-gray-50 rounded-2xl">
                                <h4 className="font-bold text-gray-900 mb-2">Admin Profile</h4>
                                <p className="text-gray-500 text-sm">Managing central coordination node.</p>
                            </div>
                            <div className="p-6 bg-gray-50 rounded-2xl border-l-4 border-primary">
                                <h4 className="font-bold text-gray-900 mb-2">Notifications</h4>
                                <p className="text-gray-500 text-sm">Real-time alerts for high-severity incidents are enabled.</p>
                            </div>
                            <Button fullWidth onClick={() => alert('Settings saved successfully.')}>Save Configuration</Button>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;

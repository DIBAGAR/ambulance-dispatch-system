import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, Truck, ArrowLeft, Radio } from 'lucide-react';
import api from '../services/api';

interface UserData {
  id: number;
  name: string;
  email: string;
  role: string;
}

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'drivers' | 'dispatchers' | 'ambulances'>('drivers');
  const [users, setUsers] = useState<UserData[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverId, setDriverId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleCreateUser = async (e: React.FormEvent, role: 'drivers' | 'dispatchers') => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post(`/admin/${role}`, { name, email, password });
      setMessage(typeof res.data === 'string' ? res.data : `${role === 'drivers' ? 'Driver' : 'Dispatcher'} created!`);
      setName(''); setEmail(''); setPassword('');
      fetchUsers();
    } catch (err: any) {
      setMessage(err.response?.data || 'Failed to create user.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAmbulance = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/admin/ambulances', {
        vehicleNumber,
        driverId: driverId ? parseInt(driverId) : null,
      });
      setMessage(typeof res.data === 'string' ? res.data : 'Ambulance registered!');
      setVehicleNumber(''); setDriverId('');
    } catch (err: any) {
      setMessage(err.response?.data || 'Failed to register ambulance.');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'drivers' as const, label: 'Drivers', icon: UserPlus },
    { key: 'dispatchers' as const, label: 'Dispatchers', icon: Radio },
    { key: 'ambulances' as const, label: 'Ambulances', icon: Truck },
  ];

  const drivers = users.filter((u) => u.role === 'DRIVER');
  const dispatchers = users.filter((u) => u.role === 'DISPATCHER');

  return (
    <div className="min-h-screen bg-darker p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/dashboard')}
              className="glass-panel p-3 text-slate-400 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-3">
              <Users className="text-primary" size={28} />
              <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => { setActiveTab(tab.key); setMessage(''); }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'glass-panel text-slate-400 hover:text-white'
              }`}>
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {message && (
          <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${message.includes('successfully') || message.includes('registered') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="glass-panel p-6">
            <h2 className="text-lg font-semibold text-white mb-4">
              {activeTab === 'drivers' && 'Register New Driver'}
              {activeTab === 'dispatchers' && 'Register New Dispatcher'}
              {activeTab === 'ambulances' && 'Register New Ambulance'}
            </h2>

            {activeTab !== 'ambulances' ? (
              <form onSubmit={(e) => handleCreateUser(e, activeTab)} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Full Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="user@dispatch.local" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg py-3 transition-all disabled:opacity-50 cursor-pointer">
                  {loading ? 'Creating...' : `Create ${activeTab === 'drivers' ? 'Driver' : 'Dispatcher'}`}
                </button>
              </form>
            ) : (
              <form onSubmit={handleCreateAmbulance} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Vehicle Number</label>
                  <input type="text" required value={vehicleNumber} onChange={(e) => setVehicleNumber(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="KA-01-AB-1234" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Assign Driver (ID, optional)</label>
                  <input type="number" value={driverId} onChange={(e) => setDriverId(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="Driver ID" />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg py-3 transition-all disabled:opacity-50 cursor-pointer">
                  {loading ? 'Registering...' : 'Register Ambulance'}
                </button>
              </form>
            )}
          </div>

          {/* List */}
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="text-emerald-400" size={20} />
              <h2 className="text-lg font-semibold text-white">
                {activeTab === 'drivers' && 'Registered Drivers'}
                {activeTab === 'dispatchers' && 'Registered Dispatchers'}
                {activeTab === 'ambulances' && 'All Users'}
              </h2>
            </div>

            {(() => {
              const list = activeTab === 'drivers' ? drivers : activeTab === 'dispatchers' ? dispatchers : users;
              return list.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-8">No records found.</p>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {list.map((u) => (
                    <div key={u.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors">
                      <div>
                        <p className="text-white font-medium text-sm">{u.name}</p>
                        <p className="text-slate-400 text-xs">{u.email}</p>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                        u.role === 'DRIVER' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'
                      }`}>{u.role}</span>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

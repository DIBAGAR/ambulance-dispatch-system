import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, Users, Shield, ArrowLeft } from 'lucide-react';
import api from '../services/api';

interface Admin {
  id: number;
  name: string;
  email: string;
  role: string;
}

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAdmins = async () => {
    try {
      const res = await api.get('/superadmin/admins');
      setAdmins(res.data);
    } catch (err) {
      console.error('Failed to fetch admins:', err);
    }
  };

  useEffect(() => { fetchAdmins(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await api.post('/superadmin/admins', { name, email, password });
      setMessage(typeof res.data === 'string' ? res.data : 'Admin created!');
      setName(''); setEmail(''); setPassword('');
      fetchAdmins();
    } catch (err: any) {
      setMessage(err.response?.data || 'Failed to create admin.');
    } finally {
      setLoading(false);
    }
  };

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
              <Shield className="text-primary" size={28} />
              <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <UserPlus className="text-primary" size={22} />
              <h2 className="text-lg font-semibold text-white">Create New Admin</h2>
            </div>
            {message && (
              <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${message.includes('successfully') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                {message}
              </div>
            )}
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Name</label>
                <input type="text" required value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="admin@dispatch.local" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Password</label>
                <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="••••••••" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-blue-600 text-white font-semibold rounded-lg py-3 transition-all disabled:opacity-50 cursor-pointer">
                {loading ? 'Creating...' : 'Create Admin'}
              </button>
            </form>
          </div>

          <div className="glass-panel p-6">
            <div className="flex items-center gap-2 mb-6">
              <Users className="text-emerald-400" size={22} />
              <h2 className="text-lg font-semibold text-white">All Admins</h2>
              <span className="bg-slate-700 text-slate-300 text-xs font-semibold px-2 py-1 rounded-full ml-auto">{admins.length}</span>
            </div>
            {admins.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No admins registered yet.</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {admins.map((admin) => (
                  <div key={admin.id} className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3 hover:bg-slate-800 transition-colors">
                    <div>
                      <p className="text-white font-medium text-sm">{admin.name}</p>
                      <p className="text-slate-400 text-xs">{admin.email}</p>
                    </div>
                    <span className="bg-primary/20 text-primary text-xs font-semibold px-2 py-1 rounded-full">ADMIN</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Client } from '@stomp/stompjs';
import { LogOut, AlertTriangle, Activity, Truck, Wrench, X, Navigation, MapPin } from 'lucide-react';
import api from '../services/api';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const greenIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const redIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const yellowIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

interface AmbulanceLocation {
  vehicleNumber: string;
  latitude: number;
  longitude: number;
  status?: string;
}

// Map Click Listener Component
const MapClickHandler = ({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) => {
  useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [ambulances, setAmbulances] = useState<AmbulanceLocation[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [selectedPoint, setSelectedPoint] = useState<{ lat: number; lng: number } | null>(null);
  const [submitMsg, setSubmitMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const clientRef = useRef<Client | null>(null);

  const roles = JSON.parse(localStorage.getItem('roles') || '[]');
  const roleName = roles[0]?.replace('ROLE_', '') || 'USER';

  // Fetch initial ambulances list from API
  const fetchAmbulances = async () => {
    try {
      const res = await api.get('/dispatch/ambulances');
      setAmbulances(res.data);
    } catch (err) {
      console.error('Failed to fetch ambulances:', err);
    }
  };

  useEffect(() => {
    fetchAmbulances();

    const client = new Client({
      brokerURL: 'ws://localhost:8080/ws-location/websocket',
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/ambulances', (message) => {
          const update: AmbulanceLocation = JSON.parse(message.body);
          setAmbulances((prev) => {
            const existing = prev.findIndex((a) => a.vehicleNumber === update.vehicleNumber);
            if (existing >= 0) {
              const updated = [...prev];
              updated[existing] = update;
              return updated;
            }
            return [...prev, update];
          });
        });
      },
    });
    client.activate();
    clientRef.current = client;
    return () => { client.deactivate(); };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('roles');
    navigate('/login');
  };

  // Map click handler to select incident location
  const handleMapClick = (clickLat: number, clickLng: number) => {
    setLat(clickLat.toFixed(6));
    setLng(clickLng.toFixed(6));
    setSelectedPoint({ lat: clickLat, lng: clickLng });
    setShowModal(true);
  };

  // Auto-detect current browser GPS location
  const handleDetectGps = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }
    setGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const currentLat = pos.coords.latitude;
        const currentLng = pos.coords.longitude;
        setLat(currentLat.toFixed(6));
        setLng(currentLng.toFixed(6));
        setSelectedPoint({ lat: currentLat, lng: currentLng });
        setGpsLoading(false);
      },
      (err) => {
        console.error(err);
        alert('Could not detect location. Please allow GPS location permissions.');
        setGpsLoading(false);
      }
    );
  };

  const handleReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitMsg('');
    try {
      const res = await api.post('/dispatch/report', {
        description,
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
      });
      setSubmitMsg(typeof res.data === 'string' ? res.data : 'Incident reported!');
      setDescription(''); setLat(''); setLng(''); setSelectedPoint(null);
      fetchAmbulances();
      setTimeout(() => setShowModal(false), 2500);
    } catch (err: any) {
      setSubmitMsg(err.response?.data || 'Failed to report incident.');
    } finally {
      setSubmitting(false);
    }
  };

  const stats = {
    total: ambulances.length,
    available: ambulances.filter((a) => a.status === 'AVAILABLE').length,
    dispatched: ambulances.filter((a) => a.status === 'DISPATCHED').length,
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Map */}
      <MapContainer center={[20.5937, 78.9629]} zoom={5} className="h-full w-full z-0"
        style={{ background: '#0f172a' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <MapClickHandler onMapClick={handleMapClick} />

        {/* Selected Incident Point Marker */}
        {selectedPoint && (
          <Marker position={[selectedPoint.lat, selectedPoint.lng]} icon={yellowIcon}>
            <Popup>
              <div className="text-sm font-semibold text-yellow-500">
                📍 Selected Incident Location<br />
                Lat: {selectedPoint.lat.toFixed(4)}, Lng: {selectedPoint.lng.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Ambulance Markers */}
        {ambulances.map((amb) => (
          <Marker key={amb.vehicleNumber}
            position={[amb.latitude, amb.longitude]}
            icon={amb.status === 'DISPATCHED' ? redIcon : greenIcon}>
            <Popup>
              <div className="text-sm">
                <strong>{amb.vehicleNumber}</strong><br />
                Status: <span className={amb.status === 'DISPATCHED' ? 'text-red-500 font-bold' : 'text-emerald-500 font-bold'}>{amb.status || 'AVAILABLE'}</span><br />
                Lat: {amb.latitude.toFixed(4)}, Lng: {amb.longitude.toFixed(4)}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Top Navbar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-center justify-between">
        <div className="glass-panel px-6 py-3 flex items-center gap-4">
          <Activity className="text-primary" size={24} />
          <h1 className="text-lg font-bold text-white tracking-tight">Ambulance Dispatch Portal</h1>
          <span className="bg-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">{roleName}</span>
        </div>
        <div className="flex gap-2">
          {roles.includes('ROLE_SUPER_ADMIN') && (
            <button onClick={() => navigate('/superadmin')}
              className="glass-panel px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">
              Super Admin
            </button>
          )}
          {(roles.includes('ROLE_ADMIN') || roles.includes('ROLE_SUPER_ADMIN')) && (
            <button onClick={() => navigate('/admin')}
              className="glass-panel px-4 py-3 text-sm text-slate-300 hover:text-white transition-colors cursor-pointer">
              Admin Panel
            </button>
          )}
          <button onClick={handleLogout}
            className="glass-panel px-4 py-3 text-sm text-red-400 hover:text-red-300 transition-colors flex items-center gap-2 cursor-pointer">
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Left Sidebar */}
      <div className="absolute top-24 left-4 z-[1000] w-72 space-y-3">
        <div className="glass-panel p-4">
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-3">Fleet Status</h2>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2"><Truck size={18} className="text-blue-400" /><span className="text-sm">Total</span></div>
              <span className="font-bold text-white">{stats.total}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2"><Activity size={18} className="text-emerald-400" /><span className="text-sm">Available</span></div>
              <span className="font-bold text-emerald-400">{stats.available}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2"><AlertTriangle size={18} className="text-red-400" /><span className="text-sm">Dispatched</span></div>
              <span className="font-bold text-red-400">{stats.dispatched}</span>
            </div>
            <div className="flex items-center justify-between bg-slate-800/50 rounded-lg p-3">
              <div className="flex items-center gap-2"><Wrench size={18} className="text-yellow-400" /><span className="text-sm">Maintenance</span></div>
              <span className="font-bold text-yellow-400">0</span>
            </div>
          </div>
        </div>

        <button onClick={() => setShowModal(true)}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-500/20 cursor-pointer">
          <AlertTriangle size={20} /> Report Incident
        </button>

        <p className="text-xs text-slate-400 text-center px-2">
          💡 <strong>Tip:</strong> Click anywhere directly on the map to pick an accident location!
        </p>
      </div>

      {/* Incident Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md p-6 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"><X size={20} /></button>
            <h2 className="text-xl font-bold text-white mb-1">Report Emergency</h2>
            <p className="text-slate-400 text-sm mb-4">Click anywhere on the map or use the auto-detect button to get GPS coordinates.</p>
            
            {/* Auto-detect GPS button */}
            <button type="button" onClick={handleDetectGps} disabled={gpsLoading}
              className="w-full mb-4 bg-slate-800 hover:bg-slate-700 text-blue-400 border border-blue-500/30 font-medium rounded-lg py-2 flex items-center justify-center gap-2 text-sm transition-all cursor-pointer">
              <Navigation size={16} /> {gpsLoading ? 'Detecting GPS...' : '📍 Auto-Detect My Current GPS Location'}
            </button>

            {submitMsg && (
              <div className={`text-sm px-4 py-2 rounded-lg mb-4 ${submitMsg.includes('dispatched') || submitMsg.includes('reported') ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/10 text-red-400 border border-red-500/30'}`}>
                {submitMsg}
              </div>
            )}

            <form onSubmit={handleReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
                <textarea required rows={2} value={description} onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary resize-none" placeholder="Road accident near highway..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Latitude</label>
                  <input type="number" step="any" required value={lat} onChange={(e) => setLat(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="12.9716" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-1">Longitude</label>
                  <input type="number" step="any" required value={lng} onChange={(e) => setLng(e.target.value)}
                    className="w-full bg-darker border border-slate-700 text-white rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary" placeholder="77.5946" />
                </div>
              </div>
              <button type="submit" disabled={submitting}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg py-3 transition-all disabled:opacity-50 cursor-pointer">
                {submitting ? 'Dispatching...' : 'Dispatch Nearest Ambulance'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

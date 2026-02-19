import { useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { clinicsData } from '../data/clinicsData';

// Fix Leaflet Default Icon
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- Helper: Haversine Distance ---
function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

// Map Updater Component
function MapUpdater({ center }) {
    const map = useMap();
    map.flyTo(center, 13);
    return null;
}

export default function ClinicsMap() {
    const { isDark, isArabic } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [userLocation, setUserLocation] = useState({ lat: 30.0444, lng: 31.2357 }); // Default: Cairo
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [hasSearched, setHasSearched] = useState(false);

    const bg = isDark ? '#1F2940' : '#fff';
    const text = isDark ? '#E0E0E0' : '#2D3436';
    const accent = '#6C63FF';

    // Sort clinics by distance from userLocation
    const nearestClinics = useMemo(() => {
        if (!hasSearched) return [];

        return clinicsData
            .map(clinic => ({
                ...clinic,
                distance: getDistance(userLocation.lat, userLocation.lng, clinic.lat, clinic.lng)
            }))
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 5); // Take top 5
    }, [userLocation, hasSearched]);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setLoading(true);
        setError('');

        try {
            // Nominatim API (Free - rate limited)
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery + ' Egypt')}`);
            const data = await res.json();

            if (data && data.length > 0) {
                const newLat = parseFloat(data[0].lat);
                const newLng = parseFloat(data[0].lon);
                setUserLocation({ lat: newLat, lng: newLng });
                setHasSearched(true);
            } else {
                setError(isArabic ? 'لم يتم العثور على هذا المكان' : 'Location not found');
            }
        } catch (err) {
            setError(isArabic ? 'حدث خطأ أثناء البحث' : 'Error searching location');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ background: bg, borderRadius: 20, padding: 20, margin: '20px 0', border: '1px solid rgba(108,99,255,0.2)' }}>
            <h3 style={{ color: text, fontSize: 18, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                📍 {isArabic ? 'خريطة مراكز التوحد' : 'Autism Clinics Map'}
            </h3>

            {/* Search Bar */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    placeholder={isArabic ? 'أدخل اسم مدينتك (مثل: المعادي، مدينة نصر)' : 'Enter your city (e.g. Maadi, Nasr City)'}
                    style={{
                        flex: 1, padding: '12px 16px', borderRadius: 14,
                        border: `1px solid ${isDark ? '#444' : '#ddd'}`,
                        background: isDark ? '#16213E' : '#f9f9f9',
                        color: text, outline: 'none'
                    }}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()}
                />
                <button onClick={handleSearch} disabled={loading} style={{
                    padding: '0 24px', borderRadius: 14, background: accent, color: '#fff',
                    border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600
                }}>
                    {loading ? '...' : (isArabic ? 'بحث' : 'Search')}
                </button>
            </div>

            {error && <p style={{ color: '#FF6584', fontSize: 13, marginBottom: 10 }}>⚠️ {error}</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'revert', gap: 20 }}>
                {/* Map */}
                <div style={{ height: 400, borderRadius: 16, overflow: 'hidden', border: `2px solid ${isDark ? '#444' : '#eee'}` }}>
                    <MapContainer center={[userLocation.lat, userLocation.lng]} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* User Marker */}
                        {hasSearched && (
                            <Marker position={[userLocation.lat, userLocation.lng]}>
                                <Popup>{isArabic ? 'موقعك' : 'Your Location'}</Popup>
                            </Marker>
                        )}

                        {/* Clinics Markers */}
                        {hasSearched ? nearestClinics.map(clinic => (
                            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
                                <Popup>
                                    <strong>{isArabic ? clinic.nameAr : clinic.name}</strong><br />
                                    {clinic.phone}<br />
                                    {isArabic ? clinic.address : clinic.address} <br />
                                    {clinic.distance.toFixed(1)} km <br />
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: accent, fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: 4 }}
                                    >
                                        🚀 {isArabic ? 'افتح في Google Maps' : 'Open in Google Maps'}
                                    </a>
                                </Popup>
                            </Marker>
                        )) : clinicsData.map(clinic => ( // Show all if no search
                            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
                                <Popup>
                                    <strong>{isArabic ? clinic.nameAr : clinic.name}</strong><br />
                                    {clinic.phone}<br />
                                    <a
                                        href={`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: accent, fontWeight: 700, textDecoration: 'none', display: 'block', marginTop: 4 }}
                                    >
                                        🚀 {isArabic ? 'افتح في Google Maps' : 'Open in Google Maps'}
                                    </a>
                                </Popup>
                            </Marker>
                        ))}

                        <MapUpdater center={[userLocation.lat, userLocation.lng]} />
                    </MapContainer>
                </div>

                {/* List of Nearest Clinics */}
                {hasSearched && nearestClinics.length > 0 && (
                    <div style={{ marginTop: 20 }}>
                        <h4 style={{ color: text, marginBottom: 12 }}>{isArabic ? 'أقرب 5 عيادات لك' : 'Nearest 5 Clinics'}</h4>
                        <div style={{ display: 'grid', gap: 10 }}>
                            {nearestClinics.map((clinic, i) => (
                                <div
                                    key={clinic.id}
                                    onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`, '_blank')}
                                    style={{
                                        padding: 12, borderRadius: 12, background: isDark ? '#16213E' : '#f5f7fa',
                                        display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer',
                                        borderLeft: `4px solid ${i === 0 ? '#4ECDC4' : accent}`,
                                        transition: 'transform 0.2s, background 0.2s',
                                    }}
                                    onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = isDark ? '#1F2940' : '#eef2f6'; }}
                                    onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = isDark ? '#16213E' : '#f5f7fa'; }}
                                    title={isArabic ? 'اضغط للفتح في الخريطة' : 'Click to open in Maps'}
                                >
                                    <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${accent}20`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                                        {i + 1}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontWeight: 700, color: text }}>{isArabic ? clinic.nameAr : clinic.name} ↗️</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>{isArabic ? clinic.address : clinic.address}</div>
                                        <div style={{ fontSize: 12, color: '#999' }}>📞 {clinic.phone}</div>
                                    </div>
                                    <div style={{ fontSize: 13, fontWeight: 700, color: '#4ECDC4' }}>
                                        {clinic.distance.toFixed(1)} km
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

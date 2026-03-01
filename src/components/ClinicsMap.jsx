import { useState, useMemo, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useApp } from '../context/AppContext';
import { clinicsData, egyptCities, serviceLabels } from '../data/clinicsData';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({ iconUrl: markerIcon, shadowUrl: markerShadow, iconSize: [25, 41], iconAnchor: [12, 41] });
L.Marker.prototype.options.icon = DefaultIcon;

function getDistance(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function MapFlyer({ center, zoom }) { const map = useMap(); map.flyTo(center, zoom, { duration: 1 }); return null; }

export default function ClinicsMap() {
    const { isDark, isArabic } = useApp();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCity, setSelectedCity] = useState(null);
    const [mapCenter, setMapCenter] = useState([30.0444, 31.2357]);
    const [mapZoom, setMapZoom] = useState(6);
    const [filterService, setFilterService] = useState('all');

    const accent = '#6C63FF';
    const cities = useMemo(() => Array.from(new Set(clinicsData.map(c => c.city))), []);

    const handleSearch = useCallback(() => {
        if (!searchQuery.trim()) return;
        const q = searchQuery.trim().toLowerCase();
        const cityMatch = egyptCities.find(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(searchQuery.trim()));
        if (cityMatch) { setMapCenter([cityMatch.lat, cityMatch.lng]); setMapZoom(12); setSelectedCity(cityMatch.name); return; }
        const clinicMatch = clinicsData.find(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(searchQuery.trim()) || c.area.toLowerCase().includes(q) || c.areaAr.includes(searchQuery.trim()));
        if (clinicMatch) { setMapCenter([clinicMatch.lat, clinicMatch.lng]); setMapZoom(14); setSelectedCity(clinicMatch.city); }
    }, [searchQuery]);

    const filteredClinics = useMemo(() => {
        let result = clinicsData;
        if (selectedCity) result = result.filter(c => c.city === selectedCity);
        if (filterService !== 'all') result = result.filter(c => c.services.includes(filterService));
        return result.map(c => ({ ...c, distance: getDistance(mapCenter[0], mapCenter[1], c.lat, c.lng) })).sort((a, b) => a.distance - b.distance);
    }, [selectedCity, filterService, mapCenter]);

    const handleCityClick = useCallback((city) => { const d = egyptCities.find(c => c.name === city || c.nameAr === city); if (d) { setMapCenter([d.lat, d.lng]); setMapZoom(12); setSelectedCity(city); } }, []);
    const showAll = useCallback(() => { setSelectedCity(null); setFilterService('all'); setMapCenter([30.0444, 31.2357]); setMapZoom(6); setSearchQuery(''); }, []);
    const stars = (rating) => '⭐'.repeat(Math.floor(rating)) + (rating % 1 >= 0.5 ? '½' : '');

    const pillCls = (active, color = accent) => `py-1.5 px-3.5 rounded-[20px] cursor-pointer whitespace-nowrap font-semibold text-xs transition-all duration-200 border ${active ? `text-white border-[${color}]` : `${isDark ? 'border-[#444] text-gray-400' : 'border-gray-200 text-gray-400'} bg-transparent`}`;

    return (
        <div className={`rounded-[20px] p-5 my-5 border ${isDark ? 'bg-[#1F2940] border-[#444]' : 'bg-white border-gray-200'}`}>
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold m-0 flex items-center gap-2 ${isDark ? 'text-[#E0E0E0]' : 'text-[#2D3436]'}`}>
                    📍 {isArabic ? 'خريطة مراكز التوحد في مصر' : 'Autism Clinics Map - Egypt'}
                    <span className="text-xs py-0.5 px-2 rounded-lg font-semibold" style={{ background: `${accent}20`, color: accent }}>{clinicsData.length} {isArabic ? 'مركز' : 'clinics'}</span>
                </h3>
                {selectedCity && <button onClick={showAll} className="py-1.5 px-3.5 rounded-[10px] bg-[#FF658420] text-[#FF6584] border-none cursor-pointer text-xs font-semibold">✕ {isArabic ? 'عرض الكل' : 'Show All'}</button>}
            </div>

            {/* Search */}
            <div className="flex gap-2.5 mb-3">
                <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder={isArabic ? '🔍 ابحث بالمدينة أو المنطقة (مثل: المعادي، طنطا)' : '🔍 Search by city or area (e.g. Maadi, Tanta)'}
                    className={`flex-1 py-3 px-4 rounded-[14px] border outline-none text-sm ${isDark ? 'bg-[#16213E] border-[#444] text-[#E0E0E0]' : 'bg-[#f9f9f9] border-gray-200 text-[#2D3436]'}`}
                    onKeyDown={e => e.key === 'Enter' && handleSearch()} />
                <button onClick={handleSearch} className="px-5 rounded-[14px] bg-accent text-white border-none cursor-pointer font-bold text-sm">{isArabic ? 'بحث' : 'Search'}</button>
            </div>

            {/* City Filters */}
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] mb-3 pb-1">
                {['Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Gharbia', 'Sharqia', 'Assiut', 'Luxor', 'Suez'].map(city => (
                    <button key={city} onClick={() => handleCityClick(city)}
                        className={`py-1.5 px-3.5 rounded-[20px] cursor-pointer whitespace-nowrap font-semibold text-xs transition-all duration-200 border ${selectedCity === city ? 'bg-accent text-white border-accent' : `bg-transparent ${isDark ? 'border-[#444] text-gray-300' : 'border-gray-200 text-gray-700'}`}`}>
                        {isArabic ? (egyptCities.find(c => c.name === city)?.nameAr || city) : city}
                    </button>
                ))}
            </div>

            {/* Service Filters */}
            <div className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] mb-4 pb-1">
                <button onClick={() => setFilterService('all')} className={`py-1 px-3 rounded-2xl cursor-pointer whitespace-nowrap font-semibold text-[11px] border ${filterService === 'all' ? 'bg-[#4ECDC420] text-[#4ECDC4] border-[#4ECDC4]' : `bg-transparent text-gray-400 ${isDark ? 'border-[#444]' : 'border-gray-200'}`}`}>{isArabic ? 'الكل' : 'All'}</button>
                {Object.entries(serviceLabels).map(([key, label]) => (
                    <button key={key} onClick={() => setFilterService(key)} className={`py-1 px-3 rounded-2xl cursor-pointer whitespace-nowrap font-semibold text-[11px] border ${filterService === key ? 'bg-[#4ECDC420] text-[#4ECDC4] border-[#4ECDC4]' : `bg-transparent text-gray-400 ${isDark ? 'border-[#444]' : 'border-gray-200'}`}`}>{isArabic ? label.ar : label.en}</button>
                ))}
            </div>

            {/* Map */}
            <div className={`h-[400px] rounded-2xl overflow-hidden mb-4 border-2 ${isDark ? 'border-[#333]' : 'border-gray-200'}`}>
                <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%' }}>
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                    {filteredClinics.map(clinic => (
                        <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
                            <Popup>
                                <div style={{ minWidth: 200 }}>
                                    <strong className="text-sm">{isArabic ? clinic.nameAr : clinic.name}</strong><br />
                                    <span className="text-xs text-gray-500">📍 {isArabic ? clinic.areaAr : clinic.area}, {isArabic ? clinic.cityAr : clinic.city}</span><br />
                                    <span className="text-xs">📞 {clinic.phone}</span><br />
                                    <span className="text-[11px]">{stars(clinic.rating)} ({clinic.rating})</span><br />
                                    <div className="mt-1 flex flex-wrap gap-1">
                                        {clinic.services.map(s => (<span key={s} className="text-[9px] py-px px-1.5 rounded-md bg-accent/20 text-accent">{isArabic ? serviceLabels[s]?.ar : serviceLabels[s]?.en}</span>))}
                                    </div>
                                    <a href={`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`} target="_blank" rel="noopener noreferrer" className="block mt-1.5 text-accent font-bold text-xs no-underline">🚀 {isArabic ? 'افتح في Google Maps' : 'Open in Google Maps'}</a>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                    <MapFlyer center={mapCenter} zoom={mapZoom} />
                </MapContainer>
            </div>

            {/* Results */}
            <div className="text-[13px] text-gray-400 mb-3 font-semibold">
                {isArabic ? `عرض ${filteredClinics.length} مركز ${selectedCity ? `في ${egyptCities.find(c => c.name === selectedCity)?.nameAr || selectedCity}` : 'في كل مصر'}` : `Showing ${filteredClinics.length} clinics ${selectedCity ? `in ${selectedCity}` : 'across Egypt'}`}
            </div>

            {/* Clinics List */}
            <div className="grid gap-2.5 max-h-[400px] overflow-y-auto">
                {filteredClinics.slice(0, 15).map((clinic, i) => (
                    <div key={clinic.id} onClick={() => { setMapCenter([clinic.lat, clinic.lng]); setMapZoom(15); }}
                        className={`p-3.5 rounded-[14px] flex items-center gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.1)] ${isDark ? 'bg-[#16213E]' : 'bg-[#f5f7fa]'}`}
                        style={{ [isArabic ? 'borderRight' : 'borderLeft']: `4px solid ${i === 0 ? '#4ECDC4' : accent}` }}>
                        <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm shrink-0" style={{ background: i === 0 ? '#4ECDC420' : `${accent}15`, color: i === 0 ? '#4ECDC4' : accent }}>{i + 1}</div>
                        <div className="flex-1 min-w-0">
                            <div className={`font-bold text-sm ${isDark ? 'text-[#E0E0E0]' : 'text-[#2D3436]'}`}>{isArabic ? clinic.nameAr : clinic.name}</div>
                            <div className="text-xs text-gray-400">📍 {isArabic ? `${clinic.areaAr}، ${clinic.cityAr}` : `${clinic.area}, ${clinic.city}`}</div>
                            <div className="flex gap-1 mt-1 flex-wrap">
                                {clinic.services.slice(0, 3).map(s => (<span key={s} className="text-[10px] py-px px-1.5 rounded-md font-semibold" style={{ background: `${accent}15`, color: accent }}>{isArabic ? serviceLabels[s]?.ar : serviceLabels[s]?.en}</span>))}
                            </div>
                        </div>
                        <div className="text-center shrink-0">
                            <div className="text-xs font-bold text-[#4ECDC4]">{clinic.distance < 1 ? `${(clinic.distance * 1000).toFixed(0)}m` : `${clinic.distance.toFixed(1)}km`}</div>
                            <div className="text-[10px] text-amber-400">{stars(clinic.rating)}</div>
                            <a href={`tel:${clinic.phone}`} onClick={e => e.stopPropagation()} className="text-[11px] text-accent no-underline font-semibold">📞 {isArabic ? 'اتصل' : 'Call'}</a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

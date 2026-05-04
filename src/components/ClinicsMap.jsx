import { useState, useMemo, useCallback } from 'react';
import { Button, Input, Card, CardBody } from '@heroui/react';
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

    const handleSearch = useCallback(async () => {
        if (!searchQuery.trim()) return;
        const q = searchQuery.trim().toLowerCase();
        
        // 1. Try local city match
        const cityMatch = egyptCities.find(c => c.name.toLowerCase().includes(q) || c.nameAr.includes(searchQuery.trim()));
        if (cityMatch) { 
            setMapCenter([cityMatch.lat, cityMatch.lng]); 
            setMapZoom(12); 
            setSelectedCity(cityMatch.name); 
            return; 
        }

        // 2. Try local clinic match
        const clinicMatch = clinicsData.find(c => 
            c.name.toLowerCase().includes(q) || 
            c.nameAr.includes(searchQuery.trim()) || 
            c.area.toLowerCase().includes(q) || 
            c.areaAr.includes(searchQuery.trim())
        );
        if (clinicMatch) { 
            setMapCenter([clinicMatch.lat, clinicMatch.lng]); 
            setMapZoom(14); 
            setSelectedCity(clinicMatch.city);
            return;
        }

        // 3. Global search via Nominatim (OpenStreetMap)
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`);
            const data = await response.json();
            if (data && data.length > 0) {
                const { lat, lon, display_name } = data[0];
                setMapCenter([parseFloat(lat), parseFloat(lon)]);
                setMapZoom(14);
                // Optionally clear selected city as it's a global search
                setSelectedCity(null);
            }
        } catch (error) {
            console.error("Geocoding error:", error);
        }
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

    return (
        <div className={`rounded-[40px] border-none shadow-none ${isDark ? 'bg-transparent text-white' : 'bg-transparent text-[#0C0D17]'}`}>
            
            {/* Sticky Search & Filter Header (Adjusted for main Navbar) */}
            <div className={`sticky top-[75px] z-20 pb-6 mb-12 pt-8 px-8 border-b ${isDark ? 'bg-[#0E101F]/95 backdrop-blur-3xl border-white/5' : 'bg-white/95 backdrop-blur-3xl border-slate-100 shadow-md'}`}>
                {/* Header Row */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex flex-col">
                         <h3 className={`text-xl font-extrabold m-0 flex items-center gap-3 ${isDark ? 'text-white' : 'text-[#0C0D17]'}`}>
                            {isArabic ? 'خريطة مراكز الدعم' : 'Support Circles Map'}
                            <span className="text-[10px] py-1 px-3 rounded-full font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{clinicsData.length} {isArabic ? 'مركز' : 'Found'}</span>
                        </h3>
                        {selectedCity && (
                            <p className="text-[11px] font-black uppercase tracking-widest text-indigo-400 mt-1">
                                {isArabic ? `عرض النتائج في ${egyptCities.find(c => c.name === selectedCity)?.nameAr || selectedCity}` : `Showing results in ${selectedCity}`}
                            </p>
                        )}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="flex gap-3 mb-6">
                    <div className="relative flex-1 group">
                        <Input 
                            value={searchQuery} 
                            onChange={e => setSearchQuery(e.target.value)} 
                            placeholder={isArabic ? 'ابحث عن مدينة، منطقة، أو اسم مركز...' : 'Explore by city, area, or facility name...'}
                            radius="2xl"
                            size="lg"
                            classNames={{
                                input: "text-base font-bold",
                                inputWrapper: isDark ? "bg-white/5 group-data-[focus=true]:bg-white/10 border-white/10" : "bg-slate-100 border-slate-200"
                            }}
                            onKeyDown={e => e.key === 'Enter' && handleSearch()}
                        />
                    </div>
                    <Button onPress={handleSearch} className="bg-indigo-500 text-white font-black h-14 rounded-3xl px-8 shadow-lg shadow-indigo-500/20 hover:scale-105 transition-transform">
                        {isArabic ? 'بحث' : 'GO'}
                    </Button>
                </div>

                {/* City Pills */}
                <div className="flex gap-2 overflow-x-auto [scrollbar-width:none] mb-4 pb-1">
                    {['Cairo', 'Giza', 'Alexandria', 'Dakahlia', 'Gharbia', 'Sharqia', 'Assiut', 'Luxor', 'Suez'].map(city => (
                        <button key={city} onClick={() => handleCityClick(city)}
                            className={`py-2 px-5 rounded-full cursor-pointer whitespace-nowrap font-black text-[11px] uppercase tracking-widest transition-all duration-300 border ${selectedCity === city ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg shadow-indigo-500/30' : `bg-transparent ${isDark ? 'border-white/10 text-white/40 hover:text-white/70' : 'border-slate-200 text-slate-400 hover:text-slate-600'}`}`}>
                            {isArabic ? (egyptCities.find(c => c.name === city)?.nameAr || city) : city}
                        </button>
                    ))}
                </div>

                {/* Service Tabs */}
                <div className="flex gap-2 p-1 rounded-2xl bg-white/5 border border-white/5 overflow-x-auto [scrollbar-width:none]">
                    <button onClick={() => setFilterService('all')} className={`flex-1 py-1.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${filterService === 'all' ? 'bg-white/10 text-white shadow-sm' : 'text-white/30'}`}>{isArabic ? 'الكل' : 'All'}</button>
                    {Object.entries(serviceLabels).map(([key, label]) => (
                        <button key={key} onClick={() => setFilterService(key)} className={`flex-1 py-1.5 px-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${filterService === key ? 'bg-white/10 text-white shadow-sm' : 'text-white/30'}`}>{isArabic ? label.ar : label.en}</button>
                    ))}
                </div>
            </div>

            <div className="px-8 pt-10 pb-10 space-y-12">
                {/* Main Map Canvas */}
                <div className={`h-[600px] rounded-[40px] overflow-hidden border shadow-2xl relative z-0 ${isDark ? 'border-white/10 bg-[#0C0D17]' : 'border-slate-200 bg-white'}`}>
                    <MapContainer center={mapCenter} zoom={mapZoom} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' />
                        {filteredClinics.map(clinic => (
                            <Marker key={clinic.id} position={[clinic.lat, clinic.lng]}>
                                <Popup className="aura-popup">
                                    <div className="p-2 space-y-3 min-w-[220px]">
                                        <div className="space-y-1">
                                            <p className="text-base font-black text-[#080912] m-0 leading-tight">{isArabic ? clinic.nameAr : clinic.name}</p>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest m-0">📍 {isArabic ? clinic.areaAr : clinic.area}, {isArabic ? clinic.cityAr : clinic.city}</p>
                                        </div>
                                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                                            <span className="text-amber-500 font-black">{stars(clinic.rating)}</span>
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">📞 {clinic.phone}</span>
                                        </div>
                                        <a href={`https://www.google.com/maps/search/?api=1&query=${clinic.lat},${clinic.lng}`} target="_blank" rel="noopener noreferrer" 
                                            className="block w-full py-2.5 text-center rounded-xl bg-[#080912] text-white font-black text-[11px] uppercase tracking-[0.2em] no-underline hover:bg-slate-800 transition-colors">
                                             Open Navigation
                                        </a>
                                    </div>
                                </Popup>
                            </Marker>
                        ))}
                        <MapFlyer center={mapCenter} zoom={mapZoom} />
                    </MapContainer>
                </div>

                {/* Discovery Section */}
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h4 className={`text-base font-black uppercase tracking-[0.2em] ${isDark ? 'text-white/20' : 'text-slate-400'}`}>
                            {isArabic ? 'المراكز المكتشفة' : 'Discovered Hubs'}
                        </h4>
                        <span className="text-[11px] font-black text-indigo-400">{filteredClinics.length} Available</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClinics.slice(0, 15).map((clinic, i) => (
                            <Card key={clinic.id} isPressable onPress={() => { setMapCenter([clinic.lat, clinic.lng]); setMapZoom(15); window.scrollTo({top: 500, behavior: 'smooth'}); }}
                                className={`rounded-[35px] border overflow-hidden transition-all duration-500 hover:scale-[1.02] ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:shadow-xl'}`}>
                                <CardBody className="p-6">
                                    <div className="flex gap-5 items-start">
                                        <div className="w-12 h-12 rounded-3xl bg-indigo-500/10 flex items-center justify-center font-black text-indigo-500 text-lg shadow-inner shrink-0">
                                            {i + 1}
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            <h5 className={`font-black text-base m-0 leading-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{isArabic ? clinic.nameAr : clinic.name}</h5>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest m-0 truncate">📍 {isArabic ? clinic.areaAr : clinic.area}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-wrap gap-1.5 mt-4">
                                        {clinic.services.slice(0, 2).map(s => (
                                            <span key={s} className="text-[9px] py-1 px-3 rounded-full font-black uppercase tracking-widest bg-white/5 text-white/40 border border-white/5">
                                                {isArabic ? serviceLabels[s]?.ar : serviceLabels[s]?.en}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between mt-5 pt-4 border-t border-white/5">
                                        <span className="text-emerald-400 font-black text-[12px]">{clinic.distance < 1 ? `${(clinic.distance * 1000).toFixed(0)}m` : `${clinic.distance.toFixed(1)}km`}</span>
                                        <div className="flex gap-3">
                                             <Button isIconOnly size="sm" radius="full" variant="flat" className="bg-white/5 text-white/30">📍</Button>
                                             <a href={`tel:${clinic.phone}`} onClick={e => e.stopPropagation()} className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">📞</a>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
            
            <style>{`
                .aura-popup .leaflet-popup-content-wrapper { border-radius: 25px; padding: 10px; border: 1px solid rgba(0,0,0,0.05); shadow: 0 20px 50px rgba(0,0,0,0.1); }
                .aura-popup .leaflet-popup-tip-container { display: none; }
            `}</style>
        </div>
    );
}

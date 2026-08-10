import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import type { Hotspot } from '../types';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapProps {
  hotspots: Hotspot[];
  onMarkerClick: (hotspot: Hotspot) => void;
}

const getMarkerColor = (category: string) => {
  switch (category) {
    case 'Critical': return '#EF4444'; // Red
    case 'Very High': return '#F97316'; // Orange
    case 'High': return '#F59E0B'; // Amber
    case 'Moderate': return '#EAB308'; // Yellow
    case 'Low': return '#22C55E'; // Green
    default: return '#3B82F6'; // Blue
  }
};

const createCustomIcon = (category: string) => {
  const color = getMarkerColor(category);
  
  return L.divIcon({
    className: 'custom-icon',
    html: `
      <div style="
        background-color: ${color};
        width: 24px;
        height: 24px;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

export const Map: React.FC<MapProps> = ({ hotspots, onMarkerClick }) => {
  return (
    <div className="h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {hotspots.map((hotspot) => (
          <Marker 
            key={hotspot.id}
            position={[hotspot.latitude, hotspot.longitude]}
            icon={createCustomIcon(hotspot.riskCategory)}
            eventHandlers={{
              click: () => onMarkerClick(hotspot),
            }}
          >
            <Popup className="rounded-xl overflow-hidden">
              <div className="p-1">
                <h3 className="font-bold text-sm mb-1">{hotspot.location}</h3>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-500">Risk Score</span>
                  <span className="font-bold">{hotspot.riskScore}/100</span>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold text-center text-white ${
                  hotspot.riskCategory === 'Critical' ? 'bg-red-500' :
                  hotspot.riskCategory === 'Very High' ? 'bg-orange-500' :
                  hotspot.riskCategory === 'High' ? 'bg-amber-500' :
                  hotspot.riskCategory === 'Moderate' ? 'bg-yellow-500' :
                  'bg-green-500'
                }`}>
                  {hotspot.riskCategory}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

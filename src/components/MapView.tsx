import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Donor } from '../services/donorService';
import { useApp } from '../context/AppContext';

interface MapViewProps {
  donors: Donor[];
  center?: [number, number];
  zoom?: number;
  selectedCity?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  donors,
  center = [22.3511, 78.6677], // India geographic center
  zoom = 5,
  selectedCity
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const { setActiveDonorForContact, setActiveDonorForRequest } = useApp();

  // Create custom SVG Leaflet Marker Icon
  const createDonorIcon = (bloodGroup: string, isAvailable: boolean) => {
    const bgColor = isAvailable ? '#DC2626' : '#9CA3AF';
    const svgHtml = `
      <div style="position: relative; width: 34px; height: 42px; display: flex; align-items: center; justify-content: center;">
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" style="width: 100%; height: 100%; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.3));">
          <path d="M16 0C7.16344 0 0 7.16344 0 16C0 26.5 16 40 16 40C16 40 32 26.5 32 16C32 7.16344 24.8366 0 16 0Z" fill="${bgColor}" />
          <circle cx="16" cy="15" r="11" fill="#FFFFFF" />
        </svg>
        <div style="position: absolute; top: 7px; left: 0; width: 34px; text-align: center; font-size: 10px; font-weight: 800; color: ${bgColor}; font-family: system-ui, sans-serif;">
          ${bloodGroup}
        </div>
      </div>
    `;

    return L.divIcon({
      html: svgHtml,
      className: 'custom-blood-marker',
      iconSize: [34, 42],
      iconAnchor: [17, 42],
      popupAnchor: [0, -38]
    });
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center,
        zoom,
        zoomControl: true,
        scrollWheelZoom: false
      });

      // CartoDB Positron clean map tiles
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 18
      }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      // Keep map instance or cleanup on unmount
    };
  }, []);

  // Update markers when donors change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    const validDonors = donors.filter((d) => d.coordinates && d.coordinates.lat && d.coordinates.lng);

    validDonors.forEach((donor) => {
      const isAvail = donor.availability === 'Available';
      const marker = L.marker([donor.coordinates.lat, donor.coordinates.lng], {
        icon: createDonorIcon(donor.bloodGroup, isAvail)
      });

      // Popup HTML
      const popupDiv = document.createElement('div');
      popupDiv.className = 'p-3 text-slate-800 text-xs min-w-[210px] space-y-2';
      popupDiv.innerHTML = `
        <div class="flex items-center justify-between pb-1.5 border-b border-slate-100">
          <span class="font-bold text-sm text-slate-900">${donor.name}</span>
          <span class="px-2 py-0.5 rounded text-xs font-extrabold ${donor.bloodGroup.includes('-') ? 'bg-red-50 text-red-700' : 'bg-red-600 text-white'}">${donor.bloodGroup}</span>
        </div>
        <div class="text-[11px] text-slate-500">
          <div>${donor.city}, ${donor.state} · ${donor.pincode}</div>
          <div class="mt-1 font-medium ${isAvail ? 'text-emerald-600' : 'text-slate-400'}">Status: ${donor.availability}</div>
          ${donor.distanceKm !== undefined ? `<div class="text-slate-600 font-semibold mt-0.5">Approx. ${donor.distanceKm} km away</div>` : ''}
        </div>
        <div class="pt-2 flex items-center gap-1.5 border-t border-slate-100">
          <button id="btn-contact-${donor.id}" class="flex-1 py-1 px-2 bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-semibold rounded text-center transition-colors">
            Contact
          </button>
          <button id="btn-request-${donor.id}" class="flex-1 py-1 px-2 bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold rounded text-center transition-colors">
            Request
          </button>
        </div>
      `;

      marker.bindPopup(popupDiv);
      marker.on('popupopen', () => {
        const contactBtn = document.getElementById(`btn-contact-${donor.id}`);
        const requestBtn = document.getElementById(`btn-request-${donor.id}`);
        if (contactBtn) {
          contactBtn.onclick = () => {
            setActiveDonorForContact(donor);
            marker.closePopup();
          };
        }
        if (requestBtn) {
          requestBtn.onclick = () => {
            setActiveDonorForRequest(donor);
            marker.closePopup();
          };
        }
      });

      markersLayer.addLayer(marker);
    });

    // Auto fit bounds if donors present and not empty
    if (validDonors.length > 0) {
      if (validDonors.length === 1) {
        map.setView([validDonors[0].coordinates.lat, validDonors[0].coordinates.lng], 11);
      } else if (selectedCity) {
        const firstMatch = validDonors.find((d) => d.city.toLowerCase().includes(selectedCity.toLowerCase()));
        if (firstMatch) {
          map.setView([firstMatch.coordinates.lat, firstMatch.coordinates.lng], 10);
        }
      }
    }
  }, [donors, selectedCity]);

  return (
    <div className="relative w-full h-full min-h-[460px] rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
      <div ref={mapContainerRef} className="w-full h-full min-h-[460px]" />
      
      {/* Map Legend Overlay */}
      <div className="absolute top-3 right-3 z-[400] bg-white/90 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs shadow-md space-y-1.5 pointer-events-auto">
        <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
          Donor Map Indicator
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-red-600 inline-block shrink-0" />
          <span>Active / Available Donor</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600">
          <span className="w-3 h-3 rounded-full bg-slate-400 inline-block shrink-0" />
          <span>Temporarily Unavailable</span>
        </div>
        <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
          Showing {donors.length} demonstration markers
        </div>
      </div>
    </div>
  );
};

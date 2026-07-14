import React, { useEffect, useRef, useState } from 'react';

interface VisitorLocation {
  id: string;
  countryCode: string;
  countryName: string;
  city: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

interface WorldVisitorMapProps {
  locations: VisitorLocation[];
}

declare global {
  interface Window {
    L: any;
  }
}

// Custom hook to load Leaflet asynchronously from CDN to avoid React 19 package version conflicts
function useLeaflet() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) {
      setReady(true);
      return;
    }

    // Load Leaflet CSS
    const cssId = 'leaflet-cdn-css';
    if (!document.getElementById(cssId)) {
      const link = document.createElement('link');
      link.id = cssId;
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS
    const jsId = 'leaflet-cdn-js';
    let script = document.getElementById(jsId) as HTMLScriptElement;
    if (!script) {
      script = document.createElement('script');
      script.id = jsId;
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      document.body.appendChild(script);
    }

    const onLoad = () => setReady(true);
    script.addEventListener('load', onLoad);

    return () => {
      if (script) {
        script.removeEventListener('load', onLoad);
      }
    };
  }, []);

  return ready;
}

export default function WorldVisitorMap({ locations }: WorldVisitorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersGroupRef = useRef<any>(null);
  const isLeafletReady = useLeaflet();

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current || mapInstanceRef.current) return;

    const L = window.L;

    // Initialize map centering on Asia/Indonesia by default
    const map = L.map(mapContainerRef.current, {
      center: [-2.0, 118.0],
      zoom: 2,
      minZoom: 1.5,
      maxZoom: 9,
      zoomControl: false, // minimalist HUD layout
      attributionControl: false
    });

    // Dark-themed tiles from CartoDB
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 20
    }).addTo(map);

    // Group to manage markers
    const markersGroup = L.featureGroup().addTo(map);

    mapInstanceRef.current = map;
    markersGroupRef.current = markersGroup;

    // Add styles for the custom popups
    const styleId = 'leaflet-custom-popup-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.innerHTML = `
        .leaflet-container {
          background: #020617 !important; /* slate-950 */
        }
        .custom-leaflet-popup .leaflet-popup-content-wrapper {
          background: rgba(2, 6, 23, 0.92) !important;
          border: 1px solid rgba(249, 115, 22, 0.3) !important;
          border-radius: 8px !important;
          color: #f8fafc !important;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.15) !important;
          backdrop-filter: blur(4px);
        }
        .custom-leaflet-popup .leaflet-popup-tip {
          background: rgba(2, 6, 23, 0.92) !important;
          border-left: 1px solid rgba(249, 115, 22, 0.3) !important;
          border-bottom: 1px solid rgba(249, 115, 22, 0.3) !important;
        }
      `;
      document.head.appendChild(style);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isLeafletReady]);

  // Update markers when locations list changes
  useEffect(() => {
    if (!isLeafletReady || !mapInstanceRef.current || !markersGroupRef.current) return;

    const L = window.L;
    const markersGroup = markersGroupRef.current;

    // Clear previous markers
    markersGroup.clearLayers();

    if (locations.length === 0) return;

    locations.forEach((loc) => {
      if (loc.latitude && loc.longitude) {
        // Create glowing neon circle marker
        const marker = L.circleMarker([loc.latitude, loc.longitude], {
          color: '#f97316', // tailwind orange-500
          fillColor: '#f97316',
          fillOpacity: 0.6,
          weight: 1.5,
          radius: 5.5
        });

        const formattedTime = new Date(loc.timestamp).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });

        marker.bindPopup(`
          <div class="font-mono text-[9px] text-slate-355 p-1 space-y-1">
            <div class="flex items-center gap-1.5 border-b border-slate-900 pb-1">
              <span class="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping"></span>
              <strong class="text-orange-400 font-bold uppercase tracking-wider text-[10px]">${loc.city || 'Unknown City'}</strong>
            </div>
            <div>Region: <span class="text-white font-medium">${loc.countryName || 'Unknown'}</span></div>
            <div class="text-slate-500 text-[8px] flex justify-between gap-4 pt-0.5">
              <span>GPS: ${loc.latitude.toFixed(3)}, ${loc.longitude.toFixed(3)}</span>
              <span>${formattedTime}</span>
            </div>
          </div>
        `, {
          closeButton: false,
          className: 'custom-leaflet-popup',
          offset: [0, -3]
        });

        markersGroup.addLayer(marker);
      }
    });

    // Auto-adjust bounds to show all markers with padding
    try {
      const bounds = markersGroup.getBounds();
      if (bounds.isValid()) {
        mapInstanceRef.current.fitBounds(bounds, {
          padding: [25, 25],
          maxZoom: 5
        });
      }
    } catch (e) {
      console.warn("Leaflet bounds zoom error:", e);
    }
  }, [isLeafletReady, locations]);

  return (
    <div className="relative w-full h-[280px] md:h-[300px] rounded-xl overflow-hidden border border-slate-900/60 bg-slate-950 flex items-center justify-center">
      {!isLeafletReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-950/90 text-slate-400 font-mono text-[10px]">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
          <span>CONNECTING_MAP_GPS...</span>
        </div>
      )}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}

"use client";

import { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import commerce from "./Store.json";
import * as turf from "@turf/turf"; // 🔹 Necesario para calcular distancia en km

const INITIAL_CENTER: [number, number] = [-70.6483, -33.4569]; // 📍 Santiago de Chile
const INITIAL_ZOOM = 11;
const CHILE_BOUNDS: [[number, number], [number, number]] = [
  [-75.0, -56.0], // Extremo suroeste
  [-66.0, -17.5], // Extremo noreste
];

const STORES = commerce;

const MapboxExample: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [zoom, setZoom] = useState<number>(INITIAL_ZOOM);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [kmm, setKmm] = useState<number>();

  const updateBounds = () => {
    if (!mapRef.current) return;
  
    const bounds = mapRef.current.getBounds();
    if (!bounds) return; // ✅ Verificamos que bounds no sea null
  
    const ne = bounds.getNorthEast();
    const center = mapRef.current.getCenter();
  
    const distance = turf.distance(
      turf.point([center.lng, center.lat]),
      turf.point([ne.lng, ne.lat]),
      { units: "kilometers" }
    );
  
    setKmm(distance);
  };
  const renderMarkers = (currentZoom: number) => {
    if (!mapRef.current) return;

    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    const filteredStores = STORES.filter((store) => {
      if (currentZoom < 10) return store.Priorizacion === 1;
      if (currentZoom >= 10 && currentZoom <= 12)
        return store.Priorizacion === 1 || store.Priorizacion === 2;
      return true;
    });

    filteredStores.forEach((store) => {
      const longitude = parseFloat(store.longitude as string);
      const latitude = parseFloat(store.latitude as string);
    
      if (isNaN(longitude) || isNaN(latitude)) return;
    
      // 📌 Crear un contenedor div para el popup
      const popupContainer = document.createElement("div");
      popupContainer.className =
        "bg-gray-100 p-2 max-w-[200px]";
    
      // 📌 Agregar contenido
      popupContainer.innerHTML = `
        <h3 class="text-base font-semibold text-gray-900">${store.Nombre_comercial}</h3>
        <p class="text-sm text-gray-700">${store.Direccion_Store || "Dirección no disponible"}</p>
      `;
    
      const popup = new mapboxgl.Popup().setDOMContent(popupContainer);
    
      const marker = new mapboxgl.Marker({
        color:
          store.Priorizacion === 1
            ? "red"
            : store.Priorizacion === 2
            ? "orange"
            : "gray",
      })
        .setLngLat([longitude, latitude])
        .setPopup(popup) // ✅ Ahora el popup usa Tailwind
        .addTo(mapRef.current!);
    
      markersRef.current.push(marker);
    });
    
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    mapboxgl.accessToken =process.env.NEXT_PUBLIC_MAPBOX;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      minZoom: 9,
      maxZoom: 18,
      maxBounds: CHILE_BOUNDS,
    });

    mapRef.current.on("load", () => {
      renderMarkers(INITIAL_ZOOM);
      updateBounds();
    });

    mapRef.current.on("zoomend", () => {
      if (!mapRef.current) return;
      setZoom(mapRef.current.getZoom());
      renderMarkers(mapRef.current.getZoom());
      updateBounds();
    });

    mapRef.current.on("moveend", updateBounds);

    mapRef.current.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current.addControl(new mapboxgl.FullscreenControl(), "top-right");

    return () => {
      mapRef.current?.remove();
    };
  }, []);

  return (
    <>
      <div className="sidebar">Zoom: {zoom.toFixed(2)}</div>
      <div
        id="map-container"
        ref={mapContainerRef}
        style={{ width: "100%", height: "500px" }}
      />
    </>
  );
};

export default MapboxExample;

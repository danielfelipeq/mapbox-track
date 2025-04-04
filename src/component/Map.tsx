"use client";
import {
  APIProvider,
  Map,
  MapControl,
  Marker,
  useMap,
} from "@vis.gl/react-google-maps";
import { useEffect, useState } from "react";

export const MapGoogle = () => {
  type Store = {
    lat: number;
    lng: number;
  };

  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [googleLoaded, setGoogleLoaded] = useState(false);

useEffect(() => {
  if (typeof window !== "undefined" && window.google) {
    setGoogleLoaded(true);
  }
}, []);

  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const map = useMap();

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error obteniendo la ubicación:", error);
          setCurrentLocation({ lat: -12.157, lng: -76.964 });
        },
        { enableHighAccuracy: true, maximumAge: 0 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      console.warn("Geolocalización no está soportada por este navegador.");
      setCurrentLocation({ lat: -12.157, lng: -76.964 });
    }
  }, []);

  useEffect(() => {
    if (selectedStore && map && typeof window !== "undefined" && window.google) {
      const point = map.getProjection()?.fromLatLngToPoint(
        new window.google.maps.LatLng(selectedStore.lat, selectedStore.lng)
      );
      if (point) {
        setPosition({ x: point.x, y: point.y });
      }
    }
  }, [selectedStore, map]);

  return (
    <section className="relative w-full h-full">
      <APIProvider apiKey={key}>
        <Map
          defaultCenter={currentLocation}
          defaultZoom={15}
          gestureHandling={"greedy"}
          disableDefaultUI={true}
          reuseMaps={true}
        >
          <MapControl position={window?.google?.maps?.ControlPosition?.TOP_LEFT}>
            .. any component here will be added to the control-containers of the
            google map instance ..
          </MapControl>
          <Marker position={currentLocation} onClick={() => setSelectedStore(currentLocation)} />
        </Map>
      </APIProvider>

      {/* Info Container - Mobile y Desktop */}
      {selectedStore && (
        <div
          className={`
            fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg border-t border-gray-300 
            md:absolute md:w-auto md:p-3 md:shadow-md md:border md:rounded-lg md:bg-white
          `}
          style={
            position && window.innerWidth >= 768
              ? {
                  top: `${position.y}px`,
                  left: `${position.x}px`,
                  transform: "translate(-50%, -100%)",
                }
              : {}
          }
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-black">Ubicación Seleccionada</h3>
            <button onClick={() => setSelectedStore(null)} className="text-gray-500">✕</button>
          </div>
          <p className="text-black text-sm mt-2">
            Latitud: {selectedStore.lat.toFixed(5)}, Longitud: {selectedStore.lng.toFixed(5)}
          </p>
        </div>
      )}
    </section>
  );
};

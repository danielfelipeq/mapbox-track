'use client'
import { useEffect, useState } from 'react';

const GeoComponent = () => {
    const [geoData, setGeoData] = useState<{
        city: string;
        region: string;
        country: string;
        latitude: number | null;
        longitude: number | null;
    } | null>(null);

    useEffect(() => {
        // Obtén la cookie de geolocalización
        const cookie = document.cookie
            .split('; ')
            .find(row => row.startsWith('geoLocation='));

        if (cookie) {
            const geoLocation = decodeURIComponent(cookie.split('=')[1]);
            setGeoData(JSON.parse(geoLocation));
        } else {
            setGeoData(null);
        }
    }, []);

    if (!geoData) return <p>Loading...</p>;

    return (
        <div>
            <h1>Your Location</h1>
            <p>City: {geoData.city}</p>
            <p>Region: {geoData.region}</p>
            <p>Country: {geoData.country}</p>
            <p>Latitude: {geoData.latitude}</p>
            <p>Longitude: {geoData.longitude}</p>
        </div>
    );
};

export default GeoComponent;

'use client'
import { useEffect, useState } from 'react';

const GeoComponent = () => {
    const [geoData, setGeoData] = useState<{ latitude: number; longitude: number } | null>(null);

    useEffect(() => {
        const geoLocation = document.cookie
            .split('; ')
            .find(row => row.startsWith('geoLocation='))
            ?.split('=')[1];
        if (geoLocation) {
            setGeoData(JSON.parse(decodeURIComponent(geoLocation)));
        }
    }, []);

    if (!geoData) return <p className='text-black'>Loading...</p>;

    return (
        <div>
            <h1 className='text-black'>Your Location</h1>
            <p className='text-black'>Latitude: {geoData.latitude}</p>
            <p className='text-black'>Longitude: {geoData.longitude}</p>
        </div>
    );
};

export default GeoComponent;
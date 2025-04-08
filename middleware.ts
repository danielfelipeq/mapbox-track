import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const { geo } = req;

    // Verifica si la información de geolocalización está disponible
    if (geo) {
        const { city, region, country, latitude, longitude } = geo;

        // Almacena la geolocalización en una cookie
        req.cookies.set(
            'geoLocation',
            JSON.stringify({ city, region, country, latitude, longitude }),
        );

        console.log('GeoLocation set in cookie:', {
            city,
            region,
            country,
            latitude,
            longitude,
        });
    } else {
        console.log('Geolocation data is unavailable');
    }

    // Continúa con la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Aplica el middleware a todas las rutas
};

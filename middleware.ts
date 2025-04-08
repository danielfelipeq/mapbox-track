import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    // Obtén la IP del cliente desde las cabeceras
    const ip =
        req.headers.get('x-forwarded-for')?.split(',')[0] || // Caso común en proxys o Vercel
        '127.0.0.1'; // Fallback para testing local

    let latitude = null;
    let longitude = null;

    try {
        // Llama a un servicio de geolocalización basado en IP
        const geoLocationAPI = `https://ipapi.co/${ip}/json/`; // Ejemplo de API pública
        const geoData = await fetch(geoLocationAPI).then(res => res.json());

        // Extrae latitud y longitud
        latitude = geoData.latitude;
        longitude = geoData.longitude;
    } catch (error) {
        console.error('Error fetching geolocation:', error);
    }

    // Almacena la información de geolocalización en una cookie
    req.cookies.set(
        'geoLocation',
        JSON.stringify({ latitude, longitude }),
    );

    // Continúa con la solicitud
    return NextResponse.next();
}

export const config = {
    matcher: '/:path*', // Aplica el middleware a todas las rutas
};

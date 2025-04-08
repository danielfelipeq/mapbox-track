import 'next/server';

declare module 'next/server' {
    export interface NextRequest {
        geo?: {
            city?: string;
            region?: string;
            country?: string;
            latitude?: number;
            longitude?: number;
        };
    }
}

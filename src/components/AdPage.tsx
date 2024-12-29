"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdPage({ originalUrl }: { originalUrl: string }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(originalUrl); // Redirect to the original URL
        }, 1000); // 1-second delay

        return () => clearTimeout(timer); // Cleanup timer on unmount
    }, [router, originalUrl]);

    return (
        <div className="z-50 flex flex-col items-center justify-center h-screen bg-gradient-to-br from-gray-800 to-gray-900 text-center text-white">
            <h1 className="text-4xl font-bold mb-4">Welcome to LinkShare</h1>
            <p className="mb-6 text-lg text-gray-300">
                Discover how LinkShare can simplify your URL management. Redirecting you shortly...
            </p>
            <Image
                src="/home.png" 
                alt="Advertisement"
                width={400}
                height={300}
                className="rounded-lg shadow-lg mb-6"
            />
            <p className="text-sm text-gray-400">Taking you to your destination in just a moment...</p>
        </div>
    );
}




// import { NextRequest, NextResponse } from 'next/server';
// import prisma from '@/lib/prisma'; // Replace with your actual Prisma client import

// export async function GET(req: NextRequest, { params }: { params: { shortUrl: string } }) {
//     try {
//         const host = req.headers.get('host'); // Extract the host (e.g., mydomain.com or defaultdomain.com)
//         const protocol = req.headers.get('x-forwarded-proto') || 'http'; // Determine protocol
//         const {shortUrl} = await params; // The short URL from the request path

//         const fullShortUrl = `${protocol}://${host}/${shortUrl}`; // Full short URL (e.g., https://mydomain.com/short123)

//         // Look up the link from the database
//         const link = await prisma.link.findUnique({
//             where: { shortUrl: fullShortUrl },
//         });

//         if (link?.originalUrl) {
//             // Increment the click count
//             await prisma.link.update({
//                 where: { shortUrl: fullShortUrl },
//                 data: { clicks: { increment: 1 } },
//             });

//             // Redirect to the original URL
//             return NextResponse.redirect(link.originalUrl);
//         }

//         // Return 404 if the link does not exist
//         return NextResponse.json({ message: '404 - Link not found' }, { status: 404 });

//     } catch (error) {
//         console.error('Error during redirection:', error);
//         return NextResponse.json({ message: 'Internal server error', error }, { status: 500 });
//     }
// }


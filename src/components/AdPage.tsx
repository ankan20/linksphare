"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdPage({ originalUrl }: { originalUrl: string }) {
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            router.replace(originalUrl); // Redirect to the original URL
        }, 1000); // 3-second delay

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

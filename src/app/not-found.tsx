"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white text-black px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p className="mb-6 text-center max-w-md">
                Sorry, the page you are looking for does not exist or has been moved.
            </p>
            <Link href="/" className="px-6 py-2 bg-black text-white rounded-full font-bold hover:bg-gray-800 transition">
                Go to Homepage
            </Link>
        </div>
    );
} 
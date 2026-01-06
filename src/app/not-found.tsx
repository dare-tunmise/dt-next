"use client";

import Link from 'next/link';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-24 text-center">
        <h1 className="text-6xl font-bold font-mono mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-6">Page Not Found</h2>
        <p className="text-muted-foreground mb-8 max-w-md mx-auto">
          The page you are looking for doesn't exist or has been moved to a new URL.
        </p>
        <Link href="/">
          <Button size="lg">Return Home</Button>
        </Link>
      </main>
      <Footer />
    </div>
  );
}
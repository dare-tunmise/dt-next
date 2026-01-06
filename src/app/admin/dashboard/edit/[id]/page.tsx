'use client';

import dynamic from 'next/dynamic';


const BlogEditor = dynamic(() => import('@/pages/dashboard/BlogEditor'), { 
  ssr: false,
  loading: () => <div className="p-8 text-center font-mono">Loading Editor...</div>
});

export default function EditPostPage() {
  return <BlogEditor />;
}
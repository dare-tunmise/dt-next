"use client";

import { useEffect, useState, useMemo } from 'react';
// 1. Next.js navigation hooks
import { useRouter, useParams } from 'next/navigation'; 
import dynamic from 'next/dynamic'; // 2. For Dynamic Importing
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// 3. Dynamically import ReactQuill to disable SSR (Server Side Rendering)
// This prevents the "window is not defined" error.
const ReactQuill = dynamic(() => import('react-quill-new'), { 
  ssr: false,
  loading: () => <div className="h-[400px] w-full bg-muted animate-pulse rounded-md" />
});
import 'react-quill-new/dist/quill.snow.css';

export default function BlogEditor() {
  const params = useParams();
  const id = params?.id as string; // Will be undefined on the /new route
  const router = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    category: 'writings' as 'writings' | 'projects',
    date: '',
    githubLink: '',
    published: false,
  });

  useEffect(() => {
    if (id) {
      fetchBlog();
    }
  }, [id]);

  const fetchBlog = async () => {
    try {
      const data = await api.dashboard.getAllBlogs();
      // Use _id or id based on your backend schema
      const blog = data.blogs.find((b: any) => (b._id || b.id) === id);
      if (blog) {
        setFormData({
          title: blog.title,
          body: blog.body,
          category: blog.category,
          date: blog.date ? new Date(blog.date).toISOString().split('T')[0] : '',
          githubLink: blog.githubLink || '',
          published: blog.published,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blog',
        variant: 'destructive',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (id) {
        await api.dashboard.updateBlog(id, formData);
        toast({ title: 'Success', description: 'Post updated' });
      } else {
        await api.dashboard.createBlog(formData);
        toast({ title: 'Success', description: 'Post created' });
      }
      router.push('/admin/dashboard'); // 4. router.push instead of navigate
    } catch (error) {
      console.error('Save error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save post',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Memoize modules to avoid unnecessary re-renders of the editor
  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      ['clean'],
    ],
    clipboard: {
    matchVisual: false, 
  }
  }), []);

  useEffect(() => {
  if (typeof window !== 'undefined') {
    const Quill = require('react-quill-new').Quill;
    const Block = Quill.import('blots/block');
    Block.tagName = 'p';
    Quill.register(Block, true);
  }
}, []);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground font-mono">
        {id ? 'Edit Post' : 'Create New Post'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="category" className="font-mono">Category</Label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'writings' | 'projects' })}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            required
          >
            <option value="writings">Writings</option>
            <option value="projects">Projects</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="title" className="font-mono">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="font-mono"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="date" className="font-mono">Publish Date</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="font-mono"
          />
        </div>

        {formData.category === 'projects' && (
          <div className="space-y-2">
            <Label htmlFor="githubLink" className="font-mono">GitHub Link</Label>
            <Input
              id="githubLink"
              type="url"
              value={formData.githubLink}
              onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
              placeholder="https://github.com/username/repo"
              className="font-mono"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label className="font-mono">Content</Label>
          <div className="bg-card border border-border rounded-md min-h-[400px]">
            <ReactQuill
              theme="snow"
              value={formData.body}
              onChange={(content) => setFormData({ ...formData, body: content })}
              modules={modules}
              preserveWhitespace={true}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="published"
            checked={formData.published}
            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
            className="h-4 w-4"
          />
          <Label htmlFor="published" className="font-mono cursor-pointer">
            Publish immediately
          </Label>
        </div>

        <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/dashboard')}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? 'Saving...' : id ? 'Update Post' : 'Create Post'}
          </Button>
        </div>
      </form>
    </div>
  );
}
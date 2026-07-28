"use client";

import { useEffect, useState, useMemo } from 'react';
// 1. Next.js navigation hooks
import { useRouter, useParams } from 'next/navigation'; 
import dynamic from 'next/dynamic'; // 2. For Dynamic Importing
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { adminLabel, quietAction, primaryButton, fieldInput } from '@/lib/adminStyles';

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
    <div>
      <h1 className="text-2xl text-foreground">
        {id ? 'Edit post' : 'New post'}
      </h1>

      <form onSubmit={handleSubmit} className="mt-10 space-y-10">
        {/* Category and date share a row — they're both short metadata. */}
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <label htmlFor="category" className={adminLabel}>Category</label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as 'writings' | 'projects' })}
              className={`${fieldInput} mt-3 cursor-pointer`}
              required
            >
              <option value="writings">Writings</option>
              <option value="projects">Projects</option>
            </select>
          </div>

          <div>
            <label htmlFor="date" className={adminLabel}>Publish date</label>
            <input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={`${fieldInput} mt-3`}
            />
          </div>
        </div>

        <div>
          <label htmlFor="title" className={adminLabel}>Title</label>
          <input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            placeholder="Untitled"
            className={`${fieldInput} mt-3 text-2xl`}
          />
        </div>

        {formData.category === 'projects' && (
          <div>
            <label htmlFor="githubLink" className={adminLabel}>Link</label>
            <input
              id="githubLink"
              type="url"
              value={formData.githubLink}
              onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
              placeholder="Live site or repo — https://…"
              className={`${fieldInput} mt-3`}
            />
          </div>
        )}

        <div>
          <label className={adminLabel}>Content</label>
          <div className="mt-3 min-h-[400px] border-t border-border pt-3">
            <ReactQuill
              theme="snow"
              value={formData.body}
              onChange={(content) => setFormData({ ...formData, body: content })}
              modules={modules}
              preserveWhitespace={true}
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-6 border-t border-border pt-8">
          <label htmlFor="published" className="flex cursor-pointer items-center gap-3">
            <input
              type="checkbox"
              id="published"
              checked={formData.published}
              onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
              className="h-4 w-4 accent-accent"
            />
            <span className={adminLabel}>Publish immediately</span>
          </label>

          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => router.push('/admin/dashboard')}
              className={quietAction}
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className={primaryButton}>
              {loading ? 'Saving…' : id ? 'Update post' : 'Create post'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
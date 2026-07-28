import { useEffect, useState } from 'react';
import Link from 'next/link'
import { api } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { adminLabel, quietAction, dangerAction, primaryButton } from '@/lib/adminStyles';

interface Blog {
  _id?: string; // Backend uses _id not id
  title: string;
  slug: string;
  category: 'writings' | 'projects';
  published: boolean;
  createdAt: string;
  body?: string;
  readTime?: string;
  date?: string;
}

export default function BlogList() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const data = await api.dashboard.getAllBlogs();
      setBlogs(data.blogs as Blog[]); // Changed from data to data.blogs
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch blogs',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;

    try {
      await api.dashboard.deleteBlog(id);
      toast({ title: 'Success', description: 'Post deleted' });
      fetchBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete post',
        variant: 'destructive',
      });
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await api.dashboard.togglePublish(id, !currentStatus); // Pass the toggled status
      toast({ title: 'Success', description: 'Post status updated' });
      fetchBlogs();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update post',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className={adminLabel}>Loading</div>
    );
  }

  const drafts = blogs.filter((b) => !b.published).length;

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-4">
        <div>
          <h1 className="text-2xl text-foreground">All content</h1>
          <p className="mt-2 text-xs text-muted-foreground">
            {blogs.length} {blogs.length === 1 ? 'post' : 'posts'}
            {drafts > 0 && ` · ${drafts} draft${drafts === 1 ? '' : 's'}`}
          </p>
        </div>
        <Link href="/admin/dashboard/new" className={primaryButton}>
          New post
        </Link>
      </div>

      <div className="mt-10 border-b border-border">
        {blogs.map((blog) => (
          <div key={blog._id} className="border-t border-border py-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:justify-between md:gap-8">
              <div className="min-w-0">
                <div className="flex items-baseline gap-3">
                  {/* Dot is a glance-level cue only — the word "Draft" below
                      carries the meaning, so status is never colour-alone. */}
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                      blog.published ? 'bg-accent' : 'bg-muted-foreground'
                    }`}
                  />
                  <h2 className="truncate text-lg text-foreground">{blog.title}</h2>
                </div>
                <p className="mt-1 break-all pl-[1.125rem] text-xs text-muted-foreground">
                  {blog.published ? 'Published' : 'Draft'} · {blog.category} ·{' '}
                  /{blog.category === 'writings' ? 'writing' : 'project'}/{blog.slug}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap gap-x-5 gap-y-2 pl-[1.125rem] md:pl-0">
                <Link href={`/admin/dashboard/edit/${blog._id}`} className={quietAction}>
                  Edit
                </Link>
                <Link
                  href={`/admin/dashboard/analytics/${blog._id}`}
                  className={quietAction}
                >
                  Stats
                </Link>
                <button
                  type="button"
                  onClick={() => handleTogglePublish(blog._id!, blog.published)}
                  className={quietAction}
                >
                  {blog.published ? 'Unpublish' : 'Publish'}
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(blog._id!)}
                  className={dangerAction}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="border-t border-border py-12 text-center text-sm text-muted-foreground">
            No posts yet. Create your first one.
          </div>
        )}
      </div>
    </div>
  );
}

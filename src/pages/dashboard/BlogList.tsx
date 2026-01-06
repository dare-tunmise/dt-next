import { useEffect, useState } from 'react';
import Link from 'next/link'
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Blog {
  _id: string; // Backend uses _id not id
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
      setBlogs(data.blogs); // Changed from data to data.blogs
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
    return <div className="text-foreground font-mono">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground font-mono">All Content</h1>
        <Link href="/admin/dashboard/new">
          <Button>Create New Post</Button>
        </Link>
      </div>

      <div className="space-y-4">
        {blogs.map((blog) => (
          <div
            key={blog._id}
            className="border border-border rounded-lg p-6 bg-card"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-xl font-semibold text-foreground font-mono">
                    {blog.title}
                  </h3>
                  <span className="text-xs px-2 py-1 rounded bg-accent/20 text-accent font-mono">
                    {blog.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-mono ${
                    blog.published 
                      ? 'bg-green-500/20 text-green-500' 
                      : 'bg-yellow-500/20 text-yellow-500'
                  }`}>
                    {blog.published ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  /{blog.category === 'writings' ? 'blog' : 'project'}/{blog.slug}
                </p>
              </div>

              <div className="flex gap-2">
                <Link href={`/admin/dashboard/edit/${blog._id}`}>
                  <Button variant="outline" size="sm">Edit</Button>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTogglePublish(blog._id, blog.published)}
                >
                  {blog.published ? 'Unpublish' : 'Publish'}
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDelete(blog._id)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}

        {blogs.length === 0 && (
          <div className="text-center py-12 text-muted-foreground font-mono">
            No posts yet. Create your first post!
          </div>
        )}
      </div>
    </div>
  );
}

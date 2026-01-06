import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, PenSquare, List } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <Link to="/" className="text-xl font-bold font-mono">
                Blog Admin
              </Link>
              <nav className="flex gap-4">
                <Link to="/admin/dashboard">
                  <Button 
                    variant={location.pathname === '/admin/dashboard' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <List className="w-4 h-4 mr-2" />
                    All Posts
                  </Button>
                </Link>
                <Link to="/admin/dashboard/new">
                  <Button 
                    variant={location.pathname === '/admin/dashboard/new' ? 'default' : 'ghost'}
                    size="sm"
                  >
                    <PenSquare className="w-4 h-4 mr-2" />
                    New Post
                  </Button>
                </Link>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">
                <span className="text-muted-foreground">Welcome, </span>
                <span className="font-semibold">{user?.name}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={logout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
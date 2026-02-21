import { ReactNode } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useAuth } from '../auth/authStore';
import { Button } from '@/components/ui/button';
import { Menu, X, LogOut, Home, Info, MessageSquare, Calendar, FileText, Settings, LayoutDashboard, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated, username, role, logout } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    queryClient.clear();
    navigate({ to: '/login' });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-card/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                SS
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Sri Sri Gold Testing</h1>
                <p className="text-xs text-muted-foreground">Quality Testing Services</p>
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-4">
              {!isAuthenticated ? (
                <>
                  <Link to="/shop-info">
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4 mr-2" />
                      Shop Info
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="default" size="sm">Login</Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline" size="sm">Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/welcome">
                    <Button variant="ghost" size="sm">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/shop-info">
                    <Button variant="ghost" size="sm">
                      <Info className="w-4 h-4 mr-2" />
                      Shop Info
                    </Button>
                  </Link>
                  {role === 'owner' ? (
                    <Link to="/owner-dashboard">
                      <Button variant="ghost" size="sm">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/test-results">
                        <Button variant="ghost" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Test Results
                        </Button>
                      </Link>
                      <Link to="/daily-gold-updates">
                        <Button variant="ghost" size="sm">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Daily Gold Updates
                        </Button>
                      </Link>
                      <Link to="/appointments">
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4 mr-2" />
                          Appointments
                        </Button>
                      </Link>
                      <Link to="/feedback">
                        <Button variant="ghost" size="sm">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Feedback
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/settings">
                    <Button variant="ghost" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <div className="flex items-center gap-2 pl-2 border-l border-border">
                    <span className="text-sm text-muted-foreground">
                      {username} ({role})
                    </span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </nav>

            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>

          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 flex flex-col gap-2">
              {!isAuthenticated ? (
                <>
                  <Link to="/shop-info" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Info className="w-4 h-4 mr-2" />
                      Shop Info
                    </Button>
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="default" size="sm" className="w-full">Login</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="outline" size="sm" className="w-full">Register</Button>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/welcome" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Home className="w-4 h-4 mr-2" />
                      Home
                    </Button>
                  </Link>
                  <Link to="/shop-info" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Info className="w-4 h-4 mr-2" />
                      Shop Info
                    </Button>
                  </Link>
                  {role === 'owner' ? (
                    <Link to="/owner-dashboard" onClick={() => setMobileMenuOpen(false)}>
                      <Button variant="ghost" size="sm" className="w-full justify-start">
                        <LayoutDashboard className="w-4 h-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/test-results" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <FileText className="w-4 h-4 mr-2" />
                          Test Results
                        </Button>
                      </Link>
                      <Link to="/daily-gold-updates" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <TrendingUp className="w-4 h-4 mr-2" />
                          Daily Gold Updates
                        </Button>
                      </Link>
                      <Link to="/appointments" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <Calendar className="w-4 h-4 mr-2" />
                          Appointments
                        </Button>
                      </Link>
                      <Link to="/feedback" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" size="sm" className="w-full justify-start">
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Feedback
                        </Button>
                      </Link>
                    </>
                  )}
                  <Link to="/settings" onClick={() => setMobileMenuOpen(false)}>
                    <Button variant="ghost" size="sm" className="w-full justify-start">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </Link>
                  <div className="pt-2 border-t border-border">
                    <p className="text-sm text-muted-foreground px-3 py-2">
                      Logged in as: {username} ({role})
                    </p>
                    <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Logout
                    </Button>
                  </div>
                </>
              )}
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="bg-card/80 backdrop-blur-md border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} Sri Sri Gold Testing Shop. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Built with ❤️ using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 hover:text-amber-700 font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

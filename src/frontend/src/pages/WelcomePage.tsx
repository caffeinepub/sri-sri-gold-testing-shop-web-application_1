import { useAuth } from '../auth/authStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { FileText, Calendar, MessageSquare, LayoutDashboard, Info, Share2 } from 'lucide-react';
import ShareAppLinkCard from '../components/ShareAppLinkCard';
import PwaInstallHelp from '../components/PwaInstallHelp';

export default function WelcomePage() {
  const { username, role } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">
          Welcome, {username}!
        </h1>
        <p className="text-lg text-muted-foreground">
          You are logged in as: <span className="font-semibold text-amber-600">{role === 'owner' ? 'Owner' : 'Customer'}</span>
        </p>
      </div>

      <PwaInstallHelp />

      {role === 'owner' ? (
        <div className="grid gap-6 md:grid-cols-2">
          <Link to="/owner-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-amber-600" />
                  Owner Dashboard
                </CardTitle>
                <CardDescription>
                  Manage test results, appointments, feedback, and users
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/shop-info">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  Shop Information
                </CardTitle>
                <CardDescription>
                  View and edit shop details, address, and timings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Link to="/test-results">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Test Results
                </CardTitle>
                <CardDescription>
                  Search and view your test results by serial number
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/appointments">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-amber-600" />
                  Book Appointment
                </CardTitle>
                <CardDescription>
                  Schedule your next test appointment
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/feedback">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-amber-600" />
                  Feedback
                </CardTitle>
                <CardDescription>
                  Share your experience with us
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link to="/shop-info">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  Shop Information
                </CardTitle>
                <CardDescription>
                  View shop address, contact, and timings
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      )}

      <ShareAppLinkCard />
    </div>
  );
}

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, redirect } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { useAuth } from './auth/authStore';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import WelcomePage from './pages/WelcomePage';
import ShopInfoPage from './pages/ShopInfoPage';
import FeedbackPage from './pages/FeedbackPage';
import AppointmentsPage from './pages/AppointmentsPage';
import TestResultsLookupPage from './pages/TestResultsLookupPage';
import DailyGoldUpdatesPage from './pages/DailyGoldUpdatesPage';
import OwnerDashboardPage from './pages/owner/OwnerDashboardPage';
import ForgotPasswordRequestPage from './pages/ForgotPasswordRequestPage';
import ResetPasswordWithPasscodePage from './pages/ResetPasswordWithPasscodePage';
import SettingsPage from './pages/SettingsPage';
import AppLayout from './components/AppLayout';

const rootRoute = createRootRoute({
  component: () => (
    <AppLayout>
      <Outlet />
    </AppLayout>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  beforeLoad: () => {
    const { isAuthenticated } = useAuth.getState();
    if (isAuthenticated) {
      throw redirect({ to: '/welcome' });
    }
  },
  component: LoginPage,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: RegisterPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/forgot-password',
  component: ForgotPasswordRequestPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reset-password',
  component: ResetPasswordWithPasscodePage,
});

const shopInfoRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/shop-info',
  component: ShopInfoPage,
});

const welcomeRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/welcome',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: WelcomePage,
});

const feedbackRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/feedback',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: FeedbackPage,
});

const appointmentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/appointments',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: AppointmentsPage,
});

const testResultsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/test-results',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: TestResultsLookupPage,
});

const dailyGoldUpdatesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/daily-gold-updates',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: DailyGoldUpdatesPage,
});

const ownerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner-dashboard',
  beforeLoad: () => {
    const { isAuthenticated, role, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
    if (role !== 'owner') {
      throw redirect({ to: '/welcome' });
    }
  },
  component: OwnerDashboardPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  beforeLoad: () => {
    const { isAuthenticated, handshakeComplete } = useAuth.getState();
    if (!isAuthenticated || !handshakeComplete) {
      throw redirect({ to: '/login' });
    }
  },
  component: SettingsPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  registerRoute,
  forgotPasswordRoute,
  resetPasswordRoute,
  shopInfoRoute,
  welcomeRoute,
  feedbackRoute,
  appointmentsRoute,
  testResultsRoute,
  dailyGoldUpdatesRoute,
  ownerDashboardRoute,
  settingsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

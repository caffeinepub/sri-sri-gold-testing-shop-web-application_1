import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { useAuth } from '../auth/authStore';
import { useAddCustomer } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { extractErrorMessage } from '../utils/canisterErrors';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { registerCustomer } = useAuth();
  const addCustomerMutation = useAddCustomer();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    mobileNumber: '',
    email: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (form.mobileNumber.length < 10) {
      setError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);

    try {
      // First, save to backend canister (source of truth)
      await addCustomerMutation.mutateAsync({
        username: form.username,
        password: form.password,
        mobileNumber: form.mobileNumber,
        email: form.email,
      });

      // Only after backend success, update localStorage
      const success = await registerCustomer(form.username, form.password, form.mobileNumber);
      if (!success) {
        setError('Username already exists locally');
        setLoading(false);
        return;
      }

      toast.success('Registration successful! Please log in.');
      navigate({ to: '/login' });
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setError(`Registration failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Account</CardTitle>
          <CardDescription>Register as a new customer</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile Number</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="Enter your mobile number"
                value={form.mobileNumber}
                onChange={(e) => setForm({ ...form, mobileNumber: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email (Optional)</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <div className="text-sm text-muted-foreground w-full">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Sign in here
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

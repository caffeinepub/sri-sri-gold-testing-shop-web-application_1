import { useState } from 'react';
import { useNavigate, Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ResetPasswordWithPasscodePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    mobileNumber: '',
    passcode: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.passcode.length !== 4) {
      setError('Passcode must be 4 digits');
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const passcodes = JSON.parse(localStorage.getItem('resetPasscodes') || '{}');
      
      if (passcodes[form.mobileNumber] !== form.passcode) {
        setError('Invalid passcode');
        setLoading(false);
        return;
      }

      const customers = JSON.parse(localStorage.getItem('customers') || '[]');
      const customerIndex = customers.findIndex((c: any) => c.mobileNumber === form.mobileNumber);
      
      if (customerIndex === -1) {
        setError('Mobile number not found');
        setLoading(false);
        return;
      }

      customers[customerIndex].password = form.newPassword;
      localStorage.setItem('customers', JSON.stringify(customers));
      
      delete passcodes[form.mobileNumber];
      localStorage.setItem('resetPasscodes', JSON.stringify(passcodes));

      toast.success('Password reset successfully! Please log in with your new password.');
      navigate({ to: '/login' });
    } catch (err) {
      setError('Password reset failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter the 4-digit code provided by the shop owner
          </CardDescription>
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
              <Label htmlFor="passcode">4-Digit Reset Code</Label>
              <Input
                id="passcode"
                type="text"
                placeholder="Enter 4-digit code"
                maxLength={4}
                value={form.passcode}
                onChange={(e) => setForm({ ...form, passcode: e.target.value.replace(/\D/g, '') })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Reset Password
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-center text-muted-foreground">
            <Link to="/login" className="text-amber-600 hover:text-amber-700 font-medium">
              Back to login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ForgotPasswordRequestPage() {
  const [mobileNumber, setMobileNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const requests = JSON.parse(localStorage.getItem('passwordResetRequests') || '[]');
      requests.push({ mobileNumber, timestamp: Date.now() });
      localStorage.setItem('passwordResetRequests', JSON.stringify(requests));
      
      setSubmitted(true);
      toast.success('Password reset request submitted. The owner will contact you with a reset code.');
    } catch (error) {
      toast.error('Failed to submit request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Forgot Password</CardTitle>
          <CardDescription>
            Request a password reset from the shop owner
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted ? (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your request has been submitted. The shop owner will contact you with a 4-digit reset code via WhatsApp or phone.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your registered mobile number"
                  value={mobileNumber}
                  onChange={(e) => setMobileNumber(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Request
              </Button>
            </form>
          )}
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <div className="text-sm text-center text-muted-foreground">
            Already have a reset code?{' '}
            <Link to="/reset-password" className="text-amber-600 hover:text-amber-700 font-medium">
              Reset password here
            </Link>
          </div>
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

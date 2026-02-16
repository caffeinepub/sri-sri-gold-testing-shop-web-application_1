import { useState } from 'react';
import { useAddAppointment } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AppointmentsPage() {
  const addAppointmentMutation = useAddAppointment();
  const [form, setForm] = useState({
    serialNumber: '',
    testType: '',
    appointmentDate: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addAppointmentMutation.mutateAsync(form);
      
      setSubmitted(true);
      toast.success('Appointment request submitted successfully!');
      setForm({ serialNumber: '', testType: '', appointmentDate: '' });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to submit appointment. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Book an Appointment</CardTitle>
          <CardDescription>
            Schedule your test appointment with us
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your appointment request has been submitted successfully!
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number / Reference</Label>
              <Input
                id="serialNumber"
                type="text"
                placeholder="Enter serial number or reference"
                value={form.serialNumber}
                onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type / Purpose</Label>
              <Textarea
                id="testType"
                placeholder="Describe the test type or purpose of appointment"
                value={form.testType}
                onChange={(e) => setForm({ ...form, testType: e.target.value })}
                rows={3}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="appointmentDate">Preferred Date & Time</Label>
              <Input
                id="appointmentDate"
                type="datetime-local"
                value={form.appointmentDate}
                onChange={(e) => setForm({ ...form, appointmentDate: e.target.value })}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={addAppointmentMutation.isPending}
            >
              {addAppointmentMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Appointment Request
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

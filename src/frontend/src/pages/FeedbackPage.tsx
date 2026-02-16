import { useState } from 'react';
import { useAuth } from '../auth/authStore';
import { useAddFeedback } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function FeedbackPage() {
  const { username } = useAuth();
  const addFeedbackMutation = useAddFeedback();
  const [form, setForm] = useState({
    customerFirstName: username || '',
    feedback: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await addFeedbackMutation.mutateAsync({
        feedback: form.feedback,
        customerFirstName: form.customerFirstName,
      });
      
      setSubmitted(true);
      toast.success('Thank you for your feedback!');
      setForm({ ...form, feedback: '' });
      
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Share Your Feedback</CardTitle>
          <CardDescription>
            We value your opinion and would love to hear about your experience
          </CardDescription>
        </CardHeader>
        <CardContent>
          {submitted && (
            <Alert className="mb-4 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Your feedback has been submitted successfully!
              </AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={form.customerFirstName}
                onChange={(e) => setForm({ ...form, customerFirstName: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="feedback">Feedback</Label>
              <Textarea
                id="feedback"
                placeholder="Share your thoughts, suggestions, or concerns..."
                value={form.feedback}
                onChange={(e) => setForm({ ...form, feedback: e.target.value })}
                rows={6}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={addFeedbackMutation.isPending}
            >
              {addFeedbackMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit Feedback
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from 'react';
import { useUpdateTestResult } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { extractErrorMessage } from '../../utils/canisterErrors';

export default function TestResultsManager() {
  const updateTestResultMutation = useUpdateTestResult();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [serialNumber, setSerialNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!serialNumber.trim() || !message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await updateTestResultMutation.mutateAsync({
        serialNumber: serialNumber.trim(),
        message: message.trim(),
      });
      toast.success('Test result saved successfully!');
      setDialogOpen(false);
      setSerialNumber('');
      setMessage('');
    } catch (error) {
      // Log full error for debugging
      console.error('Failed to save test result:', error);
      
      // Extract and display meaningful error message
      const errorMessage = extractErrorMessage(error);
      toast.error(`Failed to save test result: ${errorMessage}`);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Test Results Management</CardTitle>
        <CardDescription>Add or update daily test results</CardDescription>
      </CardHeader>
      <CardContent>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add/Update Test Result
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Test Result Entry</DialogTitle>
              <DialogDescription>
                Enter or update test result information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serialNumber">Serial Number *</Label>
                <Input
                  id="serialNumber"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Enter serial number"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter test result message"
                  rows={6}
                  required
                  className="resize-none"
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={updateTestResultMutation.isPending}>
                  {updateTestResultMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Test Result
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}

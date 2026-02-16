import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Key, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export default function PasswordResetsSection() {
  const [requests, setRequests] = useState<any[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMobile, setSelectedMobile] = useState('');
  const [passcode, setPasscode] = useState('');

  const loadRequests = () => {
    const stored = localStorage.getItem('passwordResetRequests');
    if (stored) {
      setRequests(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadRequests();
    const interval = setInterval(loadRequests, 5000);
    return () => clearInterval(interval);
  }, []);

  const generatePasscode = () => {
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setPasscode(code);
  };

  const handleSetPasscode = () => {
    if (passcode.length !== 4) {
      toast.error('Passcode must be 4 digits');
      return;
    }

    const passcodes = JSON.parse(localStorage.getItem('resetPasscodes') || '{}');
    passcodes[selectedMobile] = passcode;
    localStorage.setItem('resetPasscodes', JSON.stringify(passcodes));

    toast.success(`Passcode ${passcode} set for ${selectedMobile}. Share this code with the customer via WhatsApp or phone.`);
    setDialogOpen(false);
    setPasscode('');
  };

  const copyPasscode = () => {
    navigator.clipboard.writeText(passcode);
    toast.success('Passcode copied to clipboard');
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Password Reset Requests</CardTitle>
            <CardDescription>
              Manage customer password reset requests
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadRequests}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {requests.length === 0 ? (
          <Alert>
            <AlertDescription>No password reset requests.</AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Request Time</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{request.mobileNumber}</TableCell>
                    <TableCell>{new Date(request.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <Dialog open={dialogOpen && selectedMobile === request.mobileNumber} onOpenChange={(open) => {
                        setDialogOpen(open);
                        if (open) setSelectedMobile(request.mobileNumber);
                      }}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Key className="w-4 h-4 mr-2" />
                            Generate Code
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Generate Reset Passcode</DialogTitle>
                            <DialogDescription>
                              Create a 4-digit passcode for {request.mobileNumber}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="passcode">4-Digit Passcode</Label>
                              <div className="flex gap-2">
                                <Input
                                  id="passcode"
                                  type="text"
                                  maxLength={4}
                                  placeholder="Enter or generate"
                                  value={passcode}
                                  onChange={(e) => setPasscode(e.target.value.replace(/\D/g, ''))}
                                />
                                <Button type="button" variant="outline" onClick={generatePasscode}>
                                  Generate
                                </Button>
                              </div>
                            </div>
                            {passcode && (
                              <Alert className="bg-amber-50 border-amber-200">
                                <AlertDescription className="text-amber-800 flex items-center justify-between">
                                  <span>Share this code: <strong className="text-xl">{passcode}</strong></span>
                                  <Button variant="ghost" size="sm" onClick={copyPasscode}>
                                    <Copy className="w-4 h-4" />
                                  </Button>
                                </AlertDescription>
                              </Alert>
                            )}
                          </div>
                          <DialogFooter>
                            <Button onClick={handleSetPasscode} disabled={passcode.length !== 4}>
                              Set Passcode
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

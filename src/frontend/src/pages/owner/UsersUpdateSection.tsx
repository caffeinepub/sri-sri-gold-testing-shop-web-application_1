import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export default function UsersUpdateSection() {
  const [customers, setCustomers] = useState<any[]>([]);

  const loadCustomers = () => {
    const stored = localStorage.getItem('customers');
    if (stored) {
      setCustomers(JSON.parse(stored));
    }
  };

  useEffect(() => {
    loadCustomers();
    const interval = setInterval(loadCustomers, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Update</CardTitle>
            <CardDescription>
              View registered customers and their details
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadCustomers}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Warning:</strong> Displaying passwords in plain text is insecure and not recommended. This feature is included only as explicitly requested.
          </AlertDescription>
        </Alert>

        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total Customers: {customers.length}
          </Badge>
        </div>

        {customers.length === 0 ? (
          <Alert>
            <AlertDescription>No customers registered yet.</AlertDescription>
          </Alert>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Mobile Number</TableHead>
                  <TableHead>Password</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.username}</TableCell>
                    <TableCell>{customer.mobileNumber}</TableCell>
                    <TableCell className="font-mono text-sm">{customer.password}</TableCell>
                    <TableCell>{new Date(customer.registrationDate).toLocaleString()}</TableCell>
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

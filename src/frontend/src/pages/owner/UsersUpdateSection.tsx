import { useGetAllCustomers } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, Loader2, AlertCircle } from 'lucide-react';
import { extractErrorMessage } from '../../utils/canisterErrors';

export default function UsersUpdateSection() {
  const { data: customers, isLoading, error, refetch } = useGetAllCustomers();

  const errorMessage = error ? extractErrorMessage(error) : '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Users Update</CardTitle>
            <CardDescription>
              View registered customers from the canister
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => refetch()}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="text-lg px-4 py-2">
            Total Customers: {customers?.length || 0}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Failed to load customers: {errorMessage}
            </AlertDescription>
          </Alert>
        ) : !customers || customers.length === 0 ? (
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
                </TableRow>
              </TableHeader>
              <TableBody>
                {customers.map((customer, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{customer.username}</TableCell>
                    <TableCell>{customer.mobileNumber}</TableCell>
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

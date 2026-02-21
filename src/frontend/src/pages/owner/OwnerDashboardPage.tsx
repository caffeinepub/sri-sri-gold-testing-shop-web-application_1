import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import TestResultsManager from './TestResultsManager';
import UsersUpdateSection from './UsersUpdateSection';
import PasswordResetsSection from './PasswordResetsSection';
import DailyGoldUpdatesManager from './DailyGoldUpdatesManager';
import { useGetAppointments, useGetAllFeedback } from '../../hooks/useQueries';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { extractErrorMessage } from '../../utils/canisterErrors';

export default function OwnerDashboardPage() {
  const { data: appointments, isLoading: appointmentsLoading, error: appointmentsError } = useGetAppointments();
  const { data: feedback, isLoading: feedbackLoading, error: feedbackError } = useGetAllFeedback();

  const appointmentsErrorMsg = appointmentsError ? extractErrorMessage(appointmentsError) : '';
  const feedbackErrorMsg = feedbackError ? extractErrorMessage(feedbackError) : '';

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Owner Dashboard</h1>
        <p className="text-lg text-muted-foreground">Manage your shop operations</p>
      </div>

      <Tabs defaultValue="test-results" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="test-results">Test Results</TabsTrigger>
          <TabsTrigger value="daily-gold">Daily Gold Updates</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="password-resets">Password Resets</TabsTrigger>
        </TabsList>

        <TabsContent value="test-results">
          <TestResultsManager />
        </TabsContent>

        <TabsContent value="daily-gold">
          <DailyGoldUpdatesManager />
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle>Appointment Requests</CardTitle>
              <CardDescription>View and manage customer appointment requests</CardDescription>
            </CardHeader>
            <CardContent>
              {appointmentsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : appointmentsError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load appointments: {appointmentsErrorMsg}
                  </AlertDescription>
                </Alert>
              ) : !appointments || appointments.length === 0 ? (
                <Alert>
                  <AlertDescription>No appointment requests yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Test Type</TableHead>
                        <TableHead>Appointment Date</TableHead>
                        <TableHead>Request Time</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {appointments.map((appointment, index) => (
                        <TableRow key={index}>
                          <TableCell>{appointment.testType}</TableCell>
                          <TableCell>{appointment.appointmentDate}</TableCell>
                          <TableCell>{new Date(Number(appointment.requestTime) / 1000000).toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card>
            <CardHeader>
              <CardTitle>Customer Feedback</CardTitle>
              <CardDescription>View all customer feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {feedbackLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
              ) : feedbackError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to load feedback: {feedbackErrorMsg}
                  </AlertDescription>
                </Alert>
              ) : !feedback || feedback.length === 0 ? (
                <Alert>
                  <AlertDescription>No feedback submissions yet.</AlertDescription>
                </Alert>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Customer Name</TableHead>
                        <TableHead>Feedback</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedback.map((entry, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{entry.customerFirstName}</TableCell>
                          <TableCell>{entry.feedback}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <UsersUpdateSection />
        </TabsContent>

        <TabsContent value="password-resets">
          <PasswordResetsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}

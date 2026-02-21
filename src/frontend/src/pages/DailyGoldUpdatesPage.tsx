import { useGetAllDailyGoldUpdates } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';
import { extractErrorMessage } from '../utils/canisterErrors';

export default function DailyGoldUpdatesPage() {
  const { data: updates, isLoading, error } = useGetAllDailyGoldUpdates();

  const sortedUpdates = updates ? [...updates].sort((a, b) => b[0].localeCompare(a[0])) : [];
  
  const errorMessage = error ? extractErrorMessage(error) : '';
  const isUnauthorized = errorMessage.toLowerCase().includes('unauthorized') || 
                         errorMessage.toLowerCase().includes('sign in') ||
                         errorMessage.toLowerCase().includes('authenticated');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="w-6 h-6 text-amber-600" />
            Daily Gold Updates
          </CardTitle>
          <CardDescription>
            View the latest gold rates and updates
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {isUnauthorized 
                  ? 'You need to be signed in to view daily gold updates. Please log in and try again.'
                  : `Failed to load daily gold updates: ${errorMessage}`
                }
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && (!sortedUpdates || sortedUpdates.length === 0) && (
            <Alert>
              <AlertDescription>No gold updates yet.</AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && sortedUpdates && sortedUpdates.length > 0 && (
            <div className="space-y-4">
              {sortedUpdates.map(([date, content]) => (
                <Card key={date} className="border-l-4 border-l-amber-600">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{date}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground">{content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

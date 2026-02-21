import { useState, useEffect } from 'react';
import { useGetTestResult } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, FileText, History, X, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { extractErrorMessage } from '../utils/canisterErrors';

export default function TestResultsLookupPage() {
  const [serialNumber, setSerialNumber] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  
  const { data: testResult, isLoading, error, refetch } = useGetTestResult(searchQuery);

  useEffect(() => {
    const stored = localStorage.getItem('testResultsHistory');
    if (stored) {
      setHistory(JSON.parse(stored));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (serialNumber.trim()) {
      setSearchQuery(serialNumber.trim());
      
      if (!history.includes(serialNumber.trim())) {
        const newHistory = [serialNumber.trim(), ...history].slice(0, 10);
        setHistory(newHistory);
        localStorage.setItem('testResultsHistory', JSON.stringify(newHistory));
      }
    }
  };

  const handleHistoryClick = (serial: string) => {
    setSerialNumber(serial);
    setSearchQuery(serial);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('testResultsHistory');
  };

  const errorMessage = error ? extractErrorMessage(error) : '';
  const isUnauthorized = errorMessage.toLowerCase().includes('unauthorized') || 
                         errorMessage.toLowerCase().includes('sign in') ||
                         errorMessage.toLowerCase().includes('authenticated');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <FileText className="w-6 h-6 text-amber-600" />
            Test Results Lookup
          </CardTitle>
          <CardDescription>
            Enter your serial number to view your test results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="serialNumber">Serial Number</Label>
              <div className="flex gap-2">
                <Input
                  id="serialNumber"
                  type="text"
                  placeholder="Enter serial number from your test paper"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  required
                />
                <Button type="submit" disabled={isLoading}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </form>

          {history.length > 0 && (
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <Label className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Recent Searches
                </Label>
                <Button variant="ghost" size="sm" onClick={clearHistory}>
                  <X className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {history.map((serial) => (
                  <Badge
                    key={serial}
                    variant="outline"
                    className="cursor-pointer hover:bg-accent"
                    onClick={() => handleHistoryClick(serial)}
                  >
                    {serial}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {searchQuery && (
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Results for: {searchQuery}</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <Alert>
                <AlertDescription>Loading test results...</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {isUnauthorized 
                    ? 'You need to be signed in to view test results. Please log in and try again.'
                    : `Failed to load test results: ${errorMessage}`
                  }
                </AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && !testResult && (
              <Alert>
                <AlertDescription>No test results found for this serial number.</AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label className="text-muted-foreground">Serial Number</Label>
                    <p className="font-semibold text-lg">{testResult.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Message</Label>
                    <div className="mt-2 p-4 bg-muted/50 rounded-lg border border-border">
                      <p className="whitespace-pre-wrap">
                        {testResult.message || 'No message provided.'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

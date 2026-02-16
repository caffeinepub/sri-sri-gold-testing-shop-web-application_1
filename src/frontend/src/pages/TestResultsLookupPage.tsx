import { useState, useEffect } from 'react';
import { useGetTestResult } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, FileText, History, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
                <AlertDescription>Failed to load test results. Please try again.</AlertDescription>
              </Alert>
            )}

            {!isLoading && !error && !testResult && (
              <Alert>
                <AlertDescription>No test results found for this serial number.</AlertDescription>
              </Alert>
            )}

            {testResult && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <Label className="text-muted-foreground">Serial Number</Label>
                    <p className="font-semibold">{testResult.serialNumber}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">CTS</Label>
                    <p className="font-semibold">{testResult.cts.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">HIV Tests</Label>
                    <p className="font-semibold">{testResult.hivTests.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Plating Tests</Label>
                    <p className="font-semibold">{testResult.platingTests.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Other Tests</Label>
                    <p className="font-semibold">{testResult.potherTests.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Hepatitis C</Label>
                    <p className="font-semibold">{testResult.hepatitisC.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Hepatitis B</Label>
                    <p className="font-semibold">{testResult.hepatitisB.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">RNS</Label>
                    <p className="font-semibold">{testResult.rns.toString()}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Serial Number 2</Label>
                    <p className="font-semibold">{testResult.serialNumber2}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Coagulase</Label>
                    <p className="font-semibold">{testResult.coagulase}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">KB Disc</Label>
                    <p className="font-semibold">{testResult.kbDisc}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Urine Full Exam</Label>
                    <p className="font-semibold">{testResult.urineFullExam}</p>
                  </div>
                  {testResult.additionalFieldName && testResult.additionalFieldValue && (
                    <div>
                      <Label className="text-muted-foreground">{testResult.additionalFieldName}</Label>
                      <p className="font-semibold">{testResult.additionalFieldValue}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

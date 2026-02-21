import { useState } from 'react';
import { useGetAllDailyGoldUpdates, useSetDailyGoldUpdate } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader2, Plus, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export default function DailyGoldUpdatesManager() {
  const { data: updates, isLoading } = useGetAllDailyGoldUpdates();
  const setUpdateMutation = useSetDailyGoldUpdate();
  const [date, setDate] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date.trim() || !content.trim()) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      await setUpdateMutation.mutateAsync({
        date: date.trim(),
        content: content.trim(),
      });
      toast.success('Daily gold update saved successfully!');
      setDate('');
      setContent('');
    } catch (error) {
      toast.error('Failed to save daily gold update. Please try again.');
    }
  };

  const sortedUpdates = updates ? [...updates].sort((a, b) => b[0].localeCompare(a[0])) : [];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-amber-600" />
            Add Daily Gold Update
          </CardTitle>
          <CardDescription>Enter daily gold rate information</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Rate & Notes *</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter gold rate and any additional notes (e.g., 22K: ₹5,500/gram, 24K: ₹6,000/gram)"
                rows={4}
                required
                className="resize-none"
              />
            </div>
            <Button type="submit" disabled={setUpdateMutation.isPending}>
              {setUpdateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Plus className="w-4 h-4 mr-2" />
              Save Update
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Saved Daily Gold Updates</CardTitle>
          <CardDescription>View all saved daily gold rate updates</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : !sortedUpdates || sortedUpdates.length === 0 ? (
            <Alert>
              <AlertDescription>No daily gold updates yet.</AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Rate & Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedUpdates.map(([updateDate, updateContent]) => (
                    <TableRow key={updateDate}>
                      <TableCell className="font-medium">{updateDate}</TableCell>
                      <TableCell className="whitespace-pre-wrap">{updateContent}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

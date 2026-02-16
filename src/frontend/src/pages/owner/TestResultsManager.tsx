import { useState } from 'react';
import { useUpdateTestResult } from '../../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Loader2, Plus } from 'lucide-react';
import { toast } from 'sonner';
import type { TestResult } from '../../backend';

export default function TestResultsManager() {
  const updateTestResultMutation = useUpdateTestResult();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<TestResult>({
    serialNumber: '',
    cts: BigInt(0),
    hivTests: BigInt(0),
    platingTests: BigInt(0),
    potherTests: BigInt(0),
    hepatitisC: BigInt(0),
    hepatitisB: BigInt(0),
    rns: BigInt(0),
    serialNumber2: '',
    coagulase: '',
    kbDisc: '',
    urineFullExam: '',
    additionalFieldName: '',
    additionalFieldValue: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateTestResultMutation.mutateAsync(form);
      toast.success('Test result saved successfully!');
      setDialogOpen(false);
      setForm({
        serialNumber: '',
        cts: BigInt(0),
        hivTests: BigInt(0),
        platingTests: BigInt(0),
        potherTests: BigInt(0),
        hepatitisC: BigInt(0),
        hepatitisB: BigInt(0),
        rns: BigInt(0),
        serialNumber2: '',
        coagulase: '',
        kbDisc: '',
        urineFullExam: '',
        additionalFieldName: '',
        additionalFieldValue: '',
      });
    } catch (error) {
      toast.error('Failed to save test result. Please try again.');
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Test Result Entry</DialogTitle>
              <DialogDescription>
                Enter or update test result information
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number *</Label>
                  <Input
                    id="serialNumber"
                    value={form.serialNumber}
                    onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="serialNumber2">Serial Number 2</Label>
                  <Input
                    id="serialNumber2"
                    value={form.serialNumber2}
                    onChange={(e) => setForm({ ...form, serialNumber2: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cts">CTS</Label>
                  <Input
                    id="cts"
                    type="number"
                    value={form.cts.toString()}
                    onChange={(e) => setForm({ ...form, cts: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hivTests">HIV Tests</Label>
                  <Input
                    id="hivTests"
                    type="number"
                    value={form.hivTests.toString()}
                    onChange={(e) => setForm({ ...form, hivTests: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="platingTests">Plating Tests</Label>
                  <Input
                    id="platingTests"
                    type="number"
                    value={form.platingTests.toString()}
                    onChange={(e) => setForm({ ...form, platingTests: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="potherTests">Other Tests</Label>
                  <Input
                    id="potherTests"
                    type="number"
                    value={form.potherTests.toString()}
                    onChange={(e) => setForm({ ...form, potherTests: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hepatitisC">Hepatitis C</Label>
                  <Input
                    id="hepatitisC"
                    type="number"
                    value={form.hepatitisC.toString()}
                    onChange={(e) => setForm({ ...form, hepatitisC: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hepatitisB">Hepatitis B</Label>
                  <Input
                    id="hepatitisB"
                    type="number"
                    value={form.hepatitisB.toString()}
                    onChange={(e) => setForm({ ...form, hepatitisB: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rns">RNS</Label>
                  <Input
                    id="rns"
                    type="number"
                    value={form.rns.toString()}
                    onChange={(e) => setForm({ ...form, rns: BigInt(e.target.value || 0) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="coagulase">Coagulase</Label>
                  <Input
                    id="coagulase"
                    value={form.coagulase}
                    onChange={(e) => setForm({ ...form, coagulase: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kbDisc">KB Disc</Label>
                  <Input
                    id="kbDisc"
                    value={form.kbDisc}
                    onChange={(e) => setForm({ ...form, kbDisc: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urineFullExam">Urine Full Exam</Label>
                  <Input
                    id="urineFullExam"
                    value={form.urineFullExam}
                    onChange={(e) => setForm({ ...form, urineFullExam: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalFieldName">Custom Field Name</Label>
                  <Input
                    id="additionalFieldName"
                    placeholder="e.g., Blood Type"
                    value={form.additionalFieldName}
                    onChange={(e) => setForm({ ...form, additionalFieldName: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="additionalFieldValue">Custom Field Value</Label>
                  <Input
                    id="additionalFieldValue"
                    placeholder="e.g., O+"
                    value={form.additionalFieldValue}
                    onChange={(e) => setForm({ ...form, additionalFieldValue: e.target.value })}
                  />
                </div>
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

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ShareAppLinkCard() {
  const [appUrl, setAppUrl] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const url = window.location.origin;
    setAppUrl(url);

    // Generate QR code using a free API service
    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrApiUrl);
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-amber-600" />
          Share App
        </CardTitle>
        <CardDescription>
          Share this app with customers via WhatsApp, text, or QR code
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input value={appUrl} readOnly className="font-mono text-sm" />
            <Button variant="outline" onClick={handleCopy}>
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        {qrCodeUrl && (
          <div className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg border">
            <img src={qrCodeUrl} alt="App QR Code" className="w-64 h-64" />
            <p className="text-sm text-muted-foreground text-center">
              Scan this QR code to open the app
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

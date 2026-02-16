import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Fingerprint, AlertCircle } from 'lucide-react';

export default function SettingsPage() {
  const [biometricSupported, setBiometricSupported] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    const checkBiometricSupport = async () => {
      if (window.PublicKeyCredential) {
        const available = await window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        setBiometricSupported(available);
      }
    };
    
    checkBiometricSupport();
    
    const stored = localStorage.getItem('biometricLockEnabled');
    if (stored) {
      setBiometricEnabled(JSON.parse(stored));
    }
  }, []);

  const handleBiometricToggle = (enabled: boolean) => {
    setBiometricEnabled(enabled);
    localStorage.setItem('biometricLockEnabled', JSON.stringify(enabled));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Settings</h1>
        <p className="text-lg text-muted-foreground">Manage your app preferences</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Fingerprint className="w-5 h-5 text-amber-600" />
            Biometric Lock
          </CardTitle>
          <CardDescription>
            Secure your app with fingerprint or face recognition
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!biometricSupported ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Biometric authentication is not available on this device or browser.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="flex items-center justify-between">
              <Label htmlFor="biometric-lock" className="flex-1">
                Enable biometric lock
              </Label>
              <Switch
                id="biometric-lock"
                checked={biometricEnabled}
                onCheckedChange={handleBiometricToggle}
              />
            </div>
          )}
          
          {biometricSupported && biometricEnabled && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertDescription className="text-amber-800">
                Biometric lock is enabled. You will be prompted to authenticate when accessing protected areas.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

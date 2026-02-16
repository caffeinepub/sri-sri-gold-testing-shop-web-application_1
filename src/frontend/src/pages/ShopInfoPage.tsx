import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function ShopInfoPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-foreground">Shop Information</h1>
        <p className="text-lg text-muted-foreground">Sri Sri Gold Testing Shop</p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-amber-600" />
            Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">Opposite cloth complex, Kadapa main road, Mydukur</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5 text-amber-600" />
            Contact Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div>
            <a href="tel:7893552706" className="text-lg text-amber-600 hover:text-amber-700 font-medium">
              7893552706
            </a>
          </div>
          <div>
            <a href="tel:9701758114" className="text-lg text-amber-600 hover:text-amber-700 font-medium">
              9701758114
            </a>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-600" />
            Timings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg">9:00 AM to 8:00 PM</p>
        </CardContent>
      </Card>
    </div>
  );
}

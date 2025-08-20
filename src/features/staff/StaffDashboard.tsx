import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import { Card, CardContent, CardTitle, CardDescription } from '../../components/card';
import { Plane, ClipboardCheck, UtensilsCrossed } from 'lucide-react';

export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />
      <main className="container-custom section-padding">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-secondary-900">Staff Panel</h1>
          <p className="text-secondary-600">Select a function to begin.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Link to="/staff/check-in" className="block">
            <Card hover>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-primary-100 text-primary-600">
                    <ClipboardCheck className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle>Check-in Service</CardTitle>
                <CardDescription>Manage passenger check-in and seating</CardDescription>
              </CardContent>
            </Card>
          </Link>

          <Link to="/staff/in-flight" className="block">
            <Card hover>
              <CardContent className="p-8">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-warning-100 text-warning-600">
                    <UtensilsCrossed className="h-6 w-6" />
                  </div>
                </div>
                <CardTitle>In-flight Service</CardTitle>
                <CardDescription>Meals, ancillaries and shopping items</CardDescription>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  );
}


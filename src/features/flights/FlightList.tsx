import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFlights, deleteFlight } from '../../api/flightApi';
import type { Flight } from '../../types/flight';
import { Plane, Plus, Edit, Trash2, Users, Filter, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '../../components/Header';
import { Card, CardContent } from '../../components/card';
import Button from '../../components/Button';
import Input from '../../components/Input';

export default function FlightList() {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');


  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const data = await getAllFlights();
        setFlights(data);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch flights');
        setFlights([]);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this flight?')) return;
    try {
      await deleteFlight(id);
      setFlights(prev => prev.filter(f => f.flightId !== id));
    } catch (err: any) {
      alert(err.message || 'Failed to delete flight. Please try again.');
    }
  };

  const filteredFlights = flights.filter(flight => {
    const matchesSearch =
      flight.flightNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      flight.destination?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />

      <main className="container-custom section-padding">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-3xl font-bold text-secondary-900 mb-2">Flight Management</h1>
            <p className="text-secondary-600">Manage your airline's flight schedules and operations</p>
          </div>

          <Link to="/admin/flights/new">
            <Button size="lg" icon={<Plus className="h-4 w-4" />}>
              Add New Flight
            </Button>
          </Link>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Search flights by number, source, or destination..."
                  value={searchTerm}
                  onChange={setSearchTerm}
                  leftIcon={<Search className="h-4 w-4" />}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" icon={<Filter className="h-4 w-4" />}>
                  Filter
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-secondary-600">Loading flights...</p>
            </div>
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-8 text-center">
              <div className="text-red-500 mb-4">
                <Plane className="h-12 w-12 mx-auto mb-2" />
                <p className="text-lg font-medium">Error loading flights</p>
                <p className="text-sm">{error}</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredFlights.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Plane className="h-12 w-12 text-secondary-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">No flights found</h3>
              <p className="text-secondary-600 mb-4">
                {searchTerm ? 'Try adjusting your search criteria' : 'Get started by adding your first flight'}
              </p>
              <Link to="/admin/flights/new">
                <Button>Add Flight</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredFlights.map((flight, index) => {
              const departure = formatDateTime(flight.departureTime);
              const arrival = formatDateTime(flight.arrivalTime);

              return (
                <motion.div
                  key={flight.flightId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card hover>
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                        {/* Flight Info */}
                        <div className="flex-1 mb-4 lg:mb-0">
                          <div className="flex items-center space-x-4 mb-4">
                            <div className="p-2 bg-primary-100 rounded-xl">
                              <Plane className="h-5 w-5 text-primary-600" />
                            </div>
                            <div>
                              <h3 className="text-lg font-semibold text-secondary-900">
                                {flight.flightNumber || 'N/A'}
                              </h3>
                              <div className="flex items-center space-x-4 text-sm text-secondary-600">
                                <span className="flex items-center space-x-1">
                                  <Users className="h-4 w-4" />
                                  <span>{flight.availableSeats || 0} seats</span>
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Route */}
                          <div className="flex items-center space-x-4">
                            <div className="text-center">
                              <p className="text-sm font-medium text-secondary-900">{departure.time}</p>
                              <p className="text-xs text-secondary-500">{departure.date}</p>
                              <p className="text-sm font-medium text-secondary-700 mt-1">
                                {flight.source || 'N/A'}
                              </p>
                            </div>

                            <div className="flex-1 flex items-center justify-center">
                              <div className="flex items-center space-x-2">
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                                <div className="flex-1 h-px bg-secondary-300"></div>
                                <Plane className="h-4 w-4 text-primary-600" />
                                <div className="flex-1 h-px bg-secondary-300"></div>
                                <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                              </div>
                            </div>

                            <div className="text-center">
                              <p className="text-sm font-medium text-secondary-900">{arrival.time}</p>
                              <p className="text-xs text-secondary-500">{arrival.date}</p>
                              <p className="text-sm font-medium text-secondary-700 mt-1">
                                {flight.destination || 'N/A'}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2">
                          <Link to={`/admin/flights/edit/${flight.flightId}`}>
                            <Button variant="secondary" size="sm" icon={<Edit className="h-4 w-4" />}>
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(flight.flightId)}
                            icon={<Trash2 className="h-4 w-4" />}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

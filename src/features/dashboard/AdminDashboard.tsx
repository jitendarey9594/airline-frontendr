import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../redux/store";
import { Card, CardContent, CardTitle, CardDescription } from "../../components/card";
import { Plane, Users, ConciergeBell, BarChart3, Calendar, Settings } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../../components/Header";

export default function AdminDashboard() {
  const admin = useSelector((state: RootState) => state.auth.admin);

  const dashboardCards = [
    {
      title: "Flights",
      description: "View, add, and manage flight schedules",
      icon: Plane,
      href: "/admin/flights",
      color: "primary",
      stats: "24 Active"
    },
    {
      title: "Passengers",
      description: "Browse passenger details and preferences",
      icon: Users,
      href: "/admin/passengers",
      color: "success",
      stats: "1,247 Total"
    },
    {
      title: "Services",
      description: "Manage meal, wheelchair, and infant services",
      icon: ConciergeBell,
      href: "/admin/services",
      color: "warning",
      stats: "15 Categories"
    }
  ];

  const quickStats = [
    { label: "Today's Flights", value: "12", change: "+2" },
    { label: "Active Bookings", value: "847", change: "+15%" },
    { label: "Revenue", value: "$24,500", change: "+8%" },
    { label: "Satisfaction", value: "4.8/5", change: "+0.2" }
  ];

  return (
    <div className="min-h-screen bg-background-secondary">
      <Header />

      <main className="container-custom section-padding">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-secondary-900 mb-2">
            Welcome back, {admin?.username || "Admin"}
          </h1>
          <p className="text-lg text-secondary-600">
            Here's what's happening with your airline operations today.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickStats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-secondary-600">{stat.label}</p>
                      <p className="text-2xl font-bold text-secondary-900">{stat.value}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-medium text-success-600">{stat.change}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Main Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {dashboardCards.map((card, index) => {
            const Icon = card.icon;
            const colorClasses = {
              primary: "text-primary-600 bg-primary-100",
              success: "text-success-600 bg-success-100",
              warning: "text-warning-600 bg-warning-100"
            };

            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to={card.href}>
                  <Card hover className="h-full">
                    <CardContent className="p-8">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-2xl ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <span className="text-sm font-medium text-secondary-500">{card.stats}</span>
                      </div>
                      <CardTitle className="mb-2">{card.title}</CardTitle>
                      <CardDescription>{card.description}</CardDescription>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary-100 rounded-xl">
                    <BarChart3 className="h-5 w-5 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Analytics</h3>
                    <p className="text-sm text-secondary-600">View detailed reports</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success-100 rounded-xl">
                    <Calendar className="h-5 w-5 text-success-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Schedule</h3>
                    <p className="text-sm text-secondary-600">Manage flight schedules</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning-100 rounded-xl">
                    <Settings className="h-5 w-5 text-warning-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary-900">Settings</h3>
                    <p className="text-sm text-secondary-600">System configuration</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

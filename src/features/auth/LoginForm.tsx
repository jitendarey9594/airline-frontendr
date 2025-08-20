import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../../api/authApi';
import { setAuth } from './authSlice';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Plane } from 'lucide-react';
import Input from '../../components/Input';
import Button from '../../components/Button';
import { Card, CardContent } from '../../components/card';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await loginAdmin(email, password);
      dispatch(setAuth({ token: data.token, admin: data.admin }));
      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch {
      setError('Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <span className="text-3xl font-bold text-secondary-900">Dynamics</span>
          </div>
          <h1 className="text-2xl font-semibold text-secondary-900 mb-2">Welcome back</h1>
          <p className="text-secondary-600">Sign in to your admin account</p>
        </div>

        {/* Login Card */}
        <Card className="animate-slide-up">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <Input
                label="Email Address"
                type="string"
                value={email}
                onChange={setEmail}
                placeholder="Enter your email"
                leftIcon={<Mail className="h-4 w-4" />}
                required
              />

              <Input
                label="Password"
                type="password"
                value={password}
                onChange={setPassword}
                placeholder="Enter your password"
                leftIcon={<Lock className="h-4 w-4" />}
                required
              />

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary-500">
                Need help? Contact your system administrator
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-secondary-400">
            © 2024 Dynamics Airlines. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

// src/features/auth/LoginForm.tsx

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { loginAdmin } from '../../api/authApi';
import { setAuth } from './authSlice';
import { useNavigate } from 'react-router-dom';
import Input from '../../components/Input';
import Button from '../../components/Button';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const data = await loginAdmin(email, password);
     dispatch(setAuth({ token: data.token, admin: data.admin }));

      localStorage.setItem('token', data.token);
      navigate('/admin/dashboard');
    } catch {
      alert('Invalid credentials');
    }
  };
  

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white shadow rounded">
      <h2 className="text-xl font-semibold mb-4">Admin Login</h2>
      <Input label="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <Input label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
      <Button text="Login" onClick={handleSubmit} />
    </div>
  );
};

export default LoginForm; // ✅ must be default export
